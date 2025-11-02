import React, { useState, useEffect } from "react";
import NavigationBar from "../components/NavigationBar";
import axios from "axios";
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Switch,
  Card,
  FormControlLabel,
  Tooltip,
  Fade,
  Snackbar,
  Alert,
  Chip
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1d3557 0%, #2a4a7f 100%)',
  borderRadius: '16px',
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  width: '100%',
  maxWidth: '500px',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    backgroundColor: alpha('#fff', 0.9),
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#fff',
    },
    '&.Mui-focused': {
      backgroundColor: '#fff',
    },
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.grey[700],
  },
}));

const ActionButton = styled(Button)(({ theme, color }) => ({
  borderRadius: '8px',
  padding: theme.spacing(1, 3),
  textTransform: 'none',
  fontWeight: 600,
  boxShadow: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  color: 'white',
  padding: theme.spacing(2),
  borderBottom: `1px solid ${alpha('#fff', 0.1)}`,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  transition: 'background-color 0.3s ease',
  '&:hover': {
    backgroundColor: alpha('#fff', 0.05),
  },
}));

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
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const API_URL = "http://localhost:5000/api/equipment";

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
      showNotification('Equipment list updated successfully');
    } 
    catch (err) 
    {
      console.error("Error fetching equipments:", err);
      showNotification('Failed to fetch equipments', 'error');
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
      await axios.post(API_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      showNotification('Equipment added successfully');
      fetchEquipments();
      resetForm();
    } 
    catch (err) 
    {
      console.error("Error adding equipment:", err);
      showNotification(err.response?.data?.error || "Failed to add equipment", 'error');
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
      showNotification('Equipment updated successfully');
      fetchEquipments();
      resetForm();
    } 
    catch (err) 
    {
      console.error("Error updating equipment:", err);
      showNotification(err.response?.data?.error || "Failed to update equipment", 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      showNotification('Equipment deleted successfully');
      fetchEquipments();
    } 
    catch (err) 
    {
      console.error("Error deleting equipment:", err);
      showNotification(err.response?.data?.error || "Failed to delete equipment", 'error');
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
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <NavigationBar />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" color="primary" fontWeight="bold" gutterBottom>
            Equipment Management
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <StyledCard component="form" onSubmit={editMode ? handleUpdate : handleAdd}>
            <Typography variant="h6" color="white" gutterBottom>
              {editMode ? 'Update Equipment' : 'Add New Equipment'}
            </Typography>

            <Typography sx={{ color: 'white' }}>
              Name
            </Typography>

            <StyledTextField
              fullWidth
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={editMode}
              variant="outlined"
            />

            <Typography sx={{ color: 'white' }}>
              Category
            </Typography>

            <StyledTextField
              fullWidth
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              disabled={editMode}
              variant="outlined"
            />

            <Typography sx={{ color: 'white' }}>
              Condition
            </Typography>

            <StyledTextField
              fullWidth
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              required
              variant="outlined"
            />

            <Typography sx={{ color: 'white' }}>
              Quantity
            </Typography>

            <StyledTextField
              fullWidth
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              required
              variant="outlined"
              inputProps={{ min: 0 }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.availability === "true"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      availability: e.target.checked ? "true" : "false"
                    })
                  }
                  sx={{ 
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#457b9d',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#457b9d',
                    },
                  }}
                />
              }
              label={<Typography color="white">Available</Typography>}
              sx={{ mb: 2 }}
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <ActionButton
                type="submit"
                variant="contained"
                sx={{
                  bgcolor: editMode ? '#ffb703' : '#457b9d',
                  '&:hover': {
                    bgcolor: editMode ? '#faa000' : '#2b5876',
                  }
                }}
              >
                {editMode ? 'Update Equipment' : 'Add Equipment'}
              </ActionButton>

              {editMode && (
                <ActionButton
                  onClick={resetForm}
                  variant="contained"
                  sx={{
                    bgcolor: 'grey.600',
                    '&:hover': {
                      bgcolor: 'grey.700',
                    }
                  }}
                >
                  Cancel
                </ActionButton>
              )}
            </Box>
          </StyledCard>

          <Box sx={{ flexGrow: 1 }}>
            <TableContainer 
              component={Paper} 
              sx={{ 
                bgcolor: '#1d3557',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#457b9d' }}>
                    <StyledTableCell>Name</StyledTableCell>
                    <StyledTableCell>Category</StyledTableCell>
                    <StyledTableCell>Condition</StyledTableCell>
                    <StyledTableCell>Quantity</StyledTableCell>
                    <StyledTableCell>Available</StyledTableCell>
                    <StyledTableCell>Actions</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {equipments.length > 0 ? (
                    equipments.map((item) => (
                      <StyledTableRow key={item.id}>
                        <StyledTableCell>{item.name}</StyledTableCell>
                        <StyledTableCell>{item.category}</StyledTableCell>
                        <StyledTableCell>{item.condition}</StyledTableCell>
                        <StyledTableCell>{item.quantity}</StyledTableCell>
                        <StyledTableCell>
                          <Chip
                            label={item.availability ? "Yes" : "No"}
                            color={item.availability ? "success" : "error"}
                            size="small"
                          />
                        </StyledTableCell>
                        <StyledTableCell>
                          <Tooltip title="Edit" arrow>
                            <IconButton
                              onClick={() => handleEdit(item)}
                              size="small"
                              sx={{ 
                                color: '#faa000',
                                bgcolor: alpha('#fff', 0.1),
                                mr: 1,
                                '&:hover': {
                                  bgcolor: alpha('#faa000', 0.2),
                                }
                              }}
                            >
                              <EditIcon fontSize="small"/>
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete" arrow>
                            <IconButton
                              onClick={() => {
                                if (window.confirm("Are you sure you want to delete this equipment?")) {
                                  handleDelete(item.id);
                                }
                              }}
                              size="small"
                              sx={{ 
                                color: '#ff1744',
                                bgcolor: alpha('#fff', 0.1),
                                '&:hover': {
                                  bgcolor: alpha('#ff1744', 0.2),
                                }
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))
                  ) : (
                    <StyledTableRow>
                      <StyledTableCell colSpan={6} align="center">
                        <Box sx={{ py: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                          <WarningIcon sx={{ color: 'warning.main' }} />
                          <Typography color="white">No equipment found.</Typography>
                        </Box>
                      </StyledTableCell>
                    </StyledTableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>

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

export default EquipmentManagement;
