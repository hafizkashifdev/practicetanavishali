"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
      dark: "#1256a0",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#ff4081",
    },
    background: {
      default: "#f3f4f6",
      paper: "#e0f2f1",
    },
    text: {
      primary: "#1e293b",
      secondary: "#64748b",
    },
    success: {
      main: "#2e7d32",
    },
  },
  typography: {
 fontFamily: "Poppins, sans-serif",

    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,

    h5: {
      fontWeight: 600,
      fontSize: "1.5rem",
    },
        button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 10,
  },
});

export default theme;
