"use client";
import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        textAlign: "center",
        py: 2,
        mt: "auto",
        bgcolor: "background.paper",
        color: "text.secondary",
        borderTop: "1px solid #e5e7eb",
      }}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()} Dashboard System — All Rights Reserved
      </Typography>
    </Box>
  );
}
