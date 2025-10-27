import React, { useState, useEffect } from "react";
import NavigationBar from "../components/NavigationBar";
import axios from "axios";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const EquipmentManagement = () => {
  const [equipments, setEquipments] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    condition: "",
    quantity: 0,
    availability: true,
  });
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [error, setError] = useState(null);

  const API_URL = "http://localhost:5000/api/equipment";

  const fetchEquipments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/equipment?ts=${Date.now()}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Cache-Control": "no-cache"
      },
      });
      setEquipments(Array.isArray(res.data) ? res.data : res.data.equipments || []);
    } 
    catch (err) 
    {
      console.error("Error fetching equipments:", err);
      setError("Failed to fetch equipments");
    }
  };

  useEffect(() => {
    fetchEquipments();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? String(checked) : value
    });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      console.error("Token:", token);
      await axios.post(API_URL, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      });
      fetchEquipments();
      resetForm();
    } 
    catch (err) 
    {
      console.error("Error adding equipment:", err);
      setError(err.response?.data?.error || "Failed to add equipment");
    }
  };

  const handleEdit = (equipment) => {
    setEditMode(true);
    setSelectedId(equipment.id);
    setFormData({
      id: equipment.id,
      name: equipment.name,
      category: equipment.category,
      condition: equipment.condition,
      quantity: equipment.quantity,
      availability: String(equipment.availability)
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.patch(API_URL, {
          ...formData,
          id: selectedId,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
      fetchEquipments();
      resetForm();
    } 
    catch (err) 
    {
      console.error("Error updating equipment:", err);
      setError(err.response?.data?.error || "Failed to update equipment");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this equipment?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      });
      fetchEquipments();
    } 
    catch (err) 
    {
      console.error("Error deleting equipment:", err);
      setError(err.response?.data?.error || "Failed to delete equipment");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      condition: "",
      quantity: 0,
      availability: "true",
    });
    setEditMode(false);
    setSelectedId(null);
  };

  return (
    <div>
      <NavigationBar />
      <div style={{ padding: "20px", color: "white" }}>
        <h2 style={{ color: "#457b9d" }}>Equipment Management</h2>
        <form
          onSubmit={editMode ? handleUpdate : handleAdd}
          style={{
            background: "#1d3557",
            padding: "20px",
            borderRadius: "10px",
            width: "400px",
            marginBottom: "30px",
          }}
        >
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={editMode}
            style={{ width: "100%", marginBottom: "10px" }}
          />

          <label>Category:</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            disabled={editMode}
            style={{ width: "100%", marginBottom: "10px" }}
          />

          <label>Condition:</label>
          <input
            type="text"
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            required
            style={{ width: "100%", marginBottom: "10px" }}
          />

          <label>Quantity:</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            min="0"
            style={{ width: "100%", marginBottom: "10px" }}
          />

          <label style={{ display: "flex", alignItems: "center" }}>
            <input
              type="checkbox"
              name="availability"
              checked={formData.availability === "true"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  availability: e.target.checked ? "true" : "false"
                })
              }
              style={{ marginRight: "10px" }}
            />
            Available
          </label>

          <button
            type="submit"
            style={{
              backgroundColor: editMode ? "#ffb703" : "#457b9d",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "6px",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            {editMode ? "Update Equipment" : "Add Equipment"}
          </button>

          {editMode && (
            <button
              type="button"
              onClick={resetForm}
              style={{
                marginLeft: "10px",
                backgroundColor: "#999",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          )}
        </form>

        <h3 style={{ color: "#457b9d" }}>All Equipments</h3>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "#1d3557",
            borderRadius: "8px",
            overflow: "hidden"
          }}
        >
          <thead style={{ background: "#457b9d", color: "white" }}>
            <tr>
              <th style={{ padding: "10px" }}>Name</th>
              <th style={{ padding: "10px" }}>Category</th>
              <th style={{ padding: "10px" }}>Condition</th>
              <th style={{ padding: "10px" }}>Quantity</th>
              <th style={{ padding: "10px" }}>Available</th>
              <th style={{ padding: "10px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {equipments.length > 0 ? (
              equipments.map((item) => (
                <tr key={item.id} style={{ textAlign: "left" }}>
                  <td style={{ padding: "5px 0px 5px 10px" }}>{item.name}</td>
                  <td style={{ padding: "5px 0px 5px 10px" }}>{item.category}</td>
                  <td style={{ padding: "5px 0px 5px 10px" }}>{item.condition}</td>
                  <td style={{ padding: "5px 0px 5px 10px" }}>{item.quantity}</td>
                  <td style={{ padding: "5px 0px 5px 10px" }}>{item.availability ? "Yes" : "No"}</td>
                  <td style={{ padding: "5px 0px 10px 10px" }}>
                    <button
                      onClick={() => handleEdit(item)}
                      style={{
                        color: "white",
                        background: "#457b9d",
                        border: "none",
                        padding: "5px 10px",
                        borderRadius: "5px",
                        marginRight: "5px",
                        cursor: "pointer",
                        alignContent: "center"
                      }}
                    >
                      <FiEdit size={18} color="white" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      style={{
                        background: "#8a1e27ff",
                        border: "none",
                        padding: "5px 10px",
                        borderRadius: "5px",
                        color: "white",
                        cursor: "pointer",
                        alignContent: "center"
                      }}
                    >
                      <FiTrash2 size={18} color="white" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ color: "white", padding: "10px" }}>
                  No equipment found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EquipmentManagement;
