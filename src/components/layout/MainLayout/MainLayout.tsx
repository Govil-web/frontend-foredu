// src/components/layout/MainLayout/MainLayout.tsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  useMediaQuery,
  useTheme,
  CssBaseline,
  Badge,
  ListItemButton,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  CalendarMonth as CalendarIcon,
  Message as MessageIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { UserRole } from '../../../types/auth';
import { useAuth } from '../../../hooks/useAuth';
import  Logo  from '../../design-system/Logo/Logo';

const drawerWidth = 260;

// Colores de seguridad para usar como fallback
const safeColors = {
  primary: {
    main: '#E9511D',
    light: '#FF7A47',
    dark: '#C43C00',
  },
  secondary: {
    main: '#262853',
    light: '#3E4178',
    dark: '#1A1C3F',
  },
  sidebar: {
    main: '#E7EAF5',
    light: '#F0F4FA',
    dark: '#D0D6E6',
  }
};

// Función para acceder de forma segura a colores del tema
const getThemeColor = (theme: any, colorType: keyof typeof safeColors, variant: keyof typeof safeColors['primary'] = 'main') => {
  try {
    return theme.palette[colorType]?.[variant] || safeColors[colorType][variant];
  } catch (e) {
    // Fallback a colores seguros si hay algún error
    return safeColors[colorType][variant];
  }
};

// Componente para las formas decorativas
const DecorativeShape = styled(Box)(({ theme }) => ({
  position: 'absolute',
  borderRadius: '50%',
  opacity: 0.8,
  zIndex: 0,
}));

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

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
  zIndex: theme.zIndex.drawer + 1,
  position: 'fixed',
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    backgroundColor: theme.palette.background.paper,
    borderRight: 'none',
    boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.05)',
  },
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1),
  backgroundColor: getThemeColor(theme, 'sidebar'), // Utilizamos la función segura
  minHeight: '64px',
  overflow: 'hidden',
  position: 'relative',
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 2),
  position: 'relative',
  zIndex: 1,
}));

const ListItemStyled = styled(ListItem)<{ active?: number }>(({ theme, active }) => ({
  margin: theme.spacing(0.5, 1),
  borderRadius: '8px',
  backgroundColor: active ? theme.palette.primary.main : 'transparent',
  color: active ? '#fff' : theme.palette.text.primary,
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: active ? theme.palette.primary.dark : theme.palette.primary.light + '20',
    transform: 'translateX(5px)',
  },
  '& .MuiListItemIcon-root': {
    color: active ? '#fff' : theme.palette.primary.main,
    transition: 'color 0.2s ease',
  },
  '& .MuiListItemText-primary': {
    fontWeight: active ? 600 : 400,
    transition: 'font-weight 0.2s ease',
  },
}));

const HeaderDecoration = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  right: 0,
  width: '150px',
  height: '150px',
  borderBottomLeftRadius: '100%',
  background: theme.palette.primary.main,
  opacity: 0.1,
  zIndex: 0,
}));

const DrawerDecoration = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  right: 0,
  width: '120px',
  height: '120px',
  borderTopLeftRadius: '100%',
  background: theme.palette.primary.main,
  opacity: 0.1,
  zIndex: 0,
}));

const DrawerFooter = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  marginTop: 'auto',
  backgroundColor: theme.palette.background.paper,
  position: 'relative',
  overflow: 'hidden',
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

// Define las rutas de navegación según el rol del usuario
const getNavigationItems = (role: UserRole) => {
  // Elementos de navegación comunes para todos los roles
  const commonItems = [
    { text: 'Perfil', icon: <PersonIcon />, path: '/profile' },
  ];

  // Elementos específicos para cada rol
  switch (role) {
    case UserRole.ADMIN:
      return [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
        { text: 'Usuarios', icon: <PeopleIcon />, path: '/admin/users' },
        { text: 'Cursos', icon: <SchoolIcon />, path: '/admin/courses' },
        { text: 'Reportes', icon: <AssessmentIcon />, path: '/admin/reports' },
        { text: 'Configuración', icon: <SettingsIcon />, path: '/admin/settings' },
        ...commonItems
      ];
    case UserRole.PROFESOR:
      return [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/teacher/dashboard' },
        { text: 'Calificaciones', icon: <AssessmentIcon />, path: '/teacher/grades' },
        { text: 'Asistencia', icon: <CalendarIcon />, path: '/teacher/attendance' },
        ...commonItems
      ];
    case UserRole.ESTUDIANTE:
      return [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/student/dashboard' },
        { text: 'Calificaciones', icon: <AssessmentIcon />, path: '/student/grades' },
        ...commonItems
      ];
    case UserRole.TUTOR:
      return [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/tutor/dashboard' },
        { text: 'Progreso', icon: <AssessmentIcon />, path: '/tutor/progress' },
        ...commonItems
      ];
    default:
      return commonItems;
  }
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(!isMobile);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async () => {
    handleCloseUserMenu();
    await logout();
    navigate('/login');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setOpen(false);
    }
  };

  // Obtén los elementos de navegación según el rol del usuario
  const navigationItems = user ? getNavigationItems(user.role) : [];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', overflow: 'hidden' }}>
      <CssBaseline />
      <StyledAppBar
        position="fixed"
        sx={{
          width: { sm: open ? `calc(100% - ${drawerWidth}px)` : '100%' },
          ml: { sm: open ? `${drawerWidth}px` : 0 },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar sx={{ position: 'relative', overflow: 'hidden' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerOpen}
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, zIndex: 1 }}>
            Sistema de Gestión Escolar
          </Typography>
          
          {/* Íconos de la barra superior */}
          <Box sx={{ display: 'flex', alignItems: 'center', zIndex: 1 }}>
            <Tooltip title="Notificaciones">
              <IconButton color="inherit">
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Perfil y Configuración">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 2 }}>
                <Avatar 
                  alt={user?.nombre} 
                  sx={{ 
                    bgcolor: theme.palette.primary.main,
                    color: '#fff',
                    width: 40,
                    height: 40,
                    boxShadow: '0px 2px 8px rgba(233, 81, 29, 0.3)'
                  }}
                >
                  {user?.nombre?.charAt(0)}
                </Avatar>
              </IconButton>
            </Tooltip>
            
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/profile'); }}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" color="primary" />
                </ListItemIcon>
                <Typography textAlign="center">Perfil</Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" color="error" />
                </ListItemIcon>
                <Typography textAlign="center">Cerrar sesión</Typography>
              </MenuItem>
            </Menu>
          </Box>
          
          {/* Elemento decorativo */}
          <HeaderDecoration />
        </Toolbar>
      </StyledAppBar>
      
      <StyledDrawer
        variant={isMobile ? "temporary" : "persistent"}
        open={open}
        onClose={handleDrawerClose}
      >
        <DrawerHeader>
          <LogoContainer>
          <Logo variant="horizontal" size="medium" />

          </LogoContainer>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>
        <Divider />
        
        {/* Información del usuario */}
        <Box sx={{ 
          p: 2, 
          textAlign: 'center', 
          bgcolor: getThemeColor(theme, 'sidebar', 'light'), // Utilizamos la función segura
          position: 'relative', 
          overflow: 'hidden' 
        }}>
          <Avatar 
            alt={user?.nombre}
            sx={{ 
              width: 80, 
              height: 80, 
              mx: 'auto', 
              mb: 1,
              bgcolor: theme.palette.primary.main,
              color: '#fff',
              boxShadow: '0px 4px 12px rgba(233, 81, 29, 0.3)',
              border: '4px solid white'
            }}
          >
            {user?.nombre?.charAt(0)}
          </Avatar>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{user?.nombre}</Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              display: 'inline-block',
              color: theme.palette.text.secondary,
              bgcolor: 'rgba(233, 81, 29, 0.1)',
              px: 1.5,
              py: 0.5,
              borderRadius: '12px',
              marginTop: 0.5
            }}
          >
            {user?.role === UserRole.ADMIN ? 'Administrador' : 
             user?.role === UserRole.PROFESOR ? 'Profesor' :
             user?.role === UserRole.ESTUDIANTE ? 'Estudiante' : 'Tutor'}
          </Typography>

          {/* Decoración del perfil */}
          <DecorativeShape 
            sx={{ 
              top: -30, 
              right: -30, 
              width: 100, 
              height: 100, 
              backgroundColor: theme.palette.primary.main,
              opacity: 0.1,
              borderRadius: '0 0 0 100%'
            }} 
          />
        </Box>
        
        <Divider />
        
        {/* Lista de navegación */}
        <List sx={{ p: 1, flexGrow: 1 }}>
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItemStyled 
                key={item.text}
                onClick={() => handleNavigation(item.path)}
                active={isActive ? 1 : 0}
                disablePadding
              >
                <ListItemButton selected={isActive}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText 
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 'bold' : 'medium'
                    }}
                  />
                </ListItemButton>
              </ListItemStyled>
            );
          })}
        </List>
        
        <DrawerFooter>
          <ListItemStyled disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon><LogoutIcon /></ListItemIcon>
              <ListItemText primary="Cerrar sesión" />
            </ListItemButton>
          </ListItemStyled>
          <DrawerDecoration />
        </DrawerFooter>
      </StyledDrawer>
      
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