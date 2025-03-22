// src/components/layout/Sidebar/Sidebar.tsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  useTheme,
  ListItemButton,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  CalendarMonth as CalendarIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { UserRole } from '../../../types/auth';
import Logo from '../../design-system/Logo/Logo';

const drawerWidth = 260;

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

interface SidebarProps {
  open: boolean;
  isMobile: boolean;
  user: any; // Usar el tipo User correcto cuando se implemente
  handleDrawerClose: () => void;
  handleNavigation: (path: string) => void;
  handleLogout: () => Promise<void>;
}

const Sidebar: React.FC<SidebarProps> = ({
  open,
  isMobile,
  user,
  handleDrawerClose,
  handleNavigation,
  handleLogout
}) => {
  const theme = useTheme();
  const location = useLocation();

  // Obtén los elementos de navegación según el rol del usuario
  const navigationItems = user ? getNavigationItems(user.role) : [];

  return (
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
  );
};

export default Sidebar;