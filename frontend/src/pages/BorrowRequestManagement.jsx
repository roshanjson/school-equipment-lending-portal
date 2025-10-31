import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import {
  FiCheckCircle,
  FiXCircle,
  FiRefreshCcw,
  FiEdit,
  FiTrash2,
  FiSave,
} from "react-icons/fi";
import NavigationBar from "../components/NavigationBar";

const BorrowRequestsManagement = () => {
  const [requests, setRequests] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [editData, setEditData] = useState({});
  const { user } = useContext(AuthContext);

  const API_URL = "http://localhost:5000/api/borrow-request";

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}?ts=${Date.now()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
        },
      });
      setRequests(response.data);
    } catch (err) {
      console.error("Error fetching borrow requests:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleDelete = async (requestId) => {
    if (!window.confirm("Are you sure you want to delete this borrow request?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/${requestId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchRequests();
    } catch (err) {
      console.error("Error deleting request:", err);
    }
  };

  const handleEdit = (request) => {
    setEditMode(request.id);
    setEditData({
      quantity: request.quantity || "",
      borrowDate: request.borrowDate ? request.borrowDate.slice(0, 10) : "",
      returnDate: request.returnDate ? request.returnDate.slice(0, 10) : "",
      status: request.status || ""
    });
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = async (requestId, userId, equipmentId) => {
    try {
      const token = localStorage.getItem("token");
      console.log( editData.quantity);
      await axios.patch(`${API_URL}/`,
        {
          id: requestId,
          userId,
          equipmentId,
          quantity: editData.quantity,
          borrowDate: editData.borrowDate,
          returnDate: editData.returnDate,
          status: editData.status
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditMode(null);
      fetchRequests();
    } catch (err) {
      console.error("Error saving edit:", err);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(null);
    setEditData({});
  };

  return (
    <div>
      <NavigationBar />
      <div style={{ padding: "20px", color: "white" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h2 style={{ color: "#457b9d" }}>Borrow Requests Management</h2>
          <FiRefreshCcw
            size={22}
            style={{ cursor: "pointer", color: "#457b9d" }}
            title="Refresh"
            onClick={fetchRequests}
          />
        </div>

        {requests.length === 0 ? (
          <p>No borrow requests found.</p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "20px",
              background: "#1d3557",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <thead style={{ background: "#457b9d", color: "white" }}>
              <tr>
                <th style={{ padding: "10px" }}>Request ID</th>
                <th style={{ padding: "10px" }}>Student ID</th>
                <th style={{ padding: "10px" }}>Student Name</th>
                <th style={{ padding: "10px" }}>Equipment</th>
                <th style={{ padding: "10px" }}>Quantity</th>
                <th style={{ padding: "10px" }}>Borrow Date</th>
                <th style={{ padding: "10px" }}>Return Date</th>
                <th style={{ padding: "10px" }}>Status</th>
                <th style={{ padding: "10px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id} style={{ textAlign: "left" }}>
                  <td style={{ padding: "8px 0px 8px 10px" }}>{request.id}</td>
                  <td style={{ padding: "8px 0px 8px 10px" }}>
                    {request.User?.id || "N/A"}
                  </td>
                  <td style={{ padding: "8px 0px 8px 10px" }}>
                    {request.User?.name || "N/A"}
                  </td>
                  <td style={{ padding: "8px 0px 8px 10px" }}>
                    {request.Equipment?.name || "N/A"}
                  </td>

                  {editMode === request.id ? (
                    <>
                      <td style={{ padding: "8px" }}>
                        <input
                          type="number"
                          name="quantity"
                          value={editData.quantity}
                          onChange={handleChange}
                          style={{
                            width: "60px",
                            padding: "3px",
                            borderRadius: "5px",
                          }}
                        />
                      </td>
                      <td style={{ padding: "8px" }}>
                        <input
                          type="date"
                          name="borrowDate"
                          value={editData.borrowDate}
                          onChange={handleChange}
                          style={{ padding: "3px", borderRadius: "5px" }}
                        />
                      </td>
                      <td style={{ padding: "8px" }}>
                        <input
                          type="date"
                          name="returnDate"
                          value={editData.returnDate}
                          onChange={handleChange}
                          style={{ padding: "3px", borderRadius: "5px" }}
                        />
                      </td>
                      {user?.role === "admin" && (
                      <td style={{ padding: "8px" }}>
                          <select
                            name="status"
                            value={editData.status}
                            onChange={handleChange}
                            style={{
                              padding: "3px",
                              borderRadius: "5px",
                              width: "120px",
                            }}
                          >
                            <option value="requested">REQUESTED</option>
                            <option value="approved">APPROVED</option>
                            <option value="rejected">REJECTED</option>
                            <option value="returned">RETURNED</option>
                            <option value="pending">PENDING</option>
                          </select>
                      </td>
                      )}
                      {user?.role !== "admin" && (
                      <td style={{ padding: "8px" }}>
                        {request.status.toUpperCase()}
                      </td>
                      )}
                    </>
                  ) : (
                    <>
                      <td style={{ padding: "8px" }}>{request.quantity}</td>
                      <td style={{ padding: "8px" }}>
                        {new Date(request.borrowDate).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            weekday: "short",
                            day: "2-digit",
                            year: "numeric",
                          }
                        )}
                      </td>
                      <td style={{ padding: "8px" }}>
                        {new Date(request.returnDate).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            weekday: "short",
                            day: "2-digit",
                            year: "numeric",
                          }
                        )}
                      </td>
                      {user?.role !== "admin" && (
                      <td style={{ padding: "8px" }}>
                        {request.status.toUpperCase()}
                      </td>
                      )}
                    </>
                  )}

                  <td style={{ padding: "8px" }}>
                    {editMode === request.id ? (
                      <>
                        <button
                          onClick={() =>
                            handleSaveEdit(
                              request.id,
                              request.User?.id,
                              request.Equipment?.id
                            )
                          }
                          title="Save"
                          style={{
                            background: "#20742bff",
                            border: "none",
                            color: "white",
                            padding: "6px 10px",
                            borderRadius: "5px",
                            cursor: "pointer",
                            marginRight: "5px",
                          }}
                        >
                          <FiSave />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          title="Cancel"
                          style={{
                            background: "#8a1e27ff",
                            border: "none",
                            color: "white",
                            padding: "6px 10px",
                            borderRadius: "5px",
                            cursor: "pointer",
                          }}
                        >
                          <FiXCircle />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          disabled={ user.role !== "admin" && request.status !== "requested" }
                          onClick={() => handleEdit(request)}
                          title="Edit"
                          style={{
                            background: user.role !== "admin" && request.status === "requested" ? "#457b9d" : "#8b8b8bff",
                            border: "none",
                            color: "white",
                            padding: "6px 10px",
                            borderRadius: "5px",
                            cursor: "pointer",
                            marginRight: "5px",
                          }}
                        >
                          <FiEdit />
                        </button>
                        <button
                          disabled={ user.role !== "admin" }
                          onClick={() => handleDelete(request.id)}
                          title="Delete"
                          style={{
                            background: user.role === "admin" ? "#8a1e27ff" : "#8b8b8bff",
                            border: "none",
                            color: "white",
                            padding: "6px 10px",
                            borderRadius: "5px",
                            cursor: "pointer",
                          }}
                        >
                          <FiTrash2 />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default BorrowRequestsManagement;
