import { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [equipment, setEquipment] = useState([]);
  const navigate = useNavigate();

  // Fetch equipment from backend
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const res = await axios.get("/equipment"); // GET /api/equipment
        setEquipment(res.data);
      } catch (err) {
        console.error("Error fetching equipment:", err);
      }
    };
    fetchEquipment();
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("user"); // Clear user info
    localStorage.removeItem("token"); // Clear token if stored
    navigate("/login"); // Redirect to login
  };

  return (
    <div className="container mt-4">
      {/* Header with Logout button */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2>Equipment Dashboard</h2>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#e63946",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      {/* Equipment list */}
      <div className="row">
        {equipment.length === 0 ? (
          <p>No equipment available.</p>
        ) : (
          equipment.map((item) => (
            <div key={item.id} className="col-md-4 mb-3">
              <div className="card p-3">
                <h5>{item.name}</h5>
                <p>Category: {item.category}</p>
                <p>Condition: {item.condition}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Available: {item.availability ? "Yes" : "No"}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
