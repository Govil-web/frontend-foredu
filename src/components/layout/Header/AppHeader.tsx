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
import { styleUtils } from '../../../utils/styleUtils';
import { User } from '../../../types/auth';

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
    <AppBar
      position="fixed"
      sx={{
        width: { 
          sm: open ? `calc(100% - ${drawerWidth}px)` : '100%' 
        },
        ml: { sm: open ? `${drawerWidth}px` : 0 },
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        backgroundColor: theme.palette.secondary.main,
        ...styleUtils.boxShadow(theme, 'low'),
        zIndex: theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ 
        position: 'relative', 
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerOpen}
          sx={{ mr: 2, ...(open && { display: 'none' }) }}
        >
          <MenuIcon />
        </IconButton>
        
        <Typography variant="h6" noWrap sx={{ flexGrow: 1, zIndex: 1 }}>
          Sistema de Gestión Escolar
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          zIndex: 1 
        }}>
          <Tooltip title="Notificaciones">
            <IconButton color="inherit">
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Perfil y Configuración">
            <IconButton 
              onClick={handleOpenUserMenu} 
              sx={{ 
                p: 0, 
                ml: 2,
                ...styleUtils.hoverEffect(theme)
              }}
            >
              <Avatar 
                alt={user?.nombre} 
                sx={{ 
                  bgcolor: theme.palette.primary.main,
                  color: '#fff',
                  width: 40,
                  height: 40,
                  boxShadow: `0 4px 10px ${theme.palette.primary.main}30`
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
        
        <Box
          sx={{
            ...styleUtils.backgroundDecoration(theme, {
              color: theme.palette.primary.main, 
              size: 150, 
              position: 'top-right'
            })
          }}
        />
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;