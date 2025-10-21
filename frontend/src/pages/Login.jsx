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
    <div className="container mt-10" style={{ maxWidth: "400px" }}>
      <h3>Login</h3>
      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
            <input type="email" placeholder="Email" className="form-control my-2" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="row mb-3">
            <input type="password" placeholder="Password" className="form-control my-2" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <div className="row mb-3">
            <button className="btn btn-primary w-100">Login</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
