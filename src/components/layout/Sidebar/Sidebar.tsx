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
import { styleUtils } from '../../../utils/styleUtils';
import { UserRole } from '../../../types/auth';
import Logo from '../../../assets/foredulogo.png';

const drawerWidth = 260;

// Define las rutas de navegación según el rol del usuario
const getNavigationItems = (role: UserRole) => {
  const commonItems = [
    { text: 'Perfil', icon: <PersonIcon />, path: '/profile' },
  ];

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
  user: any;
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

  const navigationItems = user ? getNavigationItems(user.role) : [];

  return (
    <Drawer
      variant={isMobile ? "temporary" : "persistent"}
      open={open}
      onClose={handleDrawerClose}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: theme.palette.background.paper,
          borderRight: 'none',
          ...styleUtils.boxShadow(theme, 'low'),
        },
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        p: 1, 
        minHeight: '64px' 
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', px: 2 }}>
        <img src={Logo} alt="Foredu Logo" style={{ width:'172px' , height: '40px' }} />

        </Box>
        <IconButton onClick={handleDrawerClose}>
          <ChevronLeftIcon />
        </IconButton>
      </Box>
      
      <Divider />
      
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
            boxShadow: `0 4px 12px ${theme.palette.primary.main}30`,
            border: '4px solid white'
          }}
        >
          {user?.nombre?.charAt(0)}
        </Avatar>
        
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          {user?.nombre}
        </Typography>
        
        <Typography 
          variant="body2" 
          sx={{ 
            display: 'inline-block',
            color: theme.palette.text.secondary,
            bgcolor: `${theme.palette.primary.main}10`,
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
      
      <List sx={{ p: 1, flexGrow: 1 }}>
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem 
              key={item.text}
              disablePadding
              sx={{ 
                margin: theme.spacing(0.5, 1),
                borderRadius: '8px',
                backgroundColor: isActive ? theme.palette.primary.main : 'transparent',
                color: isActive ? '#fff' : theme.palette.text.primary,
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: isActive 
                    ? theme.palette.primary.dark 
                    : `${theme.palette.primary.light}20`,
                  transform: 'translateX(5px)',
                },
              }}
            >
              <ListItemButton 
                selected={isActive}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  '& .MuiListItemIcon-root': {
                    color: isActive ? '#fff' : theme.palette.primary.main,
                    transition: 'color 0.2s ease',
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 'bold' : 'medium'
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      
      <Box sx={{ 
        p: 2, 
        marginTop: 'auto', 
        backgroundColor: theme.palette.background.paper, 
        position: 'relative', 
        overflow: 'hidden'
      }}>
        <ListItem 
          disablePadding
          sx={{ 
            ...styleUtils.hoverEffect(theme),
            borderRadius: '8px',
          }}
        >
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Cerrar sesión" />
          </ListItemButton>
        </ListItem>
        
        <Box
          sx={{
            ...styleUtils.backgroundDecoration(theme, {
              color: theme.palette.primary.main, 
              size: 120, 
              position: 'bottom-left'
            })
          }}
        />
      </Box>
    </Drawer>
  );
};

export default Sidebar;