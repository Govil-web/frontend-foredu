// src/components/layout/Header/Header.tsx
import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Typography, 
  Avatar, 
  Badge, 
  Menu, 
  MenuItem, 
  InputBase, 
  Box, 
  useTheme,
  alpha,
  Tooltip,
  Divider,
  ListItemIcon,
  styled
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  MoreVert as MoreIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '../../../hooks/useAuth';
import { UserRole } from '../../../types/auth';
import { useNavigate } from 'react-router-dom';

// Componente para las formas decorativas
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

// AppBar estilizado
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
  position: 'sticky',
  zIndex: theme.zIndex.drawer + 1,
}));

// Campo de búsqueda estilizado
const SearchBox = styled(Box)(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  width: '100%',
  maxWidth: 300,
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: alpha(theme.palette.common.white, 0.7),
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
    color: 'white',
    '&::placeholder': {
      color: alpha(theme.palette.common.white, 0.7),
      opacity: 1,
    },
  },
}));

interface HeaderProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  onMenuClick, 
  showMenuButton = false 
}) => {
  const theme = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Estados para los menús
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  // Manejadores de eventos
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
    navigate('/login');
  };

  const handleNavigateToProfile = () => {
    handleMenuClose();
    navigate('/profile');
  };

  const handleNavigateToSettings = () => {
    handleMenuClose();
    if (user?.role === UserRole.ADMIN) {
      navigate('/admin/settings');
    } else {
      navigate('/profile'); // Para otros roles, redirigir al perfil
    }
  };
  
  // Función para obtener el nombre del rol en español
  const getRoleName = (role?: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'Administrador';
      case UserRole.PROFESOR:
        return 'Profesor';
      case UserRole.ESTUDIANTE:
        return 'Estudiante';
      case UserRole.TUTOR:
        return 'Tutor';
      default:
        return 'Usuario';
    }
  };
  
  // Menú de perfil
  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      PaperProps={{
        elevation: 2,
        sx: {
          borderRadius: 2,
          minWidth: 180,
          overflow: 'visible',
          mt: 1.5,
          '&:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: 'background.paper',
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
          },
        },
      }}
    >
      <MenuItem onClick={handleNavigateToProfile}>
        <ListItemIcon>
          <PersonIcon fontSize="small" color="primary" />
        </ListItemIcon>
        <Typography variant="body2">Mi Perfil</Typography>
      </MenuItem>
      <MenuItem onClick={handleNavigateToSettings}>
        <ListItemIcon>
          <SettingsIcon fontSize="small" color="primary" />
        </ListItemIcon>
        <Typography variant="body2">Configuración</Typography>
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleLogout}>
        <ListItemIcon>
          <LogoutIcon fontSize="small" color="error" />
        </ListItemIcon>
        <Typography variant="body2" color="error">Cerrar sesión</Typography>
      </MenuItem>
    </Menu>
  );

  // Menú móvil
  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
      PaperProps={{
        elevation: 2,
        sx: {
          borderRadius: 2,
          mt: 1.5,
        },
      }}
    >
      <MenuItem>
        <IconButton size="large" color="inherit">
          <Badge badgeContent={4} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <Typography variant="body2">Notificaciones</Typography>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <Avatar 
            sx={{ 
              bgcolor: theme.palette.primary.main,
              color: 'white',
              width: 32,
              height: 32,
            }}
          >
            {user?.nombre?.charAt(0) || 'U'}
          </Avatar>
        </IconButton>
        <Typography variant="body2">Perfil</Typography>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <StyledAppBar position="sticky">
        <Toolbar sx={{ position: 'relative', overflow: 'hidden' }}>
          {showMenuButton && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2, zIndex: 1 }}
              onClick={onMenuClick}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ 
              display: { xs: 'none', sm: 'block' },
              fontWeight: 'bold',
              zIndex: 1
            }}
          >
            Sistema de Gestión Escolar
          </Typography>
          
          <SearchBox>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Buscar…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </SearchBox>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', zIndex: 1 }}>
            {/* Notificaciones */}
            <Tooltip title="Notificaciones">
              <IconButton
                size="large"
                color="inherit"
                sx={{ mr: 1 }}
              >
                <Badge badgeContent={4} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            
            {/* Avatar de usuario */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Tooltip title="Perfil y configuración">
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="cuenta de usuario"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <Avatar 
                    sx={{ 
                      bgcolor: theme.palette.primary.main,
                      color: 'white',
                      width: 40,
                      height: 40,
                      boxShadow: '0px 2px 8px rgba(233, 81, 29, 0.3)',
                      border: '2px solid rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    {user?.nombre?.charAt(0) || 'U'}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Box sx={{ ml: 1, display: { xs: 'none', md: 'block' } }}>
                <Typography variant="body2" sx={{ color: 'white', fontWeight: 'medium' }}>
                  {user?.nombre || 'Usuario'}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  {getRoleName(user?.role) || 'Invitado'}
                </Typography>
              </Box>
            </Box>
          </Box>
          
          <Box sx={{ display: { xs: 'flex', md: 'none' }, zIndex: 1 }}>
            <IconButton
              size="large"
              aria-label="mostrar más"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
          
          {/* Elemento decorativo */}
          <HeaderDecoration />
        </Toolbar>
      </StyledAppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
};

export default Header;