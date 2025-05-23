// src/theme/components.ts
import { Components, Theme } from '@mui/material/styles';

const componentsConfig = (theme: Theme): Components<Omit<Theme, 'components'>> => ({
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: theme.shape.borderRadius,
        padding: theme.spacing(1, 2),
        boxShadow: 'none',
      },
      contained: {
        '&:hover': {
          boxShadow: `0px 4px 10px ${theme.palette.primary.main}20`,
        },
      },
      outlinedPrimary: {
        borderColor: theme.palette.primary.main,
      },
    },
    defaultProps: {
      disableElevation: true,
    },
  },
  MuiTableHead: {
    styleOverrides: {
      root: {
        backgroundColor: theme.palette.secondary.main,
        '& .MuiTableCell-head': {
          color: theme.palette.common.white,
          fontWeight: 500,
        },
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        padding: theme.spacing(1.5, 2),
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: theme.shape.borderRadius * 1.5,
        boxShadow: theme.shadows[2],
      },
    },
  },
  MuiCardHeader: {
    styleOverrides: {
      root: {
        padding: theme.spacing(2, 3),
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
        padding: theme.spacing(3),
        '&:last-child': {
          paddingBottom: theme.spacing(3),
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
          color: theme.palette.primary.main,
        },
      },
    },
  },
  MuiTabs: {
    styleOverrides: {
      indicator: {
        backgroundColor: theme.palette.primary.main,
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
      },
      elevation1: {
        boxShadow: theme.shadows[2],
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        fontWeight: 500,
      },
      colorPrimary: {
        backgroundColor: theme.palette.primary.main,
      },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        '&:hover': {
          backgroundColor: theme.palette.action.hover,
        },
      },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: {
        backgroundColor: theme.palette.background.default,
        borderRight: `1px solid ${theme.palette.divider}`,
      },
    },
  },
  MuiListItemButton: {
    styleOverrides: {
      root: {
        borderRadius: theme.shape.borderRadius,
        marginBottom: theme.spacing(0.5),
        '&.Mui-selected': {
          backgroundColor: theme.palette.action.selected,
          color: theme.palette.primary.main,
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: '25%',
            bottom: '25%',
            width: '3px',
            backgroundColor: theme.palette.primary.main,
            borderRadius: theme.shape.borderRadius,
          },
        },
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: theme.shape.borderRadius,
        }
      }
    }
  },
  MuiInputLabel: {
    styleOverrides: {
      root: {
        fontSize: theme.typography.pxToRem(14),
      }
    }
  },
  MuiMenuItem: {
    styleOverrides: {
      root: {
        fontSize: theme.typography.pxToRem(14),
      }
    }
  },
  MuiDivider: {
    styleOverrides: {
      root: {
        borderColor: theme.palette.divider,
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
  MuiBadge: {
    styleOverrides: {
      badge: {
        right: theme.spacing(0.375),
        bottom: theme.spacing(0.375),
        border: `1px solid ${theme.palette.background.paper}`,
      }
    }
  }
});

export const components = componentsConfig;