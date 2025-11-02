import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const NavigationBar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const { user } = useContext(AuthContext);
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
          onClick={() => navigate("/dashboard")}
          style={{
            background: "#457b9d",
            color: "white",
            padding: "8px 16px",
            border: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Dashboard
        </button>
        {user?.role === "admin" ? (
          <>
            <button
              onClick={handleClick}
              style={{
                background: "#457b9d",
                color: "white",
                padding: "8px 16px",
                border: "none",
                borderRadius: "6px",
                fontWeight: "bold",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px"
              }}
            >
              Manage <ArrowDropDownIcon />
            </button>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem onClick={() => {
                navigate("/equipment-management");
                handleClose();
              }}>Equipments</MenuItem>
              <MenuItem onClick={() => {
                navigate("/borrow-request-management");
                handleClose();
              }}>Borrow Requests</MenuItem>
            </Menu>
          </>
        ) : (
          <button
            onClick={() => navigate("/borrow-request-management")}
            style={{
              background: "#457b9d",
              color: "white",
              padding: "8px 16px",
              border: "none",
              borderRadius: "6px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            Manage Borrow Requests
          </button>
        )}
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#8a1e27ff",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "bold"
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default NavigationBar;
