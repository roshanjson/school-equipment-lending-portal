import { useState } from "react";
import axios from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/auth/signup", formData);
      alert("Signup successful! Please login.");
      navigate("/login");
    } 
    catch (err) 
    {
      console.error(err);
      alert(err.response?.data?.message || "Signup failed. Try again.");
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
          height: "575px"
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Create Account
        </h2>
        <form onSubmit={handleSubmit}>

          <div style={{ marginBottom: "15px" }}>
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "5px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "5px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "5px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label>Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "5px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            >
              <option value="student">Student</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              width: "100%",
              backgroundColor: "#1d3557",
              color: "white",
              padding: "10px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Sign Up
          </button>
        </form>

        {/* Go to Login */}
        <div style={{ textAlign: "center", marginTop: "15px" }}>
          <p style={{ fontSize: "0.9rem" }}>
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              style={{
                background: "none",
                border: "none",
                color: "#1d3557",
                textDecoration: "underline",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
