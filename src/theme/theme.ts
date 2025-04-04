// src/theme/theme.ts
import { createTheme } from '@mui/material/styles';

// Declarar módulos adicionales para ampliar la paleta de colores
declare module '@mui/material/styles' {
  interface Palette {
    sidebar: Palette['primary'];
  }
  
  interface PaletteOptions {
    sidebar?: PaletteOptions['primary'];
  }
}

// Definición del tema basado en el diseño de Foredu
const foreduTheme = createTheme({
  palette: {
    primary: {
      main: '#E9511D', // Naranja Foredu
      light: '#FF7A47',
      dark: '#C43C00',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#262853', // Azul oscuro Foredu
      light: '#3E4178',
      dark: '#1A1C3F',
      contrastText: '#FFFFFF',
    },
    sidebar: {
      main: '#F9FAFB', // Fondo gris claro para sidebar
      light: '#FFFFFF',
      dark: '#E0E0E0',
      contrastText: '#1E1E1E',
    },
    background: {
      default: '#F9FAFB', // Fondo principal
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1E1E1E', 
      secondary: '#637381',
    },
    error: {
      main: '#F44336',
    },
    warning: {
      main: '#FF9800',
    },
    info: {
      main: '#2196F3',
    },
    success: {
      main: '#4CAF50',
    },
  },
  typography: {
    fontFamily: '"Noto Sans", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      color: '#262853',
    },
    h5: {
      fontWeight: 600,
      color: '#262853',
    },
    h6: {
      fontWeight: 600,
      color: '#262853',
    },
    subtitle1: {
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '8px 16px',
          boxShadow: 'none',
        },
        contained: {
          '&:hover': {
            boxShadow: '0px 4px 10px rgba(233, 81, 29, 0.2)',
          },
        },
        outlinedPrimary: {
          borderColor: '#E9511D',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#262853',
          '& .MuiTableCell-head': {
            color: '#FFFFFF',
            fontWeight: 500,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '12px 16px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          width: 40,
          height: 40,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          minWidth: 'auto',
          '&.Mui-selected': {
            color: '#E9511D',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#E9511D',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
        colorPrimary: {
          backgroundColor: '#E9511D',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(233, 81, 29, 0.08)',
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#F9FAFB',
          borderRight: '1px solid #E0E0E0',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          marginBottom: '4px',
          '&.Mui-selected': {
            backgroundColor: 'rgba(233, 81, 29, 0.08)',
            color: '#E9511D',
            '&:hover': {
              backgroundColor: 'rgba(233, 81, 29, 0.12)',
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              left: 0,
              top: '25%',
              bottom: '25%',
              width: '3px',
              backgroundColor: '#E9511D',
              borderRadius: '0 4px 4px 0',
            },
          },
        },
      },
    },
  },
});

export default foreduTheme;