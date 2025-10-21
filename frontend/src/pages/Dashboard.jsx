import { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import NavigationBar from "../components/NavigationBar";

const Dashboard = () => {
  const [equipment, setEquipment] = useState([]);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const res = await axios.get("/equipment");
        setEquipment(res.data);
      } 
      catch (err) 
      {
        console.error("Error fetching equipment:", err);
      }
    };
    fetchEquipment();
  }, []);

  return (
    <div>
      <NavigationBar />

      <div className="container-fluid mt-4" style={{ alignItems: "left", gap: "1rem" }}>
        <h2 style={{ fontSize: "1.5rem" }}>Equipment Dashboard</h2>

        <div className="row mt-3">
          {equipment.length === 0 ? (
            <p>No equipment available.</p>
          ) : (
            equipment.map((item) => (
              <div style={{
                    padding: "0px 0px 0px 10px"
                  }} key={item.id} className="col-md-2 mb-3">
                <div
                  className="card p-1"
                  style={{
                    background: "#eed09fff",
                    borderRadius: "8px"
                  }}
                >
                  <h5 style={{ fontSize: "1rem", padding: "10px 0px 0px 10px" }}>{item.name}</h5>
                  <p style={{ fontSize: "0.9rem", padding: "0px 0px 0px 10px", margin: "0 0 0 0" }}>Category: {item.category}</p>
                  <p style={{ fontSize: "0.9rem", padding: "0px 0px 0px 10px", margin: "0 0 0 0" }}>Condition: {item.condition}</p>
                  <p style={{ fontSize: "0.9rem", padding: "0px 0px 0px 10px", margin: "0 0 0 0" }}>Quantity: {item.quantity}</p>
                  <p style={{ fontSize: "0.9rem", padding: "0px 0px 10px 10px", margin: "0 0 0 0" }}>Available: {item.availability ? "Yes" : "No"}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
