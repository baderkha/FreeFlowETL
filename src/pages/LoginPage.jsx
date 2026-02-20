import { Box, Button, Fade, InputAdornment, Paper, Stack, TextField, Typography } from '@mui/material';
import { keyframes } from '@mui/material/styles';
import AlternateEmailRoundedIcon from '@mui/icons-material/AlternateEmailRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import { useNavigate } from 'react-router-dom';

const panelGlow = keyframes`
  0%, 100% { box-shadow: 0 0 0 1px rgba(255, 212, 71, 0.16), 0 10px 28px rgba(0, 0, 0, 0.28); }
  50% { box-shadow: 0 0 0 1px rgba(255, 212, 71, 0.34), 0 14px 32px rgba(0, 0, 0, 0.34); }
`;

function LoginPage() {
  const navigate = useNavigate();

  const onSubmit = (event) => {
    event.preventDefault();
    navigate('/');
  };

  return (
    <Fade in timeout={450}>
      <Box sx={{ maxWidth: 460, mx: 'auto', pt: { xs: 6, md: 10 } }}>
        <Paper sx={{ p: 4, borderRadius: 3, animation: `${panelGlow} 3.6s ease-in-out infinite` }}>
          <Typography variant="h5" sx={{ mb: 0.5 }}>
            Welcome Back
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Sign in to manage your pipelines.
          </Typography>
          <Stack component="form" spacing={2} onSubmit={onSubmit}>
            <TextField
              required
              label="Email"
              type="email"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AlternateEmailRoundedIcon fontSize="small" />
                  </InputAdornment>
                )
              }}
            />
            <TextField
              required
              label="Password"
              type="password"
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
              sx={{ transition: 'transform 180ms ease', '&:hover': { transform: 'translateY(-1px)' } }}
            >
              Sign In
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Fade>
  );
}

export default LoginPage;
