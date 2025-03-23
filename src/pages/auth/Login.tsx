// src/pages/auth/Login.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Avatar, 
  Typography, 
  TextField,
  Button, 
  Grid, 
  Link, 
  Paper, 
  FormControlLabel, 
  Checkbox, 
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Logo from '../../assets/foredulogo.png';
import { useAuthStore } from '../../store/authStore';
import { UserRole } from '../../types/auth';

const Login: React.FC = () => {
  const { login, error, loading, isAuthenticated, user, clearError } = useAuthStore();
  const navigate = useNavigate();
 // const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  
  // Obtener la ruta de origen si existe
  //const from = (location.state as any)?.from?.pathname || '/';
  
  // Efecto para redirección automática si ya está autenticado
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('Usuario autenticado, redirigiendo a la ruta apropiada', user);
      
      // Determinar la ruta de destino según el rol
      let targetRoute = '/';
      switch (user.role) {
        case UserRole.ADMIN:
          targetRoute = '/admin/dashboard';
          break;
        case UserRole.PROFESOR:
          targetRoute = '/teacher/dashboard';
          break;
        case UserRole.ESTUDIANTE:
          targetRoute = '/student/dashboard';
          break;
        case UserRole.TUTOR:
          targetRoute = '/tutor/dashboard';
          break;
      }
      
      console.log('Redirigiendo a:', targetRoute);
      navigate(targetRoute, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);
  
  // Limpiar errores al desmontar
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    
    if (!email || !password) {
      setLocalError('Por favor, complete todos los campos');
      return;
    }
    
    try {
      await login(email, password);
    } catch (error) {
      console.error('Error de inicio de sesión:', error);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper 
        elevation={3} 
        sx={{ 
          mt: 8, 
          p: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          borderRadius: 2,
        }}
      >
        <Box sx={{ mb: 4 }}>
          <img src={Logo} alt="Foredu Logo" style={{ width: '100%', maxWidth: '200px' }} />
        </Box>
        
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Iniciar sesión
        </Typography>
        
        {(error || localError) && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error || localError}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleLogin} noValidate sx={{ width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Correo electrónico"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!localError && !email}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type={showPassword ? "text" : "password"}
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!localError && !password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          
          <FormControlLabel
            control={
              <Checkbox 
                color="primary" 
                checked={rememberMe} 
                onChange={(e) => setRememberMe(e.target.checked)}
                name="rememberMe"
              />
            }
            label="Recordarme"
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Iniciar sesión'}
          </Button>
          
          <Grid container>
            <Grid item xs>
              <Link component={RouterLink} to="/forgot-password" variant="body2">
                ¿Olvidó su contraseña?
              </Link>
            </Grid>
            <Grid item>
              <Link component={RouterLink} to="/register" variant="body2">
                {"¿No tiene cuenta? Regístrese"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;