import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem, IconButton } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

// Styled components
const StyledButton = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(2),
  borderRadius: '8px',
  padding: '8px 16px',
  textTransform: 'none',
  fontWeight: 600,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
}));

const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 8,
    marginTop: theme.spacing(1),
    minWidth: 180,
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
    '& .MuiMenuItem-root': {
      padding: theme.spacing(1.5, 2),
      transition: 'background-color 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(1),
      '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
      },
    },
  },
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontSize: '1.8rem',
  fontWeight: 700,
  background: 'linear-gradient(45deg, #ffffff 30%, #e3f2fd 90%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  letterSpacing: '0.5px',
}));

const NavigationBar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1d3557', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
      <Toolbar sx={{ justifyContent: 'space-between', padding: '12px 24px' }}>
        <LogoText variant="h1">
          School Equipment Lending Portal
        </LogoText>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <StyledButton
            color="primary"
            variant="contained"
            startIcon={<DashboardIcon />}
            onClick={() => navigate("/dashboard")}
            sx={{ backgroundColor: '#457b9d' }}
          >
            Dashboard
          </StyledButton>

          {user?.role === "admin" ? (
            <>
              <StyledButton
                color="primary"
                variant="contained"
                endIcon={<ArrowDropDownIcon />}
                onClick={handleClick}
                sx={{ backgroundColor: '#457b9d' }}
              >
                Management Options
              </StyledButton>
              <StyledMenu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                elevation={3}
              >
                <MenuItem onClick={() => {
                  navigate("/equipment-management");
                  handleClose();
                }}>
                  <ManageAccountsIcon fontSize="small" />
                  Manage Equipments
                </MenuItem>
                <MenuItem onClick={() => {
                  navigate("/borrow-request-management");
                  handleClose();
                }}>
                  <ManageAccountsIcon fontSize="small" />
                  Manage Borrow Requests
                </MenuItem>
              </StyledMenu>
            </>
          ) : (
            <StyledButton
              color="primary"
              variant="contained"
              startIcon={<ManageAccountsIcon />}
              onClick={() => navigate("/borrow-request-management")}
              sx={{ backgroundColor: '#457b9d' }}
            >
              Manage Borrow Requests
            </StyledButton>
          )}

          <StyledButton
            color="error"
            variant="contained"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{ backgroundColor: '#8a1e27ff' }}
          >
            Logout
          </StyledButton>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;