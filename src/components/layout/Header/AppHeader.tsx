// src/components/layout/AppHeader/AppHeader.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  ListItemIcon,
  Badge,
  Box,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { User } from '../../../types/auth';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
  zIndex: theme.zIndex.drawer + 1,
  position: 'fixed',
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

interface AppHeaderProps {
  open: boolean;
  drawerWidth: number;
  user: User | null;
  logout: () => Promise<void>;
  handleDrawerOpen: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  open,
  drawerWidth,
  user,
  logout,
  handleDrawerOpen,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async () => {
    handleCloseUserMenu();
    await logout();
    navigate('/');
  };

  return (
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
  );
};

export default AppHeader;