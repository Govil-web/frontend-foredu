// src/pages/auth/Login.tsx
import React, { useEffect } from 'react';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Avatar, 
  Typography, 
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
import StyledTextField from '../../components/ui/StyledTextField';
import { useAuth } from '../../hooks/useAuth';
import { useFormState } from '../../hooks/useFormState';
import { z } from 'zod';

// Esquema de validación
const loginSchema = z.object({
  email: z.string().email('Por favor, ingrese un email válido'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const validateLogin = (values: LoginFormValues) => {
  try {
    loginSchema.parse(values);
    return {};
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors.reduce((acc, curr) => {
        const path = curr.path[0] as keyof LoginFormValues;
        acc[path] = curr.message;
        return acc;
      }, {} as Partial<Record<keyof LoginFormValues, string>>);
    }
    return {};
  }
};

const Login: React.FC = () => {
  const { login, error, loading, isAuthenticated, user, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Obtener la ruta de origen si existe
  const from = (location.state as any)?.from?.pathname || '/';
  
  // Efecto para redirección automática si ya está autenticado
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('Usuario autenticado, redirigiendo a la ruta apropiada', user);
      
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
      
      console.log('Redirigiendo a:', targetRoute);
      
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
    values, 
    errors, 
    handleChange, 
    handleSubmit 
  } = useFormState<LoginFormValues>({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    validate: validateLogin,
    onSubmit: async (data) => {
      try {
        console.log('Intentando iniciar sesión con:', data.email);
        await login(data.email, data.password);
      } catch (error) {
        console.error('Error de inicio de sesión:', error);
      }
    }
  });

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
        
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
          <StyledTextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Correo electrónico"
            name="email"
            autoComplete="email"
            autoFocus
            value={values.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
          />
          
          <StyledTextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type="password"
            id="password"
            autoComplete="current-password"
            value={values.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
          />
          
          <FormControlLabel
            control={
              <Checkbox 
                color="primary" 
                checked={values.rememberMe} 
                onChange={handleChange}
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