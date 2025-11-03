"use client";  

import Link from "next/link";
import { Box, Typography, Button } from "@mui/material";

export default function HomePage() {
  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        p: 3,
      }}
    >
      <Typography variant="h2"  gutterBottom>
        Welcome to the Homepage
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
      </Typography>
      <Button
        component={Link} 
        href="/dashboard"
        variant="contained"
        size="large"
      >
        Go to Dashboard
      </Button>
    </Box>
  );
}