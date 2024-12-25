import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode to decode JWT tokens

function Navbar() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUser, setIsUser] = useState(false);

  // Decode the token to check user roles
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken);

        if (decodedToken.roles?.includes("ROLE_ADMIN")) {
          setIsAdmin(true);
        } else if (decodedToken.roles?.includes("ROLE_USER")) {
          setIsUser(true);
        }
      } catch (error) {
        console.error("Error decoding token:", error.message);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token
    navigate("/"); // Redirect to login page
  };

  return (
    <AppBar position="static" style={{ backgroundColor: "#333" }}>
      <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left Section */}
        <Box style={{ display: "flex", alignItems: "center" }}>
          {/* Interessé - Only for Users */}
          {isUser && (
            <Typography variant="h6" style={{ marginLeft: "10px" }}>
              <Link to="/interested" style={{ color: "white", textDecoration: "none" }}>
                Interessé
              </Link>
            </Typography>
          )}

          {/* Home - Available for all */}
          <Typography variant="h6" style={{ marginLeft: "10px" }}>
            <Link to="/home" style={{ color: "white", textDecoration: "none" }}>
              Home
            </Link>
          </Typography>

          {/* Client - Only for Admin */}
          {isAdmin && (
            <Typography variant="h6" style={{ marginLeft: "10px" }}>
              <Link to="/Clients" style={{ color: "white", textDecoration: "none" }}>
                Client
              </Link>
            </Typography>
          )}

          {/* Dossier - Only for Admin */}
          {isAdmin && (
            <Typography variant="h6" style={{ marginLeft: "10px" }}>
              <Link to="/add-dossier" style={{ color: "white", textDecoration: "none" }}>
                Dossier
              </Link>
            </Typography>
          )}
        </Box>

        {/* Right Section */}
        <Box style={{ display: "flex", alignItems: "center" }}>
          {/* Logout Icon */}
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
