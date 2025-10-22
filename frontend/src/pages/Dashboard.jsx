import { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import NavigationBar from "../components/NavigationBar";
import { FiRefreshCcw } from "react-icons/fi";

const Dashboard = () => {
const [equipment, setEquipment] = useState([]);
const [selectedItems, setSelectedItems] = useState({});
const [isInitialLoad, setIsInitialLoad] = useState(true);

useEffect(() => {
  fetchEquipment();
}, []);

const fetchEquipment = async () => {
  try {
    const res = await axios.get("/equipment");
    setEquipment(res.data);

    setSelectedItems((prev) => {
      const newSelections = { ...prev };
      let changed = false;

      res.data.forEach((item) => {
        if (!newSelections[item.id]) {
          newSelections[item.id] = {
            quantity: 0,
            ...getDefaultDates(),
          };
          changed = true;
        }
      });

      return changed || isInitialLoad ? newSelections : prev;
    });

    setIsInitialLoad(false);
  } 
  catch (err) 
  {
    const errorMessage = err.response?.data?.error || "Error fetching equipment. Try again.";
    alert(errorMessage);
  }
};


const getDefaultDates = () => {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const formatDate = (date) => date.toISOString().split("T")[0];
  return {
    borrowDate: formatDate(today),
    returnDate: formatDate(tomorrow),
  };
};

  const handleIncrement = (id, max) => {
    setSelectedItems((prev) => {
    const current = prev[id] || {};
    const currentQty = current.quantity || 0;
    return {
      ...prev,
      [id]: {
        ...current,
        quantity: Math.min(currentQty + 1, max),
      },
    };
  });
};

  const handleDecrement = (id) => {
  setSelectedItems((prev) => {
    const current = prev[id] || {};
    const currentQty = current.quantity || 0;
    return {
      ...prev,
      [id]: {
        ...current,
        quantity: Math.max(currentQty - 1, 0),
      },
    };
  });
};

  const handleBorrow = async () => {
  const itemsToBorrow = Object.entries(selectedItems)
    .filter(([_, item]) => item.quantity > 0)
    .map(([id, item]) => ({
      equipmentId: id,
      quantity: item.quantity,
      borrowDate: item.borrowDate,
      returnDate: item.returnDate,
    }));

    if (itemsToBorrow.length === 0) {
      alert("Please select at least one item to borrow.");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const borrowerId = user?.id;

      for (const item of itemsToBorrow) {
      await axios.post("/borrow-request/", {
        equipmentId: item.equipmentId,
        userId: borrowerId,
        quantity: item.quantity,
        borrowDate: new Date(item.borrowDate).toISOString().split("T")[0],
        returnDate: new Date(item.returnDate).toISOString().split("T")[0],
        status: "requested",
      });
    }

      alert("Borrow request(s) submitted successfully!");
      fetchEquipment();
    } 
    catch (err) 
    {
      const errorMessage = err.response?.data?.error || "Failed to submit borrow requests. Try again.";
      alert(errorMessage);
    }
  };

  return (
    <div>
      <NavigationBar />

      <div className="container-fluid mt-4" style={{ gap: "1rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h2 style={{ fontSize: "1.5rem" }}>Equipment Dashboard</h2>
            <FiRefreshCcw 
                size={24}
                style={{ cursor: "pointer", color: "#315e26ff" }}
                onClick={fetchEquipment}
                title="Refresh"
            />
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handleBorrow}
              style={{
                backgroundColor: "#457b9d",
                color: "white",
                padding: "8px 16px",
                border: "none",
                borderRadius: "6px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Borrow Selected Items
            </button>
          </div>
        </div>

        <div className="row mt-3">
          {equipment.length === 0 ? (
            <p>No equipments are available for borrowing at the moment.</p>
          ) : (
            equipment.map((item) => {
              const quantity = selectedItems[item.id] || 0;
              return (
                <div
                  key={item.id}
                  className="col-md-3 mb-3"
                  style={{ padding: "0px 0px 0px 10px" }}
                >
                  <div
                    className="card p-2"
                    style={{
                      background: "#1d3557",
                      borderRadius: "8px",
                      transition: "0.2s ease-in-out",
                    }}
                  >
                    <h4
                      style={{
                        fontSize: "1.1rem",
                        color: "white",
                        padding: "10px 0px 0px 10px"
                      }}
                    >
                      {item.name}
                    </h4>
                    <p
                      style={{
                        fontSize: "0.9rem",
                        color: "white",
                        padding: "0px 0px 0px 10px",
                        margin: 0,
                      }}
                    >
                      Category: {item.category}
                    </p>
                    <p
                      style={{
                        fontSize: "0.9rem",
                        color: "white",
                        padding: "0px 0px 0px 10px",
                        margin: 0,
                      }}
                    >
                      Condition: {item.condition}
                    </p>
                    <p
                      style={{
                        fontSize: "0.9rem",
                        color: "white",
                        padding: "0px 0px 0px 10px",
                        margin: 0,
                      }}
                    >
                      Quantity: {item.quantity}
                    </p>
                    <p
                      style={{
                        fontSize: "0.9rem",
                        color: "white",
                        padding: "0px 0px 10px 10px",
                        margin: 0,
                      }}
                    >
                      Available: {item.availability ? "Yes" : "No"}
                    </p>

                    <label style={{
                        color: "white",
                        padding: "0px 0px 10px 10px",
                        margin: 0,
                        borderRadius: "8px",
                        width: "400px",
                        fontSize: "0.9rem"
                        }}>
                        Borrow Date
                        <input
                          type="date"
                          value={selectedItems[item.id]?.borrowDate || ""}
                          onChange={(e) =>
                            setSelectedItems((prev) => ({
                              ...prev,
                              [item.id]: {
                                ...prev[item.id],
                                borrowDate: e.target.value,
                              },
                            }))
                          }
                          style={{ width: "40%", marginLeft: "10px" }}
                        />
                      </label>
                      
                      <label style={{ color: "white",
                                    padding: "0px 0px 10px 10px",
                                    margin: 0,
                                    borderRadius: "8px",
                                    width: "400px",
                                    fontSize: "0.9rem" }}>
                        Return Date:
                        <input
                          type="date"
                          value={selectedItems[item.id]?.returnDate || ""}
                          onChange={(e) =>
                            setSelectedItems((prev) => ({
                              ...prev,
                              [item.id]: {
                                ...prev[item.id],
                                returnDate: e.target.value,
                              },
                            }))
                          }
                          style={{ width: "40%", marginLeft: "10px" }}
                        />
                      </label>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "right",
                        alignItems: "center",
                        gap: "15px",
                        paddingBottom: "5px",
                      }}
                    >

                      <button
                        onClick={() => handleDecrement(item.id)}
                        style={{
                          padding: "1px 10px",
                          borderRadius: "20px",
                          border: "none",
                          cursor: "pointer",
                          alignItems: "center",
                          fontWeight: "bold"
                        }}
                      >
                        -
                      </button>
                      <span style={{ color: "white", fontWeight: "bold" }}>
                        {selectedItems[item.id]?.quantity || 0}
                      </span>
                      <button
                        onClick={() => handleIncrement(item.id, item.quantity)}
                        style={{
                          padding: "1px 8px",
                          borderRadius: "20px",
                          border: "none",
                          cursor: "pointer",
                          alignItems: "center",
                          fontWeight: "bold"
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
