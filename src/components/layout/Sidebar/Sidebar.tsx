import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  ListItemButton,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Cottage as CottageIcon,
  PeopleAltOutlined as PeopleIcon,
  PanoramaWideAngleSharp as PanoramaWideAngleSharpIcon,
  CalendarMonth as CalendarIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Assessment as AssessmentIcon,
  ArticleOutlined as ArticleIcon,
  HeadsetMic as HeadsetMicIcon,
  // Settings as SettingsIcon,
  MailOutlineOutlined as MailOutlineIcon,
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
        { text: 'Dashboard', icon: <CottageIcon />, path: '/admin/dashboard' },
        { text: 'Grados', icon: <PanoramaWideAngleSharpIcon />, path: '/admin/grades' },
        { text: 'Calendario', icon: <CalendarIcon />, path: '/admin/reports' },
        { text: 'Usuarios', icon: <PeopleIcon />, path: '/admin/users' },
        { text: 'Mensajes', icon: <MailOutlineIcon />, path: '#' },
        { text: 'Boletines', icon: <ArticleIcon />, path: '#' }
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
      backgroundColor: '#E7EAF5',
      borderRight: 'none',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
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
      <img src={Logo} alt="Foredu Logo" style={{ width: '172px', height: '40px' }} />
    </Box>
  </Box>

  <List sx={{ p: 1, flexGrow: 1, marginTop: 2 }}>
    {navigationItems.map((item) => {
      const isActive = location.pathname === item.path;
      return (
        <ListItem 
          key={item.text}
          disablePadding
          sx={{ 
            margin: theme.spacing(0.5, 1),
            borderRadius: '8px',
            backgroundColor: isActive ? theme.palette.background.paper : 'transparent',
            color: theme.palette.text.primary,
            transition: 'all 0.2s ease',
            width: '75%',
            '&:hover': {
              backgroundColor: `${theme.palette.primary.light}20`,
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
            <ListItemIcon>
              {React.cloneElement(item.icon, {
                sx: {
                  color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
                },
              })}
            </ListItemIcon>

            <ListItemText 
              primary={item.text}
              primaryTypographyProps={{
                fontWeight: isActive ? 'bold' : 'medium',
                color: theme.palette.text.primary,
              }}
            />
          </ListItemButton>
        </ListItem>
      );
    })}
  </List>

  {/* Soporte y Salir */}
  <Box sx={{ px: 2 }}>

    <ListItem disablePadding sx={{ ...styleUtils.hoverEffect(theme), borderRadius: '8px' }}>
      <ListItemButton onClick={() => alert('Soporte')}>
        <ListItemIcon><HeadsetMicIcon /></ListItemIcon>
        <ListItemText primary="Soporte" />
      </ListItemButton>
    </ListItem>

    <Divider sx={{ my: 1, borderColor: '#D6D6D6' }} />

    <ListItem disablePadding sx={{ ...styleUtils.hoverEffect(theme), borderRadius: '8px' }}>
      <ListItemButton onClick={handleLogout}>
        <ListItemIcon><LogoutIcon /></ListItemIcon>
        <ListItemText primary="Salir" />
      </ListItemButton>
    </ListItem>
  </Box>
</Drawer>
  );
};

export default Sidebar;