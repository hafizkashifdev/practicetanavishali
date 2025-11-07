'use client';

import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  CssBaseline,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
  Container,
  ThemeProvider,
  createTheme,
} from '@mui/material';

import { motion } from 'framer-motion';
import { People, AdminPanelSettings, Person } from '@mui/icons-material';
import { io } from 'socket.io-client';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#1976d2' },
    background: {
      default: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
      paper: '#1e272e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0bec5',
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    h6: { fontWeight: 600 },
  },
});

const stringToColor = (string) => {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
};

export default function DashboardLayout() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = 'http://192.168.18.129:5000/api/auth/all-users';

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`Error ${response.status}`);
      const data = await response.json();
console.log('data:', data);

      const list = data?.result || data?.data || data || [];
      if (!Array.isArray(list)) throw new Error('Invalid data format');
      setUsers(list);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err?.message || 'Failed to fetch users.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    const socket = io('http://192.168.18.129:5000');
    socket.on('connect', () => console.log(' Socket connected:', socket.id));
    socket.on('userAdded', (newUser) => setUsers((prev) => [newUser, ...prev]));
    socket.on('userLoggedIn', (user) => console.log(' User logged in:', user));
fetchUsers();
    return () => socket.disconnect();
  }, []);

  const renderMain = () => {
    if (loading)
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <CircularProgress />
        </Box>
      );

    if (error)
      return (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      );

    if (!Array.isArray(users) || users.length === 0)
      return (
        <Alert severity="info" sx={{ mt: 3 }}>
          No users found.
        </Alert>
      );

    return (
    <Grid container spacing={3}>
  {users?.map((user, index) => (
    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={user?._id || index}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.4 }}
      >
        <Card
          elevation={5}
          sx={{
            textAlign: 'center',
            borderRadius: 4,
            p: 2,
            height: '100%',
            background: 'linear-gradient(160deg, #243B55 0%, #141E30 100%)',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'translateY(-6px)',
              boxShadow: '0px 6px 25px rgba(0,0,0,0.5)',
            },
          }}
        >
          <CardContent>
            <Avatar 
  sx={{
    bgcolor: stringToColor(user?.username || 'User'),
    width: 56,
    height: 56,
    mx: 'auto',
    mb: 2
  }}
>
  {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
</Avatar>
            <Typography
              variant="h6"
              sx={{
                wordBreak: 'break-word',
                whiteSpace: 'normal',
                overflowWrap: 'break-word',
                textOverflow: 'ellipsis',
              }}
            >
              {user?.name || 'N/A'}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                mb: 1,
                wordBreak: 'break-word',
                whiteSpace: 'normal',
                overflowWrap: 'break-word',
              }}
            >
              {user?.email || 'N/A'}
            </Typography>

            <Chip
              icon={
                user?.role === 'admin' ? (
                  <AdminPanelSettings sx={{ fontSize: 18 }} />
                ) : (
                  <Person sx={{ fontSize: 18 }} />
                )
              }
              label={user?.role || 'user'}
              color={user?.role === 'admin' ? 'warning' : 'info'}
              sx={{ fontWeight: 600 }}
            />

          </CardContent>
        </Card>
      </motion.div>
    </Grid>
  ))}
</Grid>

    );
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box
        sx={{
          minHeight: '100vh',
          background: theme.palette.background.default,
          pb: 5,
        }}
      >
        {/* App Bar */}
        <AppBar
          position="sticky"
          color="transparent"
          elevation={2}
          sx={{
            backdropFilter: 'blur(10px)',
            background: 'rgba(0,0,0,0.3)',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <Toolbar>
            <People sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              User Dashboard
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Main  */}
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {renderMain()}
        </Container>
      </Box>
    </ThemeProvider>
  );
}
