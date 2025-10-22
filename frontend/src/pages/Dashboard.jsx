import { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import NavigationBar from "../components/NavigationBar";
import { FiRefreshCcw } from "react-icons/fi";

const Dashboard = () => {
  const [equipment, setEquipment] = useState([]);
  const [selectedItems, setSelectedItems] = useState({}); // { equipmentId: quantity }

  useEffect(() => {fetchEquipment();}, []);

  const fetchEquipment = async () => {
      try {
        const res = await axios.get("/equipment");
        setEquipment(res.data);
      } catch (err) {
        console.error("Error fetching equipment:", err);
      }
    };

  const handleIncrement = (id, max) => {
    setSelectedItems((prev) => ({
      ...prev,
      [id]: Math.min((prev[id] || 0) + 1, max),
    }));
  };

  const handleDecrement = (id) => {
    setSelectedItems((prev) => ({
      ...prev,
      [id]: Math.max((prev[id] || 0) - 1, 0),
    }));
  };

  const handleBorrow = async () => {
    const itemsToBorrow = Object.entries(selectedItems)
      .filter(([_, qty]) => qty > 0)
      .map(([id, qty]) => ({ equipmentId: id, quantity: qty }));

    if (itemsToBorrow.length === 0) {
      alert("Please select at least one item to borrow.");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const borrowerId = user?.id;

      for (const item of itemsToBorrow) {
        const date = new Date();
        await axios.post("/borrow-request/", {
          equipmentId: item.equipmentId,
          userId: borrowerId,
          quantity: item.quantity,
          borrowDate: date.getDate(),
          returnDate: (new Date()).setDate(date.getDate() + 1),
          status: "requested",
        });
      }

      alert("Borrow request(s) submitted successfully!");
      setSelectedItems({});
      fetchEquipment();
    } catch (err) {
      console.error("Error submitting borrow requests:", err);
      alert("Failed to submit borrow requests. Try again.");
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
                onClick={fetchEquipment} // call your fetch function
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
                  className="col-md-2 mb-3"
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
                    <h5
                      style={{
                        fontSize: "1rem",
                        color: "white",
                        padding: "10px 0px 0px 10px",
                      }}
                    >
                      {item.name}
                    </h5>
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
                        {quantity}
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
