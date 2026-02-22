import { useState } from 'react';
import { Box, Button, Fade, InputAdornment, Paper, Stack, TextField, Typography } from '@mui/material';
import { alpha, keyframes } from '@mui/material/styles';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import HubRoundedIcon from '@mui/icons-material/HubRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import { useNavigate } from 'react-router-dom';

const AUTH_KEY = 'ff_auth_user';

const floatA = keyframes`
  0% { transform: translate(0px, 0px) scale(1); }
  50% { transform: translate(30px, -24px) scale(1.08); }
  100% { transform: translate(0px, 0px) scale(1); }
`;

const floatB = keyframes`
  0% { transform: translate(0px, 0px) scale(1); }
  50% { transform: translate(-28px, 20px) scale(0.94); }
  100% { transform: translate(0px, 0px) scale(1); }
`;

const panelGlow = keyframes`
  0%, 100% { box-shadow: 0 0 0 1px rgba(255, 212, 71, 0.16), 0 10px 28px rgba(0, 0, 0, 0.28); }
  50% { box-shadow: 0 0 0 1px rgba(255, 212, 71, 0.34), 0 14px 32px rgba(0, 0, 0, 0.34); }
`;

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = (event) => {
    event.preventDefault();
    const cleanUsername = username.trim();
    if (!cleanUsername || !password.trim()) {
      return;
    }
    localStorage.setItem(AUTH_KEY, JSON.stringify({ username: cleanUsername, loggedInAt: new Date().toISOString() }));
    navigate('/');
  };

  return (
    <Fade in timeout={450}>
      <Box
        sx={{
          position: 'relative',
          minHeight: '100vh',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            width: 480,
            height: 480,
            borderRadius: '50%',
            background: alpha('#ffd447', 0.2),
            filter: 'blur(18px)',
            top: -120,
            left: -80,
            animation: `${floatA} 24s ease-in-out infinite`
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: 460,
            height: 460,
            borderRadius: '50%',
            background: alpha('#2ce6ff', 0.14),
            filter: 'blur(18px)',
            right: -100,
            bottom: -140,
            animation: `${floatB} 30s ease-in-out infinite`
          }}
        />

        <Paper
          sx={{
            width: '100%',
            maxWidth: 460,
            p: 4,
            borderRadius: 3,
            border: `1px solid ${alpha('#ffd447', 0.34)}`,
            background: alpha('#120d2a', 0.78),
            backdropFilter: 'blur(8px)',
            animation: `${panelGlow} 3.6s ease-in-out infinite`
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
            <HubRoundedIcon color="primary" />
            <Typography variant="overline" color="text.secondary">
              FreeFlow ETL Console
            </Typography>
          </Stack>
          <Typography variant="h4" sx={{ mb: 0.5 }}>
            Sign In
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Use your username and password to continue.
          </Typography>
          <Stack component="form" spacing={2} onSubmit={onSubmit}>
            <TextField
              required
              label="Username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircleRoundedIcon fontSize="small" />
                  </InputAdornment>
                )
              }}
            />
            <TextField
              required
              label="Password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockRoundedIcon fontSize="small" />
                  </InputAdornment>
                )
              }}
            />
            <Button
              type="submit"
              variant="contained"
              startIcon={<LoginRoundedIcon />}
              sx={{ mt: 0.75, transition: 'transform 180ms ease', '&:hover': { transform: 'translateY(-1px)' } }}
            >
              Enter Dashboard
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Fade>
  );
}

export default LoginPage;
