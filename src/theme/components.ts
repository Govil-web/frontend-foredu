// src/theme/components.ts
import { Components, Theme } from '@mui/material/styles';

/**
 * Configuración de componentes para el tema de Foredu
 * Define estilos específicos para cada componente de Material UI
 */
export const components: Components<Omit<Theme, 'components'>> = {
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
    defaultProps: {
      disableElevation: true,
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
  MuiCardHeader: {
    styleOverrides: {
      root: {
        padding: '16px 24px',
      },
      title: {
        fontSize: '1.125rem',
        fontWeight: 600,
      },
    },
  },
  MuiCardContent: {
    styleOverrides: {
      root: {
        padding: '24px',
        '&:last-child': {
          paddingBottom: '24px',
        },
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
      elevation1: {
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
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
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: '8px',
        }
      }
    }
  },
  MuiInputLabel: {
    styleOverrides: {
      root: {
        fontSize: '0.875rem',
      }
    }
  },
  MuiMenuItem: {
    styleOverrides: {
      root: {
        fontSize: '0.875rem',
      }
    }
  },
  MuiDivider: {
    styleOverrides: {
      root: {
        borderColor: '#E0E0E0',
      }
    }
  },
  MuiTypography: {
    defaultProps: {
      variantMapping: {
        h1: 'h1',
        h2: 'h2',
        h3: 'h3',
        h4: 'h4',
        h5: 'h5',
        h6: 'h6',
        subtitle1: 'h6',
        subtitle2: 'h6',
        body1: 'p',
        body2: 'p',
      }
    }
  },
};