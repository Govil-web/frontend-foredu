// src/pages/auth/Login.tsx
import React, { useEffect } from 'react';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Logo from '../../components/design-system/Logo/Logo';
import { useAuth } from '../../hooks/useAuth';
import { loginSchema, LoginFormValues } from '../../validations/authValidations';
import { debugService } from '../../services/debugService';

const Login: React.FC = () => {
  const { login, error, loading, isAuthenticated, user, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Obtener la ruta de origen si existe
  const from = (location.state as any)?.from?.pathname || '/';
  
  // Efecto para redirección automática si ya está autenticado
  useEffect(() => {
    if (isAuthenticated && user) {
      debugService.log('Usuario autenticado, redirigiendo a la ruta apropiada', user);
      
      // Determinar la ruta de destino según el rol
      let targetRoute = '/';
      switch (user.role) {
        case 'ROLE_ADMINISTRADOR':
          targetRoute = '/admin/dashboard';
          break;
        case 'ROLE_PROFESOR':
          targetRoute = '/teacher/dashboard';
          break;
        case 'ROLE_ESTUDIANTE':
          targetRoute = '/student/dashboard';
          break;
        case 'ROLE_TUTOR':
          targetRoute = '/tutor/dashboard';
          break;
      }
      
      debugService.log('Redirigiendo a:', targetRoute);
      
      // Añadir un pequeño retraso para asegurar que la redirección ocurra después de que el componente se monte completamente
      setTimeout(() => {
        navigate(targetRoute, { replace: true });
      }, 100);
    }
  }, [isAuthenticated, user, navigate]);
  
  // Limpiar errores al desmontar o cuando cambia la ruta
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);
  
  const { 
    control, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    }
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      debugService.log('Intentando iniciar sesión con:', data.email);
      await login(data.email, data.password);
      // La redirección se maneja en el useEffect
    } catch (error) {
      // El error ya se maneja en el contexto de autenticación
      debugService.error('Error de inicio de sesión:', error);
    }
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
          <Logo variant="horizontal" size="large" />
        </Box>
        
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Iniciar sesión
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ width: '100%' }}>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Correo electrónico"
                autoComplete="email"
                autoFocus
                error={!!errors.email}
                helperText={errors.email?.message}
                {...field}
              />
            )}
          />
          
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                margin="normal"
                required
                fullWidth
                label="Contraseña"
                type="password"
                id="password"
                autoComplete="current-password"
                error={!!errors.password}
                helperText={errors.password?.message}
                {...field}
              />
            )}
          />
          
          <Controller
            name="rememberMe"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox 
                    color="primary" 
                    checked={field.value} 
                    onChange={(e) => field.onChange(e.target.checked)} 
                  />
                }
                label="Recordarme"
              />
            )}
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