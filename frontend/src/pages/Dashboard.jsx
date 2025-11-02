import { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import NavigationBar from "../components/NavigationBar";
import { 
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  IconButton,
  Box,
  Paper,
  Chip,
  Tooltip,
  styled
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import RefreshIcon from '@mui/icons-material/Refresh';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { alpha } from '@mui/material/styles';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1d3557 0%, #2a4a7f 100%)',
  borderRadius: '16px',
  transition: 'all 0.3s ease-in-out',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.2)',
  },
}));

const StyledCardContent = styled(CardContent)({
  flexGrow: 1,
  padding: '20px',
});

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    '&:hover': {
      '& fieldset': {
        borderColor: theme.palette.primary.main,
      },
    },
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.text.secondary,
  },
}));

const QuantityButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.common.white, 0.9),
  borderRadius: '50%',
  padding: '4px',
  '&:hover': {
    backgroundColor: theme.palette.common.white,
    transform: 'scale(1.1)',
  },
}));

const Dashboard = () => {
const [equipment, setEquipment] = useState([]);
const [selectedItems, setSelectedItems] = useState({});
const [isInitialLoad, setIsInitialLoad] = useState(true);
const [searchTerm, setSearchTerm] = useState("");

useEffect(() => {
  fetchEquipment();
}, []);

const fetchEquipment = async () => {
  try {
    const res = await axios.get("/equipment");
    setEquipment(res.data);

    setSelectedItems((prev) => {
      const newSelections = { ...prev };
      let changed = false;

      res.data.forEach((item) => {
        if (!newSelections[item.id]) {
          newSelections[item.id] = {
            quantity: 0,
            ...getDefaultDates(),
          };
          changed = true;
        }
      });

      return changed || isInitialLoad ? newSelections : prev;
    });

    setIsInitialLoad(false);
  } 
  catch (err) 
  {
    const errorMessage = err.response?.data?.error || "Error fetching equipment. Try again.";
    alert(errorMessage);
  }
};


const getDefaultDates = () => {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const formatDate = (date) => date.toISOString().split("T")[0];
  return {
    borrowDate: formatDate(today),
    returnDate: formatDate(tomorrow),
  };
};

  const handleIncrement = (id, max) => {
    setSelectedItems((prev) => {
    const current = prev[id] || {};
    const currentQty = current.quantity || 0;
    return {
      ...prev,
      [id]: {
        ...current,
        quantity: Math.min(currentQty + 1, max),
      },
    };
  });
};

  const handleDecrement = (id) => {
  setSelectedItems((prev) => {
    const current = prev[id] || {};
    const currentQty = current.quantity || 0;
    return {
      ...prev,
      [id]: {
        ...current,
        quantity: Math.max(currentQty - 1, 0),
      },
    };
  });
};

  const handleBorrow = async () => {
  const itemsToBorrow = Object.entries(selectedItems)
    .filter(([_, item]) => item.quantity > 0)
    .map(([id, item]) => ({
      equipmentId: id,
      quantity: item.quantity,
      borrowDate: item.borrowDate,
      returnDate: item.returnDate,
    }));

    if (itemsToBorrow.length === 0) {
      alert("Please select at least one item to borrow.");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const borrowerId = user?.id;

      for (const item of itemsToBorrow) {
      await axios.post("/borrow-request/", {
        equipmentId: item.equipmentId,
        userId: borrowerId,
        quantity: item.quantity,
        borrowDate: new Date(item.borrowDate).toISOString().split("T")[0],
        returnDate: new Date(item.returnDate).toISOString().split("T")[0],
        status: "requested",
      });
    }

      alert("Borrow request(s) submitted successfully!");
      setSelectedItems(prev => {
      const reset = {};
      Object.keys(prev).forEach(id => {
        reset[id] = { ...prev[id], quantity: 0 };
      });
      return reset;
      });
      fetchEquipment();
    } 
    catch (err) 
    {
      const errorMessage = err.response?.data?.error || "Failed to submit borrow requests. Try again.";
      alert(errorMessage);
    }
  };

  const filteredEquipment = equipment.filter(item =>
  item.name.toLowerCase().includes(searchTerm.toLowerCase())
);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <NavigationBar />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Paper 
          elevation={0}
          sx={{ 
            p: 3, 
            mb: 3, 
            borderRadius: 4,
            bgcolor: 'transparent'
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 3
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
                Equipment Dashboard
              </Typography>
              <Tooltip title="Refresh equipment list">
                <IconButton 
                  onClick={fetchEquipment}
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

            <LoadingButton
              variant="contained"
              startIcon={<ShoppingCartIcon />}
              onClick={handleBorrow}
              color="primary"
              sx={{
                px: 3,
                py: 1,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                backgroundColor: '#457b9d',
                '&:hover': {
                  backgroundColor: '#2b5876',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                },
              }}
            >
              Borrow Selected Items
            </LoadingButton>
          </Box>

          <StyledTextField
            fullWidth
            variant="outlined"
            placeholder="Search by equipment name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 4 }}
            InputProps={{
              sx: { 
                bgcolor: 'white',
                '&:hover': {
                  bgcolor: '#fff',
                }
              }
            }}
          />

          <Grid container spacing={2}>
            {filteredEquipment.length === 0 ? (
              <Grid item xs={12}>
                <Typography variant="h6" color="text.secondary" textAlign="center">
                  No equipment available for borrowing at the moment.
                </Typography>
              </Grid>
            ) : (
              filteredEquipment.map((item) => {
              const quantity = selectedItems[item.id] || 0;
              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={item.id} minWidth={325}>
                  <StyledCard>
                    <StyledCardContent>
                      <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
                        {item.name}
                      </Typography>
                      
                      <Box sx={{ mb: 2 }}>
                        <Chip 
                          label={item.category}
                          sx={{ 
                            bgcolor: alpha('#fff', 0.1),
                            color: 'white',
                            mr: 1,
                            mb: 1
                          }}
                        />
                        <Chip 
                          label={item.condition}
                          sx={{ 
                            bgcolor: alpha('#fff', 0.1),
                            color: 'white',
                            mr: 1,
                            mb: 1
                          }}
                        />
                        <Chip 
                          label={`${item.availability ? 'Available' : 'Unavailable'}`}
                          color={item.availability ? 'success' : 'error'}
                          sx={{ mb: 1 }}
                        />
                      </Box>

                      <Typography variant="body2" sx={{ color: 'white', mb: 2 }}>
                        Available Quantity: {item.quantity}
                      </Typography>

                      <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                        Borrow Date:
                      </Typography>

                      <Box sx={{ mb: 2 }}>
                        <TextField
                          type="date"
                          value={selectedItems[item.id]?.borrowDate || ""}
                          onChange={(e) =>
                            setSelectedItems((prev) => ({
                              ...prev,
                              [item.id]: {
                                ...prev[item.id],
                                borrowDate: e.target.value,
                              },
                            }))
                          }
                          fullWidth
                          sx={{ 
                            mb: 2,
                            '& .MuiOutlinedInput-root': {
                              bgcolor: alpha('#fff', 0.9),
                              borderRadius: 8
                            },
                            '& .MuiInputLabel-root': {
                              color: alpha('#fff', 0.7)
                            }
                          }}
                          InputLabelProps={{ shrink: true }}
                        />

                        <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                          Return Date:
                        </Typography>

                        <TextField
                          type="date"
                          value={selectedItems[item.id]?.returnDate || ""}
                          onChange={(e) =>
                            setSelectedItems((prev) => ({
                              ...prev,
                              [item.id]: {
                                ...prev[item.id],
                                returnDate: e.target.value,
                              },
                            }))
                          }
                          fullWidth
                          sx={{ 
                            '& .MuiOutlinedInput-root': {
                              bgcolor: alpha('#fff', 0.9),
                              borderRadius: 8
                            },
                            '& .MuiInputLabel-root': {
                              color: alpha('#fff', 0.7)
                            }
                          }}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Box>

                      <Box sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: 1,
                        mt: 2
                      }}>
                        <QuantityButton
                          size="small"
                          onClick={() => handleDecrement(item.id)}
                        >
                          <RemoveIcon fontSize="small" />
                        </QuantityButton>
                        
                        <Typography sx={{ color: 'white', fontWeight: 'bold', mx: 2 }}>
                          {selectedItems[item.id]?.quantity || 0}
                        </Typography>

                        <QuantityButton
                          size="small"
                          onClick={() => handleIncrement(item.id, item.quantity)}
                        >
                          <AddIcon fontSize="small" />
                        </QuantityButton>
                      </Box>
                    </StyledCardContent>
                  </StyledCard>
                </Grid>
              );
            })
          )}
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default Dashboard;
