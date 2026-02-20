import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffd447',
      contrastText: '#140f00'
    },
    secondary: {
      main: '#ff7a45'
    },
    info: {
      main: '#2ce6ff'
    },
    success: {
      main: '#7dff95'
    },
    background: {
      default: '#0a0820',
      paper: '#16112e'
    },
    text: {
      primary: '#fff6d6',
      secondary: '#c7bfd9'
    }
  },
  shape: {
    borderRadius: 12
  },
  typography: {
    fontFamily: '"Space Grotesk", "Trebuchet MS", "Segoe UI", sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: '0.02em'
    },
    h6: {
      fontWeight: 600
    },
    overline: {
      letterSpacing: '0.12em'
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background:
            'radial-gradient(circle at 25% -10%, rgba(255, 125, 69, 0.2) 0%, rgba(10, 8, 32, 0) 45%), radial-gradient(circle at 85% 120%, rgba(255, 212, 71, 0.14) 0%, rgba(10, 8, 32, 0) 48%), #0a0820'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(255, 212, 71, 0.15)',
          boxShadow: '0 10px 28px rgba(0, 0, 0, 0.28)'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 700
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(8, 6, 20, 0.46)'
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(255, 212, 71, 0.35)'
        }
      }
    }
  }
});

export default theme;
