import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import NavigationBar from "../components/NavigationBar";
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  Select,
  MenuItem,
  Tooltip,
  Chip,
  Fade,
  Snackbar,
  Alert,
  FormControl,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import RefreshIcon from '@mui/icons-material/Refresh';

// Helper function for status chip styles
const getStatusStyles = (status) => {
  const styles = {
    requested: { backgroundColor: '#ff9800', color: 'white' },
    approved: { backgroundColor: '#4caf50', color: 'white' },
    rejected: { backgroundColor: '#f44336', color: 'white' },
    returned: { backgroundColor: '#2196f3', color: 'white' },
    pending: { backgroundColor: '#757575', color: 'white' },
  };
  return styles[status?.toLowerCase()] || styles.pending;
};

// Styled Components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  color: 'white',
  padding: theme.spacing(2),
  borderBottom: `1px solid ${alpha('#fff', 0.1)}`,
  '&.MuiTableCell-head': {
    backgroundColor: '#457b9d',
    fontWeight: 600,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  transition: 'background-color 0.3s ease',
  '&:hover': {
    backgroundColor: alpha('#fff', 0.05),
  },
  '& td': {
    color: 'white',
  },
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  fontWeight: 600,
  borderRadius: '8px',
  ...getStatusStyles(status),
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: alpha('#fff', 0.1),
  transition: 'all 0.3s ease',
  marginRight: theme.spacing(1),
  padding: theme.spacing(1),
  '&:hover': {
    backgroundColor: alpha('#fff', 0.2),
  },
  '&.Mui-disabled': {
    backgroundColor: alpha('#fff', 0.05),
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: alpha('#fff', 0.9),
    borderRadius: '8px',
    '& fieldset': {
      borderColor: alpha('#fff', 0.3),
    },
    '&:hover fieldset': {
      borderColor: alpha('#fff', 0.5),
    },
    '&.Mui-focused fieldset': {
      borderColor: '#457b9d',
    },
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.grey[700],
  },
}));

const BorrowRequestsManagement = () => {
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
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
      showNotification('Error fetching borrow requests', 'error');
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const showNotification = (message, severity = 'success') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') return;
    setNotification(prev => ({ ...prev, open: false }));
  };

  const handleDelete = async (requestId) => {
    if (!window.confirm("Are you sure you want to delete this borrow request?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/${requestId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showNotification('Borrow request deleted successfully');
      fetchRequests();
    } catch (err) {
      console.error("Error deleting request:", err);
      showNotification('Failed to delete borrow request', 'error');
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
      showNotification('Borrow request updated successfully');
      fetchRequests();
    } catch (err) {
      console.error("Error saving edit:", err);
      showNotification('Failed to update borrow request', 'error');
    }
  };

  const handleCancelEdit = () => {
    setEditMode(null);
    setEditData({});
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <NavigationBar />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 4
        }}>
          <Typography variant="h4" color="primary" fontWeight="bold">
            Borrow Requests Management
          </Typography>
          <Tooltip title="Refresh requests" arrow>
            <IconButton 
              onClick={fetchRequests}
              sx={{ 
                backgroundColor: alpha('#457b9d', 0.1),
                '&:hover': { 
                  backgroundColor: alpha('#457b9d', 0.2),
                  transform: 'rotate(180deg)',
                  transition: 'transform 0.5s ease-in-out'
                }
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {requests.length === 0 ? (
          <Paper sx={{ p: 3, bgcolor: '#1d3557', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
              <Typography color="white">No borrow requests found.</Typography>
            </Box>
          </Paper>
        ) : (
          <TableContainer 
            component={Paper} 
            sx={{ 
              bgcolor: '#1d3557',
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Request ID</StyledTableCell>
                  <StyledTableCell>Student ID</StyledTableCell>
                  <StyledTableCell>Student Name</StyledTableCell>
                  <StyledTableCell>Equipment</StyledTableCell>
                  <StyledTableCell>Quantity</StyledTableCell>
                  <StyledTableCell>Borrow Date</StyledTableCell>
                  <StyledTableCell>Return Date</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                  <StyledTableCell>Actions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.map((request) => (
                  <StyledTableRow key={request.id}>
                    <StyledTableCell>{request.id}</StyledTableCell>
                    <StyledTableCell>{request.User?.id || "N/A"}</StyledTableCell>
                    <StyledTableCell>{request.User?.name || "N/A"}</StyledTableCell>
                    <StyledTableCell>{request.Equipment?.name || "N/A"}</StyledTableCell>
                    
                    {editMode === request.id ? (
                      <>
                        <StyledTableCell>
                          <StyledTextField
                            type="number"
                            name="quantity"
                            value={editData.quantity}
                            onChange={handleChange}
                            size="small"
                            sx={{ width: '80px' }}
                            inputProps={{ min: 1 }}
                          />
                        </StyledTableCell>
                        <StyledTableCell>
                          <StyledTextField
                            type="date"
                            name="borrowDate"
                            value={editData.borrowDate}
                            onChange={handleChange}
                            size="small"
                          />
                        </StyledTableCell>
                        <StyledTableCell>
                          <StyledTextField
                            type="date"
                            name="returnDate"
                            value={editData.returnDate}
                            onChange={handleChange}
                            size="small"
                          />
                        </StyledTableCell>
                        <StyledTableCell>
                          {user?.role === "admin" ? (
                            <FormControl fullWidth size="small">
                              <Select
                                name="status"
                                value={editData.status}
                                onChange={handleChange}
                                sx={{ 
                                  bgcolor: alpha('#fff', 0.9),
                                  borderRadius: 2,
                                  minWidth: 120
                                }}
                              >
                                <MenuItem value="requested">REQUESTED</MenuItem>
                                <MenuItem value="approved">APPROVED</MenuItem>
                                <MenuItem value="rejected">REJECTED</MenuItem>
                                <MenuItem value="returned">RETURNED</MenuItem>
                                <MenuItem value="pending">PENDING</MenuItem>
                              </Select>
                            </FormControl>
                          ) : (
                            <StatusChip
                              label={request.status.toUpperCase()}
                              status={request.status}
                            />
                          )}
                        </StyledTableCell>
                      </>
                    ) : (
                      <>
                        <StyledTableCell>{request.quantity}</StyledTableCell>
                        <StyledTableCell>
                          {new Date(request.borrowDate).toLocaleDateString("en-US", {
                            month: "short",
                            weekday: "short",
                            day: "2-digit",
                            year: "numeric",
                          })}
                        </StyledTableCell>
                        <StyledTableCell>
                          {new Date(request.returnDate).toLocaleDateString("en-US", {
                            month: "short",
                            weekday: "short",
                            day: "2-digit",
                            year: "numeric",
                          })}
                        </StyledTableCell>
                        <StyledTableCell>
                          <StatusChip
                            label={request.status.toUpperCase()}
                            status={request.status}
                          />
                        </StyledTableCell>
                      </>
                    )}

                    <StyledTableCell>
                      {editMode === request.id ? (
                        <Box sx={{ display: 'flex', justifyContent: 'left', gap: 1 }}>
                          <ActionButton
                            onClick={() => handleSaveEdit(
                              request.id,
                              request.User?.id,
                              request.Equipment?.id
                            )}
                            sx={{ color: '#4caf50' }}
                          >
                            <SaveIcon fontSize="small" />
                          </ActionButton>
                          <ActionButton
                            onClick={handleCancelEdit}
                            sx={{ color: '#f44336' }}
                          >
                            <CancelIcon fontSize="small" />
                          </ActionButton>
                        </Box>
                      ) : (
                        <Box sx={{ display: 'flex', justifyContent: 'left', gap: 1 }}>
                          <Tooltip title="Edit" arrow>
                            <span>
                              <ActionButton
                                onClick={() => handleEdit(request)}
                                disabled={user.role !== "admin" && request.status !== "requested"}
                                sx={{ 
                                  color: '#faa000',
                                  backgroundColor: alpha(
                                    user.role !== "admin" && request.status !== "requested" 
                                      ? '#8b8b8b' 
                                      : '#faa000',
                                    0.1
                                  )
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </ActionButton>
                            </span>
                          </Tooltip>
                          <Tooltip title="Delete" arrow>
                            <span>
                              <ActionButton
                                onClick={() => handleDelete(request.id)}
                                disabled={user.role !== "admin"}
                                sx={{ 
                                  color: '#f44336',
                                  backgroundColor: alpha(
                                    user.role === "admin" ? '#f44336' : '#8b8b8b',
                                    0.1
                                  )
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </ActionButton>
                            </span>
                          </Tooltip>
                        </Box>
                      )}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Snackbar
          open={notification.open}
          autoHideDuration={3000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          TransitionComponent={Fade}
        >
          <Alert
            onClose={handleCloseNotification}
            severity={notification.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default BorrowRequestsManagement;