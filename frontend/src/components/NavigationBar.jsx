import { useNavigate } from "react-router-dom";

const NavigationBar = () => {
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
          onClick={handleLogout}
          style={{
            backgroundColor: "maroon",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "bold",
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default NavigationBar;
