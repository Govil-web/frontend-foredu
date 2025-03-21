// src/components/layout/Sidebar/Sidebar.tsx
import React from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Box, 
  useTheme 
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import Logo from '../../design-system/Logo/Logo';

// Iconos de MUI
import HomeIcon from '@mui/icons-material/Home';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EmailIcon from '@mui/icons-material/Email';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import DescriptionIcon from '@mui/icons-material/Description';
import HelpIcon from '@mui/icons-material/Help';
import LogoutIcon from '@mui/icons-material/Logout';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import AssessmentIcon from '@mui/icons-material/Assessment';
import MenuBookIcon from '@mui/icons-material/MenuBook';

interface SidebarProps {
  width?: number;
  open?: boolean;
  onClose?: () => void;
  variant?: 'permanent' | 'persistent' | 'temporary';
}

const Sidebar: React.FC<SidebarProps> = ({ 
  width = 240, 
  open = true, 
  onClose, 
  variant = 'permanent' 
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  
  // Configuración de navegación basada en el rol del usuario
  const getNavigationByRole = (role: string | undefined) => {
    const common = [
      { name: 'Inicio', icon: <HomeIcon />, path: '/dashboard' },
      { name: 'Calendario', icon: <CalendarMonthIcon />, path: '/calendar' },
      { name: 'Mensajes', icon: <EmailIcon />, path: '/messages' },
    ];
    
    const roleSpecific: Record<string, Array<{ name: string, icon: React.ReactElement, path: string }>> = {
      'ADMIN': [
        { name: 'Grados', icon: <SchoolIcon />, path: '/grades' },
        { name: 'Usuarios', icon: <PeopleIcon />, path: '/users' },
        { name: 'Boletines', icon: <DescriptionIcon />, path: '/bulletins' },
      ],
      'TEACHER': [
        { name: 'Grados', icon: <SchoolIcon />, path: '/grades' },
        { name: 'Asistencia', icon: <HowToRegIcon />, path: '/attendance' },
        { name: 'Calificaciones', icon: <AssessmentIcon />, path: '/grades/manage' },
      ],
      'STUDENT': [
        { name: 'Mis Calificaciones', icon: <AssessmentIcon />, path: '/my-grades' },
        { name: 'Mis Cursos', icon: <MenuBookIcon />, path: '/my-courses' },
      ],
      'TUTOR': [
        { name: 'Estudiantes', icon: <PeopleIcon />, path: '/my-students' },
        { name: 'Progreso', icon: <AssessmentIcon />, path: '/progress' },
      ],
    };
    
    return [...common, ...(role && roleSpecific[role] ? roleSpecific[role] : [])];
  };
  
  const navigation = getNavigationByRole(user?.role);
  
  const isActive = (path: string) => location.pathname === path;
  
  const drawerContent = (
    <>
    <Box sx={{ 
  p: 2, 
  display: 'flex', 
  justifyContent: 'center',
  backgroundColor: theme.palette.sidebar.light
}}>
  {/* Usa explícitamente el color 'color' para asegurar la visualización correcta */}
  <Logo variant="horizontal" size="medium" color="color" />
</Box>
      
      <List sx={{ px: 2 }}>
        {navigation.map((item) => (
          <ListItem key={item.name} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton 
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 1,
                bgcolor: isActive(item.path) ? 'rgba(233, 81, 29, 0.1)' : 'transparent',
                color: isActive(item.path) ? 'primary.main' : 'text.primary',
                '&:hover': {
                  bgcolor: isActive(item.path) ? 'rgba(233, 81, 29, 0.16)' : 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <ListItemIcon sx={{ 
                color: isActive(item.path) ? 'primary.main' : 'text.primary',
                minWidth: 40
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Divider sx={{ my: 2 }} />
      
      <List sx={{ px: 2 }}>
        <ListItem disablePadding>
          <ListItemButton 
            sx={{ borderRadius: 1 }}
            onClick={() => navigate('/support')}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <HelpIcon />
            </ListItemIcon>
            <ListItemText primary="Soporte" />
          </ListItemButton>
        </ListItem>
        
        <ListItem disablePadding>
          <ListItemButton 
            sx={{ borderRadius: 1 }}
            onClick={logout}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Salir" />
          </ListItemButton>
        </ListItem>
      </List>
    </>
  );
  
  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      sx={{
        width: width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: width,
          boxSizing: 'border-box',
          bgcolor: 'sidebar.main',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;