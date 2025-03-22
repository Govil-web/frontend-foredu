// src/components/layout/MainLayout/MainLayout.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Toolbar,
  useMediaQuery,
  useTheme,
  CssBaseline,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../../../hooks/useAuth';
import AppHeader from '../Header/AppHeader';
import Sidebar from '../Sidebar/Sidebar';
import drawerWidth from '../Sidebar/constants';

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
  paddingBottom: theme.spacing(10), // Para asegurar espacio al final del contenido
  position: 'relative',
  overflow: 'hidden',
  '@media (max-width: 600px)': {
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(8),
  },
}));

const MainContentDecoration1 = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  right: 0,
  width: '300px',
  height: '300px',
  borderBottomLeftRadius: '100%',
  background: theme.palette.secondary.main,
  opacity: 0.03,
  zIndex: 0,
}));

const MainContentDecoration2 = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  width: '300px',
  height: '300px',
  borderTopRightRadius: '100%',
  background: theme.palette.primary.main,
  opacity: 0.03,
  zIndex: 0,
}));

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(!isMobile);
  const navigate = useNavigate();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', overflow: 'hidden' }}>
      <CssBaseline />
      
      {/* Componente AppHeader extraído */}
      <AppHeader 
        open={open}
        drawerWidth={drawerWidth}
        user={user}
        logout={logout}
        handleDrawerOpen={handleDrawerOpen}
      />
      
      {/* Componente Sidebar extraído */}
      <Sidebar
        open={open}
        isMobile={isMobile}
        user={user}
        handleDrawerClose={handleDrawerClose}
        handleNavigation={handleNavigation}
        handleLogout={handleLogout}
      />
      
      <Main open={open} sx={{ bgcolor: 'background.default' }}>
        <Toolbar /> {/* Espacio para que el contenido no quede debajo del AppBar */}
        <Box 
          component="div" 
          sx={{ 
            p: { xs: 1, sm: 2, md: 3 },
            position: 'relative',
            zIndex: 1,
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          {children}
        </Box>
        <MainContentDecoration1 />
        <MainContentDecoration2 />
      </Main>
    </Box>
  );
};

export default MainLayout;