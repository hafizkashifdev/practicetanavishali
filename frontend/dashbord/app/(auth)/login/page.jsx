"use client";

import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { Email, Lock, Visibility, VisibilityOff } from "@mui/icons-material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const router = useRouter();

  const validateForm = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format.";
    }
    if (!password) {
      newErrors.password = "Password is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("http://192.168.0.62:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
console.log(data);

      if (res.ok) {
        setIsSuccess(true);
        setMessage("Login successful! Redirecting...");
localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);
  localStorage.setItem("user", JSON.stringify(data.user));         setTimeout(() => router.push("/dashboard"), 1500);
      } else {
        setIsSuccess(false);
        setMessage(data.message || "Invalid email or password.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setIsSuccess(false);
      setMessage("An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f3f4f6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Card
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          width: "100%",
          maxWidth: 1000,
          borderRadius: 4,
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
      >
        {/* LEFT BOX */}
        <Box
          sx={{
            flex: 1,
            backgroundImage: "url('/fairchance-drive-signup.avif')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            minHeight: { xs: 220, md: "auto" },
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
            }}
          />
          <Box
            sx={{
              position: "relative",
              color: "#fff",
              textAlign: "center",
              px: 3,
              py: 5,
            }}
          >
            <Typography variant="h4" fontWeight="bold">
              Welcome Back
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, opacity: 0.85 }}>
              Login to continue your journey with us.
            </Typography>
          </Box>
        </Box>

        {/* RIGHT BOX */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: "#fff",
            p: { xs: 3, md: 3},
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <CardContent>
            <Box textAlign="center">
              <Box
                component="img"
                src="/shoplog.png"
                alt="Logo"
                sx={{ width: 160, mx: "auto",  }}
              />
            </Box>

            <Typography
              variant="h5"
              fontWeight={700}
              textAlign="center"
              color="text.primary"
            >
              Welcome Back
            </Typography>
            <Typography
              variant="body2"
              textAlign="center"
              color="text.secondary"
              mb={3}
            >
              Please log in to access your account.
            </Typography>

            <Box component="form" onSubmit={handleLogin}>
              {/* Email */}
              <TextField
                fullWidth
                label="Email Address"
                variant="outlined"
                value={email}
                placeholder="example@gmail.com"
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                error={!!errors.email}
                helperText={errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color='primary' />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Password */}
              <TextField
                fullWidth
                label="Password"
                variant="outlined"
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="password"
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color='primary' />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Button */}
              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  mt: 3,
                  py: 1.3,
                  fontWeight: 600,
                  borderRadius: 2,
                  backgroundColor: "#1976d2",
                  "&:hover": { backgroundColor: "#1256a0" },
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
              </Button>
            </Box>

            {/* Feedback Message */}
            {message && (
              <Typography
                sx={{
                  mt: 3,
                  textAlign: "center",
                  color: isSuccess ? "green" : "error.main",
                  fontWeight: 500,
                }}
              >
                {message}
              </Typography>
            )}

            <Typography
              variant="body2"
              textAlign="center"
              color="text.secondary"
              mt={3}
            >
              Don’t have an account?{" "}
              <Button
                variant="text"
                color="primary"
                onClick={() => router.push("/signup")}
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                Sign Up
              </Button>
            </Typography>
          </CardContent>
        </Box>
      </Card>
    </Box>
  );
};

export default Login;
