// src/theme/theme.ts
import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    sidebar: Palette['primary'];
  }
  
  interface PaletteOptions {
    sidebar?: PaletteOptions['primary'];
  }
}

// Definición de colores basada en el manual de marca de Foredu
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
      main: '#E7EAF5', // Azul pálido para sidebar
      light: '#F0F4FA',
      dark: '#D0D6E6',
      contrastText: '#1E1E1E',
    },
    background: {
      default: '#F0F4FA', // Blanco azulado
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1E1E1E', // Gris pizarra para textos
      secondary: '#4E5260',
    },
    error: {
      main: '#F44336',
      light: '#E57373',
      dark: '#D32F2F',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#FF9800',
      light: '#FFB74D',
      dark: '#F57C00',
      contrastText: '#FFFFFF',
    },
    info: {
      main: '#2196F3',
      light: '#64B5F6',
      dark: '#1976D2',
     contrastText: '#FFFFFF',
    },
    success: {
      main: '#4CAF50',
      light: '#81C784',
      dark: '#388E3C',
      contrastText: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Noto Sans TC", sans-serif',
    h1: {
      fontWeight: 700,
      color: '#262853',
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 700,
      color: '#262853',
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      color: '#262853',
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      color: '#262853',
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 600,
      color: '#262853',
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      color: '#262853',
      fontSize: '1rem',
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: '1rem',
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: '0.875rem',
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
    button: {
      textTransform: 'none', // Evita letras en mayúsculas en los botones
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12, // Bordes redondeados consistentes
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '8px 16px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
          },
        },
      },
      variants: [
        {
          props: { variant: 'contained', color: 'primary' },
          style: {
            backgroundColor: '#E9511D',
            '&:hover': {
              backgroundColor: '#C43C00',
            },
          },
        },
        {
          props: { variant: 'contained', color: 'secondary' },
          style: {
            backgroundColor: '#262853',
            '&:hover': {
              backgroundColor: '#1A1C3F',
            },
          },
        },
      ],
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100px',
            height: '100px',
            background: 'radial-gradient(circle at top right, rgba(38, 40, 83, 0.05) 0%, rgba(38, 40, 83, 0) 70%)',
            borderTopRightRadius: '12px',
            zIndex: 0,
          }
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: '16px 24px',
          position: 'relative',
          zIndex: 1,
        },
        title: {
          fontWeight: 600,
          color: '#262853',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '16px 24px',
          position: 'relative',
          zIndex: 1,
          '&:last-child': {
            paddingBottom: '24px',
          },
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#F0F4FA',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          color: '#262853',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          '&.Mui-selected': {
            color: '#E9511D',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        elevation1: {
          boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)',
        },
        root: {
          backgroundImage: 'none',
        }
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          fontWeight: 500,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: '#E9511D',
          color: '#FFFFFF',
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: '40px',
          color: '#E9511D',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#FFFFFF',
          borderRight: 'none',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          '@media (min-width: 600px)': {
            minHeight: '64px',
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#F0F4FA',
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#F0F4FA',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#D0D6E6',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#A0A8C0',
          },
        },
      },
    },
  },
});

export default foreduTheme;