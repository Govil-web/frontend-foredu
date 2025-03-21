// src/pages/admin/Settings.tsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Divider,
  Switch,
  FormControlLabel,
  FormGroup,
  Card,
  CardContent,
  CardHeader,
  Alert,
  Snackbar,
  InputAdornment,
  IconButton,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Save as SaveIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Language as LanguageIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Storage as StorageIcon,
  Backup as BackupIcon,
} from '@mui/icons-material';

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
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
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

const AdminSettings: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  
  // Estado para configuraciones generales
  const [generalSettings, setGeneralSettings] = useState({
    schoolName: 'Instituto Educativo Nacional',
    address: 'Calle Principal #123, Ciudad',
    phone: '(123) 456-7890',
    email: 'contacto@instituto.edu',
    website: 'www.instituto.edu',
    language: 'es',
  });
  
  // Estado para configuraciones de notificaciones
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    attendanceAlerts: true,
    gradePostings: true,
    systemUpdates: true,
  });
  
  // Estado para configuraciones de seguridad
  const [securitySettings, setSecuritySettings] = useState({
    password: '********',
    twoFactorAuth: false,
    sessionTimeout: '30',
    allowMultiLogin: false,
    enforceStrongPasswords: true,
  });
  
  // Estado para configuraciones del sistema
  const [systemSettings, setSystemSettings] = useState({
    backupFrequency: 'daily',
    dataRetention: '12',
    debugMode: false,
    maintenanceMode: false,
  });
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const handleToggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>, 
    settingsType: 'general' | 'security' | 'system'
  ) => {
    const { name, value } = e.target;
    
    if (settingsType === 'general') {
      setGeneralSettings({
        ...generalSettings,
        [name]: value,
      });
    } else if (settingsType === 'security') {
      setSecuritySettings({
        ...securitySettings,
        [name]: value,
      });
    } else if (settingsType === 'system') {
      setSystemSettings({
        ...systemSettings,
        [name]: value,
      });
    }
  };
  
  const handleSwitchChange = (
    e: React.ChangeEvent<HTMLInputElement>, 
    settingsType: 'notification' | 'security' | 'system'
  ) => {
    const { name, checked } = e.target;
    
    if (settingsType === 'notification') {
      setNotificationSettings({
        ...notificationSettings,
        [name]: checked,
      });
    } else if (settingsType === 'security') {
      setSecuritySettings({
        ...securitySettings,
        [name]: checked,
      });
    } else if (settingsType === 'system') {
      setSystemSettings({
        ...systemSettings,
        [name]: checked,
      });
    }
  };
  
  const handleSaveSettings = () => {
    // Aquí iría la lógica para guardar las configuraciones
    console.log('Guardando configuraciones:', {
      generalSettings,
      notificationSettings,
      securitySettings,
      systemSettings,
    });
    
    // Mostrar mensaje de éxito
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
      <Typography variant="h4" gutterBottom>
        Configuración del Sistema
      </Typography>
      
      <Paper sx={{ width: '100%', mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="General" icon={<LanguageIcon />} iconPosition="start" />
          <Tab label="Notificaciones" icon={<NotificationsIcon />} iconPosition="start" />
          <Tab label="Seguridad" icon={<SecurityIcon />} iconPosition="start" />
          <Tab label="Sistema" icon={<StorageIcon />} iconPosition="start" />
        </Tabs>
        
        {/* Tab: Configuraciones Generales */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre de la Institución"
                name="schoolName"
                value={generalSettings.schoolName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, 'general')}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Dirección"
                name="address"
                value={generalSettings.address}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, 'general')}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Teléfono"
                name="phone"
                value={generalSettings.phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, 'general')}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Correo Electrónico"
                name="email"
                type="email"
                value={generalSettings.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, 'general')}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Sitio Web"
                name="website"
                value={generalSettings.website}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, 'general')}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Idioma"
                name="language"
                select
                SelectProps={{ native: true }}
                value={generalSettings.language}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, 'general')}
                margin="normal"
              >
                <option value="es">Español</option>
                <option value="en">Inglés</option>
                <option value="fr">Francés</option>
                <option value="pt">Portugués</option>
              </TextField>
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* Tab: Configuraciones de Notificaciones */}
        <TabPanel value={tabValue} index={1}>
          <Card>
            <CardHeader title="Preferencias de Notificaciones" />
            <CardContent>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onChange={(e) => handleSwitchChange(e, 'notification')}
                      name="emailNotifications"
                      color="primary"
                    />
                  }
                  label="Notificaciones por Correo Electrónico"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.smsNotifications}
                      onChange={(e) => handleSwitchChange(e, 'notification')}
                      name="smsNotifications"
                      color="primary"
                    />
                  }
                  label="Notificaciones por SMS"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.attendanceAlerts}
                      onChange={(e) => handleSwitchChange(e, 'notification')}
                      name="attendanceAlerts"
                      color="primary"
                    />
                  }
                  label="Alertas de Asistencia"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.gradePostings}
                      onChange={(e) => handleSwitchChange(e, 'notification')}
                      name="gradePostings"
                      color="primary"
                    />
                  }
                  label="Publicación de Calificaciones"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.systemUpdates}
                      onChange={(e) => handleSwitchChange(e, 'notification')}
                      name="systemUpdates"
                      color="primary"
                    />
                  }
                  label="Actualizaciones del Sistema"
                />
              </FormGroup>
            </CardContent>
          </Card>
        </TabPanel>
        
        {/* Tab: Configuraciones de Seguridad */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Contraseña Actual"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={securitySettings.password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, 'security')}
                margin="normal"
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
              <TextField
                fullWidth
                label="Tiempo de Sesión (minutos)"
                name="sessionTimeout"
                type="number"
                value={securitySettings.sessionTimeout}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, 'security')}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={securitySettings.twoFactorAuth}
                      onChange={(e) => handleSwitchChange(e, 'security')}
                      name="twoFactorAuth"
                      color="primary"
                    />
                  }
                  label="Autenticación de Dos Factores"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={securitySettings.allowMultiLogin}
                      onChange={(e) => handleSwitchChange(e, 'security')}
                      name="allowMultiLogin"
                      color="primary"
                    />
                  }
                  label="Permitir Múltiples Sesiones"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={securitySettings.enforceStrongPasswords}
                      onChange={(e) => handleSwitchChange(e, 'security')}
                      name="enforceStrongPasswords"
                      color="primary"
                    />
                  }
                  label="Exigir Contraseñas Fuertes"
                />
              </FormGroup>
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* Tab: Configuraciones del Sistema */}
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Frecuencia de Respaldo"
                name="backupFrequency"
                select
                SelectProps={{ native: true }}
                value={systemSettings.backupFrequency}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, 'system')}
                margin="normal"
              >
                <option value="hourly">Cada hora</option>
                <option value="daily">Diario</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensual</option>
              </TextField>
              <TextField
                fullWidth
                label="Retención de Datos (meses)"
                name="dataRetention"
                type="number"
                value={systemSettings.dataRetention}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, 'system')}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={systemSettings.debugMode}
                      onChange={(e) => handleSwitchChange(e, 'system')}
                      name="debugMode"
                      color="primary"
                    />
                  }
                  label="Modo de Depuración"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={systemSettings.maintenanceMode}
                      onChange={(e) => handleSwitchChange(e, 'system')}
                      name="maintenanceMode"
                      color="primary"
                    />
                  }
                  label="Modo de Mantenimiento"
                />
              </FormGroup>
              
              <Box sx={{ mt: 3 }}>
                <Button 
                  variant="outlined" 
                  startIcon={<BackupIcon />}
                  fullWidth
                >
                  Realizar Copia de Seguridad Ahora
                </Button>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>
        
        <Divider />
        
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant="contained" 
            startIcon={<SaveIcon />}
            onClick={handleSaveSettings}
          >
            Guardar Configuración
          </Button>
        </Box>
      </Paper>
      
      {/* Historial de Cambios */}
      <Typography variant="h5" gutterBottom>
        Historial de Cambios
      </Typography>
      
      <Paper>
        <List>
          <ListItem>
            <ListItemText 
              primary="Actualización de Información de Contacto" 
              secondary="Realizado por: Admin el 15/01/2023"
            />
            <ListItemSecondaryAction>
              <Button size="small" color="primary">Ver Detalles</Button>
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText 
              primary="Cambio de Configuración de Seguridad" 
              secondary="Realizado por: Admin el 05/01/2023"
            />
            <ListItemSecondaryAction>
              <Button size="small" color="primary">Ver Detalles</Button>
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText 
              primary="Configuración Inicial del Sistema" 
              secondary="Realizado por: Sistema el 01/01/2023"
            />
            <ListItemSecondaryAction>
              <Button size="small" color="primary">Ver Detalles</Button>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Paper>
      
      {/* Snackbar para mensaje de éxito */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Configuración guardada exitosamente
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminSettings;