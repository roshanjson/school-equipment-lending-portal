import { useState, useContext } from "react";
import axios from "../api/axiosInstance";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/login", form);
      const { token } = res.data;
      const userPayload = JSON.parse(atob(token.split(".")[1]));
      login({ id: userPayload.id, role: userPayload.role }, token);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f1f1f1",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "8px",
          width: "400px",
        }}
      >
      <h3 style={{ textAlign: "center", marginBottom: "20px" }}>Login</h3>
      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
            <input type="email" placeholder="Email" className="form-control my-2" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="row mb-3">
            <input type="password" placeholder="Password" className="form-control my-2" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <div className="row mb-3">
            <button type="submit" style={{
              width: "100%",
              backgroundColor: "#1d3557",
              color: "white",
              padding: "10px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}>Login</button>
        </div>
      </form>
        <div style={{ textAlign: "center", marginTop: "15px" }}>
          <p style={{ fontSize: "0.9rem" }}>
            Do not have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              style={{
                background: "none",
                border: "none",
                color: "#1d3557",
                textDecoration: "underline",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Sign Up
            </button>
          </p>
        </div>
    </div>
    </div>
  );
};

export default Login;
