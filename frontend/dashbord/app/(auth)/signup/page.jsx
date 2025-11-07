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
import { Person, Email, Lock, Visibility, VisibilityOff } from "@mui/icons-material";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    const newErrors = {};
    if (!firstName.trim()) newErrors.firstName = "Full name is required.";
    if (!email.trim()) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email.";
    if (!password) newErrors.password = "Password is required.";
    else if (password.length < 8)
      newErrors.password = "Password must be at least 8 characters.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://192.168.18.129:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: firstName, email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        setIsSuccess(true);
        setMessage("Signup successful! Redirecting...");
        setTimeout(() => router.push("/login"), 1500);
      } else {
        setIsSuccess(false);
        setMessage(data.message || "Signup failed.");
      }
    } catch {
      setIsSuccess(false);
      setMessage("An error occurred during signup.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "background.default",
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
          borderRadius: 1,
          boxShadow: 3,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            flex: 1,
            backgroundImage: "url('/login.avif')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            minHeight: { xs: 220, md: "auto" },
            "&::before": {
              content: '""',
              position: "absolute",
              inset: 0,
              bgcolor: "rgba(0,0,0,0.5)",
            },
          }}
        >
          <Box sx={{ position: "relative", color: "#fff", textAlign: "center", p: 5 }}>
            <Typography variant="h4" fontWeight="bold">
              Join Our Community
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, opacity: 0.85 }}>
              Discover opportunities and start your journey today.
            </Typography>
          </Box>
        </Box>

        {/* RIGHT BOX */}
        <Box
          sx={{
            flex: 1,
            bgcolor: "background.default",
            p: { xs: 3, md: 4 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <CardContent>
            <Box textAlign="center" mb={1}>
              <Box component="img" src="/shoplog.png" alt="Logo" sx={{ width: 140, mx: "auto" }} />
            </Box>

            <Typography variant="h5" fontWeight={700} textAlign="center" color="text.primary">
              Create Your Account
            </Typography>
            <Typography variant="body2" textAlign="center" color="text.secondary" mb={3}>
              Please provide your details to continue.
            </Typography>

            <Box component="form" onSubmit={handleSignup}>
              <TextField
                fullWidth
                label="Full Name"
                variant="outlined"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                margin="normal"
                placeholder="Ali"
                error={!!errors.firstName}
                helperText={errors.firstName}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="primary" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Email Address"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                placeholder="example@gmail.com"
                error={!!errors.email}
                helperText={errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="primary" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Password"
                variant="outlined"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                placeholder="password"
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  mt: 3,
                  py: 1.3,
                  backgroundColor: "primary.main",
                  "&:hover": { backgroundColor: "primary.dark" },
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
              </Button>
            </Box>

            {message && (
              <Typography
                sx={{
                  mt: 3,
                  textAlign: "center",
                  color: isSuccess ? "success.main" : "error.main",
                  fontWeight: 500,
                }}
              >
                {message}
              </Typography>
            )}

            <Typography variant="body2" textAlign="center" color="text.secondary" mt={3}>
              Already have an account?{" "}
              <Button variant="text" color="primary" onClick={() => router.push("/login")}>
                Log In
              </Button>
            </Typography>
          </CardContent>
        </Box>
      </Card>
    </Box>
  );
};

export default Signup;
