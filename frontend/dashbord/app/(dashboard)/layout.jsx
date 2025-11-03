"use client";
import { ThemeProvider, CssBaseline, Box, Toolbar } from "@mui/material";
import theme from "../theme";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function DashboardLayout({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Navbar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, md: 4 },
            bgcolor: "background.default",
          }}
        >
          {children}
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}
