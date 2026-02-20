import { useMemo, useState } from 'react';
import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery
} from '@mui/material';
import { alpha, keyframes, useTheme } from '@mui/material/styles';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import HubRoundedIcon from '@mui/icons-material/HubRounded';
import LanRoundedIcon from '@mui/icons-material/LanRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';

const drawerWidth = 252;

const driftA = keyframes`
  0% { transform: translate(0px, 0px) scale(1); }
  50% { transform: translate(24px, -18px) scale(1.08); }
  100% { transform: translate(0px, 0px) scale(1); }
`;

const driftB = keyframes`
  0% { transform: translate(0px, 0px) scale(1); }
  50% { transform: translate(-22px, 20px) scale(0.94); }
  100% { transform: translate(0px, 0px) scale(1); }
`;

const glowPulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(255, 212, 71, 0.12); }
  50% { box-shadow: 0 0 0 8px rgba(255, 212, 71, 0.04); }
`;

const brandFloat = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
`;

const navItems = [
  { label: 'Dashboard', path: '/', icon: DashboardRoundedIcon },
  { label: 'Connections', path: '/connections', icon: LanRoundedIcon },
  { label: 'Settings', path: '/settings', icon: SettingsRoundedIcon }
];

function AppShell() {
  const location = useLocation();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const pageTitle = useMemo(() => {
    const active = navItems.find((item) =>
      item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path)
    );
    return active?.label || 'FreeFlow ETL';
  }, [location.pathname]);

  const drawer = (
    <Box sx={{ height: '100%', p: 2 }}>
      <Stack direction="row" alignItems="center" spacing={1.2} sx={{ px: 1, py: 1.5, mb: 1.5 }}>
        <Avatar
          sx={{
            width: 36,
            height: 36,
            bgcolor: 'primary.main',
            animation: `${glowPulse} 2.8s ease-in-out infinite`
          }}
        >
          <HubRoundedIcon fontSize="small" />
        </Avatar>
        <Box sx={{ animation: `${brandFloat} 5s ease-in-out infinite` }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.1 }}>
            FreeFlow ETL
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Pipeline Console
          </Typography>
        </Box>
      </Stack>

      <List>
        {navItems.map((item) => {
          const selected =
            item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);
          const Icon = item.icon;
          return (
            <ListItemButton
              key={item.path}
              component={RouterLink}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              selected={selected}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                '&.Mui-selected': {
                  bgcolor: alpha(theme.palette.primary.main, 0.12),
                  color: 'primary.main',
                  transform: 'translateX(3px)'
                },
                transition: 'transform 180ms ease, background-color 180ms ease',
                '&:hover': {
                  transform: 'translateX(2px)'
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
                <Icon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        bgcolor: 'background.default'
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0.25,
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(255, 212, 71, 0.08) 0px, rgba(255, 212, 71, 0.08) 1px, transparent 1px, transparent 6px), repeating-linear-gradient(90deg, rgba(44, 230, 255, 0.05) 0px, rgba(44, 230, 255, 0.05) 1px, transparent 1px, transparent 6px)'
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: 440,
          height: 440,
          top: -120,
          right: -120,
          borderRadius: '50%',
          filter: 'blur(18px)',
          bgcolor: alpha(theme.palette.secondary.main, 0.26),
          animation: `${driftA} 16s ease-in-out infinite`
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: 350,
          height: 350,
          bottom: -100,
          left: -90,
          borderRadius: '50%',
          filter: 'blur(16px)',
          bgcolor: alpha(theme.palette.primary.main, 0.24),
          animation: `${driftB} 20s ease-in-out infinite`
        }}
      />

      <Drawer
        variant={isDesktop ? 'permanent' : 'temporary'}
        open={isDesktop ? true : mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            borderRight: `1px solid ${alpha(theme.palette.primary.main, 0.14)}`,
            bgcolor: alpha('#0f0b24', 0.82),
            backdropFilter: 'blur(8px)',
            boxSizing: 'border-box'
          }
        }}
      >
        {drawer}
      </Drawer>

      <Box sx={{ ml: { md: `${drawerWidth}px` }, position: 'relative', zIndex: 1 }}>
        <Container sx={{ py: 2.5 }}>
          <Paper
            elevation={0}
            sx={{
              px: 2,
              py: 1.25,
              mb: 2.5,
              borderRadius: 3,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.28)}`,
              bgcolor: alpha('#120d2a', 0.78),
              backdropFilter: 'blur(8px)'
            }}
          >
            <Toolbar disableGutters sx={{ minHeight: 'unset !important' }}>
              {!isDesktop && (
                <IconButton onClick={() => setMobileOpen(true)} sx={{ mr: 1 }}>
                  <MenuRoundedIcon />
                </IconButton>
              )}
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                {pageTitle}
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  component={RouterLink}
                  to="/settings"
                  variant="outlined"
                  sx={{
                    borderRadius: 999,
                    pl: 0.75,
                    pr: 1.5,
                    transition: 'transform 180ms ease, box-shadow 180ms ease',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: '0 0 0 1px rgba(255, 212, 71, 0.3), 0 8px 16px rgba(0,0,0,0.28)'
                    }
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar sx={{ width: 26, height: 26, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                      <PersonRoundedIcon sx={{ fontSize: 16 }} />
                    </Avatar>
                    <Typography variant="button" sx={{ fontWeight: 700 }}>
                      Profile
                    </Typography>
                  </Stack>
                </Button>
              </Stack>
            </Toolbar>
          </Paper>

          <Outlet />
        </Container>
      </Box>
    </Box>
  );
}

export default AppShell;
