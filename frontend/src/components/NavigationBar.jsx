import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";

const NavigationBar = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav
      style={{
        backgroundColor: "#1d3557",
        color: "black",
        padding: "10px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h2 style={{ margin: 0, fontSize: "1.8rem", color: "white" }}>School Equipment Lending Portal</h2>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            background: "#457b9d",
            color: "white",
            padding: "8px 16px",
            border: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Dashboard
        </button>
        {user?.role === "admin" && (
          <button
            onClick={() => navigate("/equipment-management")}
            style={{
              background: "#457b9d",
              color: "white",
              padding: "8px 16px",
              border: "none",
              borderRadius: "6px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            Manage Equipments
          </button>
        )}
        {user?.role === "admin" && (
          <button
            onClick={() => navigate("/borrow-request-management")}
            style={{
              background: "#457b9d",
              color: "white",
              padding: "8px 16px",
              border: "none",
              borderRadius: "6px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            Manage Borrow Requests
          </button>
        )}
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#8a1e27ff",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "bold"
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default NavigationBar;
