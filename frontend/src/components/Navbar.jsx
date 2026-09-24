import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  Button,
  Stack,
  useTheme,
  useMediaQuery,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import SecurityIcon from "@mui/icons-material/Security";
import MenuIcon from "@mui/icons-material/Menu";
import logo from "../assets/logonbg.png";

const Navbar = () => {
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = React.useState(null);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Prediction", path: "/predict" },
    { label: "History", path: "/history" },
    { label: "About Model", path: "/about" },
  ];

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "#0f172a",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{ justifyContent: "space-between", height: 70 }}
        >
          {/* Logo & Brand Header */}
          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "10px",
                background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                boxShadow: "0 2px 8px rgba(2, 132, 199, 0.4)",
              }}
            >
              <img
                src={logo}
                alt="LoanGuard"
                style={{
                  width: 42,
                  height: 42,
                  objectFit: "contain",
                }}
              />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  color: "#ffffff",
                  fontWeight: 700,
                  lineHeight: 1.1,
                  fontSize: "1.25rem",
                }}
              >
                LoanGuard
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "#94a3b8",
                  fontSize: "0.72rem",
                  letterSpacing: "0.02em",
                  display: "block",
                }}
              >
                Loan Default Prediction System
              </Typography>
            </Box>
          </Box>

          {/* Desktop Navigation Links */}
          {!isMobile ? (
            <Stack direction="row" spacing={1}>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    component={RouterLink}
                    to={item.path}
                    sx={{
                      color: isActive ? "#38bdf8" : "#cbd5e1",
                      fontWeight: isActive ? 600 : 500,
                      backgroundColor: isActive
                        ? "rgba(56, 189, 248, 0.12)"
                        : "transparent",
                      borderRadius: "8px",
                      padding: "8px 16px",
                      "&:hover": {
                        color: "#ffffff",
                        backgroundColor: "rgba(255, 255, 255, 0.08)",
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Stack>
          ) : (
            /* Mobile Hamburger Menu */
            <Box>
              <IconButton onClick={handleOpenMenu} sx={{ color: "#ffffff" }}>
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                PaperProps={{
                  sx: {
                    backgroundColor: "#1e293b",
                    color: "#ffffff",
                    minWidth: 160,
                    mt: 1,
                  },
                }}
              >
                {navItems.map((item) => (
                  <MenuItem
                    key={item.path}
                    component={RouterLink}
                    to={item.path}
                    onClick={handleCloseMenu}
                    selected={location.pathname === item.path}
                    sx={{
                      fontSize: "0.95rem",
                      py: 1.2,
                      "&.Mui-selected": {
                        backgroundColor: "rgba(56, 189, 248, 0.15)",
                        color: "#38bdf8",
                        fontWeight: 600,
                      },
                    }}
                  >
                    {item.label}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
