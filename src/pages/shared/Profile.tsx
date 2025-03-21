// src/pages/shared/Profile.tsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Avatar,
  Divider,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Tabs,
  Tab,
  Alert,
  Snackbar,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useTheme,
  Chip,
  Badge,
  styled,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  PhotoCamera as PhotoCameraIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationOnIcon,
  School as SchoolIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Lock as LockIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Computer as ComputerIcon,
  ArrowForwardIos as ArrowForwardIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types/auth';

// Componente para las formas decorativas
const DecorativeShape = styled(Box)(({ theme }) => ({
  position: 'absolute',
  borderRadius: '50%',
  opacity: 0.8,
  zIndex: 0,
}));

const SectionHeading = styled(Typography)(({ theme }) => ({
  position: 'relative',
  display: 'inline-block',
  marginBottom: theme.spacing(3),
  fontWeight: 'bold',
  color: theme.palette.secondary.main,
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-8px',
    left: '0',
    width: '40px',
    height: '4px',
    backgroundColor: theme.palette.primary.main,
    borderRadius: '2px',
  },
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const StyledTabList = styled(Tabs)(({ theme }) => ({
  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.primary.main,
    height: '3px',
    borderRadius: '3px',
  },
  '& .MuiTab-root': {
    textTransform: 'none',
    minWidth: 'auto',
    fontWeight: 500,
    padding: '12px 16px',
    transition: 'all 0.2s ease',
    '&.Mui-selected': {
      color: theme.palette.primary.main,
      fontWeight: 700,
    },
    '&:hover': {
      backgroundColor: theme.palette.sidebar.light,
    },
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
  overflow: 'hidden',
  position: 'relative',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
  },
}));

const InfoItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(1.5, 2),
  borderRadius: '12px',
  transition: 'transform 0.2s ease',
  '&:hover': {
    transform: 'translateX(5px)',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
      borderWidth: '2px',
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: theme.palette.primary.main,
  },
}));

const Profile: React.FC = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  
  // Estado para la información personal
  const [personalInfo, setPersonalInfo] = useState({
    nombre: user?.nombre || '',
    apellido: 'Apellido de Usuario',
    email: user?.email || '',
    phone: '(123) 456-7890',
    address: 'Calle Principal #123, Ciudad',
    bio: 'Breve descripción profesional o personal del usuario.',
  });
  
  // Estado para la información de seguridad
  const [securityInfo, setSecurityInfo] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  // Información de rol y permisos
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
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
  };
  
  const handleToggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalInfo({
      ...personalInfo,
      [name]: value,
    });
  };
  
  const handleSecurityInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSecurityInfo({
      ...securityInfo,
      [name]: value,
    });
  };
  
  const handleSavePersonalInfo = () => {
    // Aquí iría la lógica para guardar la información personal
    console.log('Guardando información personal:', personalInfo);
    setIsEditing(false);
    setSnackbarOpen(true);
  };
  
  const handleSavePassword = () => {
    // Aquí iría la lógica para guardar la nueva contraseña
    console.log('Guardando nueva contraseña:', securityInfo);
    setSecurityInfo({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setSnackbarOpen(true);
  };
  
  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Box>
      <SectionHeading variant="h4">
        Mi Perfil
      </SectionHeading>

      <Grid container spacing={3}>
        {/* Tarjeta de perfil */}
        <Grid item xs={12} md={4}>
          <StyledCard>
            <Box sx={{ 
              p: 3, 
              textAlign: 'center', 
              background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <Avatar
                  src="/static/images/avatar/1.jpg"
                  alt={personalInfo.nombre}
                  sx={{ 
                    width: 120, 
                    height: 120, 
                    mx: 'auto', 
                    mb: 2,
                    bgcolor: theme.palette.primary.main,
                    boxShadow: '0px 5px 15px rgba(233, 81, 29, 0.3)',
                    border: '4px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  {personalInfo.nombre.charAt(0)}
                </Avatar>
                <IconButton
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    backgroundColor: theme.palette.primary.main,
                    color: 'white',
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark,
                    },
                    width: 36,
                    height: 36,
                    boxShadow: '0 3px 10px rgba(0, 0, 0, 0.2)',
                  }}
                  size="small"
                >
                  <PhotoCameraIcon fontSize="small" />
                </IconButton>
              </Box>
              
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                {personalInfo.nombre} {personalInfo.apellido}
              </Typography>
              
              <Chip
                label={getRoleName(user?.role)}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: 'medium',
                  mb: 2,
                }}
              />

              {/* Elementos decorativos */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '-50px',
                  right: '-50px',
                  width: '150px',
                  height: '150px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: '-30px',
                  left: '-30px',
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.05)',
                }}
              />
            </Box>
            
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" color="secondary.main" sx={{ mb: 2 }}>
                Información de Contacto
              </Typography>
              
              <InfoItem>
                <EmailIcon color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Correo Electrónico
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {personalInfo.email}
                  </Typography>
                </Box>
              </InfoItem>
              
              <InfoItem>
                <PhoneIcon color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Teléfono
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {personalInfo.phone}
                  </Typography>
                </Box>
              </InfoItem>
              
              <InfoItem>
                <LocationOnIcon color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Dirección
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {personalInfo.address}
                  </Typography>
                </Box>
              </InfoItem>
              
              <InfoItem>
                <SchoolIcon color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Rol
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {getRoleName(user?.role)}
                  </Typography>
                </Box>
              </InfoItem>
            </CardContent>
          </StyledCard>
          
          {/* Actividad Reciente */}
          <StyledCard sx={{ mt: 3 }}>
            <CardHeader 
              title="Actividad Reciente" 
              titleTypographyProps={{ 
                variant: 'subtitle1', 
                fontWeight: 'bold',
                color: 'secondary.main'
              }}
            />
            <Divider />
            <CardContent sx={{ p: 0 }}>
              <List>
                <ListItem sx={{ py: 2, px: 3 }}>
                  <ListItemText 
                    primary="Actualizó su perfil"
                    secondary="Hace 2 días"
                    primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
                <Divider />
                <ListItem sx={{ py: 2, px: 3 }}>
                  <ListItemText 
                    primary="Inició sesión desde un nuevo dispositivo"
                    secondary="Hace 5 días"
                    primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
              </List>
            </CardContent>
          </StyledCard>
        </Grid>
        
        {/* Pestañas de información */}
        <Grid item xs={12} md={8}>
          <StyledCard sx={{ overflow: 'visible' }}>
            <Box sx={{ 
              borderBottom: 1, 
              borderColor: 'divider', 
              px: 2,
              position: 'relative'
            }}>
              <StyledTabList
                value={tabValue}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                aria-label="perfil tabs"
              >
                <Tab icon={<EditIcon />} label="Información Personal" iconPosition="start" />
                <Tab icon={<LockIcon />} label="Seguridad" iconPosition="start" />
                <Tab icon={<NotificationsIcon />} label="Notificaciones" iconPosition="start" />
                <Tab icon={<SettingsIcon />} label="Preferencias" iconPosition="start" />
              </StyledTabList>
            </Box>
            
            {/* Tab: Información Personal */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" color="secondary.main">
                  Editar Información Personal
                </Typography>
                <Button
                  variant="contained"
                  startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
                  onClick={isEditing ? handleSavePersonalInfo : handleToggleEdit}
                  color={isEditing ? "primary" : "secondary"}
                >
                  {isEditing ? 'Guardar Cambios' : 'Editar Perfil'}
                </Button>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    fullWidth
                    label="Nombre"
                    name="nombre"
                    value={personalInfo.nombre}
                    onChange={handlePersonalInfoChange}
                    disabled={!isEditing}
                    variant="outlined"
                    InputProps={{
                      sx: { 
                        bgcolor: !isEditing ? 'background.default' : 'transparent'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    fullWidth
                    label="Apellido"
                    name="apellido"
                    value={personalInfo.apellido}
                    onChange={handlePersonalInfoChange}
                    disabled={!isEditing}
                    variant="outlined"
                    InputProps={{
                      sx: { 
                        bgcolor: !isEditing ? 'background.default' : 'transparent'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    fullWidth
                    label="Correo Electrónico"
                    name="email"
                    type="email"
                    value={personalInfo.email}
                    onChange={handlePersonalInfoChange}
                    disabled={!isEditing}
                    variant="outlined"
                    InputProps={{
                      sx: { 
                        bgcolor: !isEditing ? 'background.default' : 'transparent'
                      },
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    fullWidth
                    label="Teléfono"
                    name="phone"
                    value={personalInfo.phone}
                    onChange={handlePersonalInfoChange}
                    disabled={!isEditing}
                    variant="outlined"
                    InputProps={{
                      sx: { 
                        bgcolor: !isEditing ? 'background.default' : 'transparent'
                      },
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <StyledTextField
                    fullWidth
                    label="Dirección"
                    name="address"
                    value={personalInfo.address}
                    onChange={handlePersonalInfoChange}
                    disabled={!isEditing}
                    variant="outlined"
                    InputProps={{
                      sx: { 
                        bgcolor: !isEditing ? 'background.default' : 'transparent'
                      },
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOnIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <StyledTextField
                    fullWidth
                    label="Biografía"
                    name="bio"
                    value={personalInfo.bio}
                    onChange={handlePersonalInfoChange}
                    disabled={!isEditing}
                    multiline
                    rows={4}
                    variant="outlined"
                    InputProps={{
                      sx: { 
                        bgcolor: !isEditing ? 'background.default' : 'transparent'
                      }
                    }}
                  />
                </Grid>
              </Grid>

              {/* Mensaje de ayuda */}
              {isEditing && (
                <Alert 
                  severity="info" 
                  sx={{ 
                    mt: 3,
                    borderRadius: '12px',
                    '& .MuiAlert-icon': {
                      alignItems: 'center'
                    }
                  }}
                >
                  Complete todos los campos y haga clic en "Guardar Cambios" para actualizar su perfil.
                </Alert>
              )}
            </TabPanel>
            
            {/* Tab: Seguridad */}
            <TabPanel value={tabValue} index={1}>
              <StyledCard sx={{ boxShadow: 'none', mb: 3 }}>
                <CardHeader 
                  title="Cambiar Contraseña" 
                  titleTypographyProps={{ 
                    variant: 'h6', 
                    color: 'secondary.main',
                    fontWeight: 'bold'
                  }}
                  avatar={
                    <Avatar
                      sx={{
                        bgcolor: `${theme.palette.primary.main}20`,
                        color: theme.palette.primary.main,
                      }}
                    >
                      <LockIcon />
                    </Avatar>
                  }
                />
                <Divider />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <StyledTextField
                        fullWidth
                        label="Contraseña Actual"
                        name="currentPassword"
                        type={showPassword ? 'text' : 'password'}
                        value={securityInfo.currentPassword}
                        onChange={handleSecurityInfoChange}
                        variant="outlined"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleToggleShowPassword}
                                edge="end"
                              >
                                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        fullWidth
                        label="Nueva Contraseña"
                        name="newPassword"
                        type={showPassword ? 'text' : 'password'}
                        value={securityInfo.newPassword}
                        onChange={handleSecurityInfoChange}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        fullWidth
                        label="Confirmar Nueva Contraseña"
                        name="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        value={securityInfo.confirmPassword}
                        onChange={handleSecurityInfoChange}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button
                          variant="contained"
                          startIcon={<SaveIcon />}
                          onClick={handleSavePassword}
                          color="primary"
                        >
                          Actualizar Contraseña
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </StyledCard>
              
              <StyledCard sx={{ boxShadow: 'none' }}>
                <CardHeader 
                  title="Sesiones Activas" 
                  titleTypographyProps={{ 
                    variant: 'h6', 
                    color: 'secondary.main',
                    fontWeight: 'bold'
                  }}
                  avatar={
                    <Avatar
                      sx={{
                        bgcolor: `${theme.palette.secondary.main}20`,
                        color: theme.palette.secondary.main,
                      }}
                    >
                      <ComputerIcon />
                    </Avatar>
                  }
                />
                <Divider />
                <CardContent sx={{ p: 0 }}>
                  <List>
                    <ListItem 
                      sx={{ 
                        py: 2, 
                        px: 3,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: theme.palette.sidebar.light,
                        }
                      }}
                    >
                      <ListItemText 
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography fontWeight="medium">Chrome en Windows 10</Typography>
                            <Chip 
                              label="Activa ahora" 
                              size="small" 
                              color="success" 
                              sx={{ ml: 1, height: '20px' }}
                            />
                          </Box>
                        }
                        secondary="Última actividad: Justo ahora"
                      />
                      <Button 
                        color="error" 
                        size="small"
                        variant="outlined"
                        sx={{ borderRadius: '20px' }}
                      >
                        Cerrar
                      </Button>
                    </ListItem>
                    <Divider />
                    <ListItem 
                      sx={{ 
                        py: 2, 
                        px: 3,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: theme.palette.sidebar.light,
                        } 
                      }}
                    >
                      <ListItemText 
                        primary="Firefox en Android"
                        secondary="Última actividad: Hace 2 días"
                        primaryTypographyProps={{ fontWeight: 'medium' }}
                      />
                      <Button 
                        color="error" 
                        size="small"
                        variant="outlined"
                        sx={{ borderRadius: '20px' }}
                      >
                        Cerrar
                      </Button>
                    </ListItem>
                  </List>
                </CardContent>
              </StyledCard>
            </TabPanel>
            
            {/* Tab: Notificaciones */}
            <TabPanel value={tabValue} index={2}>
              <Typography variant="h6" fontWeight="bold" color="secondary.main" gutterBottom>
                Configuración de Notificaciones
              </Typography>
              
              <Typography variant="body1" color="text.secondary" paragraph>
                Configure las notificaciones que desea recibir en su cuenta.
              </Typography>
              
              <StyledCard sx={{ mb: 3, boxShadow: 'none' }}>
                <CardHeader 
                  title="Notificaciones por Correo Electrónico" 
                  titleTypographyProps={{ 
                    variant: 'subtitle1', 
                    fontWeight: 'bold',
                    color: 'secondary.main'
                  }}
                  avatar={
                    <Avatar
                      sx={{
                        bgcolor: `${theme.palette.primary.main}20`,
                        color: theme.palette.primary.main,
                      }}
                    >
                      <EmailIcon />
                    </Avatar>
                  }
                  action={
                    <Button
                      endIcon={<ArrowForwardIcon fontSize="small" />}
                      size="small"
                    >
                      Ver todos
                    </Button>
                  }
                />
                <Divider />
                <CardContent>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Las notificaciones se enviarán a: <strong>{personalInfo.email}</strong>
                  </Typography>
                  
                  {/* Opciones de notificaciones por correo */}
                </CardContent>
              </StyledCard>
              
              <StyledCard sx={{ boxShadow: 'none' }}>
                <CardHeader 
                  title="Notificaciones en la Aplicación" 
                  titleTypographyProps={{ 
                    variant: 'subtitle1', 
                    fontWeight: 'bold',
                    color: 'secondary.main'
                  }}
                  avatar={
                    <Badge badgeContent={3} color="error">
                      <Avatar
                        sx={{
                          bgcolor: `${theme.palette.secondary.main}20`,
                          color: theme.palette.secondary.main,
                        }}
                      >
                        <NotificationsIcon />
                      </Avatar>
                    </Badge>
                  }
                  action={
                    <Button
                      endIcon={<ArrowForwardIcon fontSize="small" />}
                      size="small"
                    >
                      Ver todos
                    </Button>
                  }
                />
                <Divider />
                <CardContent>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Estas notificaciones aparecerán dentro de la aplicación.
                  </Typography>
                  
                  {/* Opciones de notificaciones en la app */}
                </CardContent>
              </StyledCard>
            </TabPanel>
            
            {/* Tab: Preferencias */}
            <TabPanel value={tabValue} index={3}>
              <Typography variant="h6" fontWeight="bold" color="secondary.main" gutterBottom>
                Preferencias de Usuario
              </Typography>
              
              <Typography variant="body1" color="text.secondary" paragraph>
                Configure sus preferencias de uso de la aplicación para una experiencia personalizada.
              </Typography>
              
              <StyledCard sx={{ boxShadow: 'none' }}>
                <CardHeader 
                  title="Preferencias de Visualización" 
                  titleTypographyProps={{ 
                    variant: 'subtitle1', 
                    fontWeight: 'bold',
                    color: 'secondary.main'
                  }}
                  avatar={
                    <Avatar
                      sx={{
                        bgcolor: `${theme.palette.primary.main}20`,
                        color: theme.palette.primary.main,
                      }}
                    >
                      <SettingsIcon />
                    </Avatar>
                  }
                />
                <Divider />
                <CardContent>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Personalice cómo desea ver la información en la aplicación.
                  </Typography>
                  
                  {/* Opciones de preferencias */}
                </CardContent>
              </StyledCard>
            </TabPanel>
          </StyledCard>
        </Grid>
      </Grid>
      
      {/* Snackbar para mensaje de éxito */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="success" 
          sx={{ 
            width: '100%',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}
        >
          Información actualizada exitosamente
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;