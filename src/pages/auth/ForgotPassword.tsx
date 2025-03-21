// src/pages/auth/ForgotPassword.tsx
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
import LockResetIcon from '@mui/icons-material/LockReset';
import Logo from '../../components/design-system/Logo/Logo';

// Esquema de validación
const forgotPasswordSchema = z.object({
  email: z.string().email('Por favor, ingrese un email válido'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  const { 
    control, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    }
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulación de envío de correo
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Solicitud de recuperación para:', data.email);
      setSuccess(true);
    } catch (err) {
      setError('Ha ocurrido un error al procesar su solicitud. Por favor, inténtelo de nuevo.');
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
          <LockResetIcon />
        </Avatar>
        
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Recuperar contraseña
        </Typography>
        
        {success ? (
          <>
            <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
              Se ha enviado un correo electrónico con instrucciones para recuperar su contraseña.
            </Alert>
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={() => navigate('/login')}
            >
              Volver al inicio de sesión
            </Button>
          </>
        ) : (
          <>
            <Typography variant="body2" align="center" paragraph>
              Ingrese su correo electrónico y le enviaremos instrucciones para restablecer su contraseña.
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
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Enviar instrucciones'}
              </Button>
              
              <Grid container justifyContent="center">
                <Grid item>
                  <Link component={RouterLink} to="/login" variant="body2">
                    Volver al inicio de sesión
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default ForgotPassword;