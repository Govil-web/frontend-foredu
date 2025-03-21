// src/pages/auth/Register.tsx
import React from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
  CircularProgress,
  Alert,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Logo from '../../components/design-system/Logo/Logo';

// Esquema de validación
const registerSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Por favor, ingrese un email válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  const { 
    control, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    }
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulación de registro
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Datos de registro:', data);
      navigate('/login');
    } catch (err) {
      setError('Ha ocurrido un error durante el registro. Por favor, inténtelo de nuevo.');
    } finally {
      setLoading(false);
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
        <Box sx={{ mb: 3 }}>
          <Logo variant="horizontal" size="large" />
        </Box>
        
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <PersonAddIcon />
        </Avatar>
        
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Registrarse
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ width: '100%' }}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Nombre completo"
                autoComplete="name"
                autoFocus
                error={!!errors.name}
                helperText={errors.name?.message}
                {...field}
              />
            )}
          />
          
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
                autoComplete="new-password"
                error={!!errors.password}
                helperText={errors.password?.message}
                {...field}
              />
            )}
          />
          
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <TextField
                margin="normal"
                required
                fullWidth
                label="Confirmar contraseña"
                type="password"
                id="confirmPassword"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                {...field}
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
            {loading ? <CircularProgress size={24} /> : 'Registrarse'}
          </Button>
          
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link component={RouterLink} to="/login" variant="body2">
                ¿Ya tiene una cuenta? Iniciar sesión
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;