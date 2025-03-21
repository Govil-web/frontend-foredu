// src/components/debug/AuthDebugger.tsx
import React from 'react';
import { Box, Typography, Paper, Divider, Chip, Switch, FormControlLabel } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import { tokenService } from '../../services/tokenService';
import { debugService } from '../../services/debugService';

/**
 * Componente para depurar el estado de autenticación
 * Solo visible en entorno de desarrollo
 */
const AuthDebugger: React.FC = () => {
  // No renderizar nada en producción
  if (!import.meta.env.DEV) {
    return null;
  }

  const { user, isAuthenticated, loading } = useAuth();
  const token = tokenService.getToken();
  const tokenDecoded = token ? tokenService.decodeToken(token) : null;
  const [showDebugger, setShowDebugger] = React.useState(false);

  // Habilitar el debugger del localStorage
  const [debugEnabled, setDebugEnabled] = React.useState(
    localStorage.getItem('debug_mode') === 'true'
  );

  const handleDebugToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const enabled = event.target.checked;
    setDebugEnabled(enabled);
    debugService.enable(enabled);
  };

  if (!showDebugger) {
    return (
      <Box 
        sx={{ 
          position: 'fixed', 
          bottom: 10, 
          right: 10, 
          zIndex: 9999,
          opacity: 0.7,
          '&:hover': {
            opacity: 1
          }
        }}
      >
        <Chip 
          label="Auth Debug" 
          color="primary" 
          onClick={() => setShowDebugger(true)}
          size="small"
        />
      </Box>
    );
  }

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        position: 'fixed', 
        bottom: 20, 
        right: 20, 
        width: 400, 
        maxWidth: '90vw',
        p: 2,
        zIndex: 9999,
        maxHeight: '80vh',
        overflow: 'auto',
        opacity: 0.9,
        '&:hover': {
          opacity: 1
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Auth Debugger</Typography>
        <Chip 
          label="Cerrar" 
          color="secondary" 
          onClick={() => setShowDebugger(false)}
          size="small"
        />
      </Box>

      <FormControlLabel 
        control={
          <Switch 
            checked={debugEnabled} 
            onChange={handleDebugToggle} 
            color="primary"
          />
        } 
        label="Habilitar logs de depuración" 
      />

      <Divider sx={{ my: 2 }} />
      
      <Typography variant="subtitle1" gutterBottom>Estado de Autenticación</Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2">
          <strong>Autenticado:</strong> {isAuthenticated ? 'Sí' : 'No'}
        </Typography>
        <Typography variant="body2">
          <strong>Cargando:</strong> {loading ? 'Sí' : 'No'}
        </Typography>
        <Typography variant="body2">
          <strong>Token presente:</strong> {token ? 'Sí' : 'No'}
        </Typography>
        <Typography variant="body2">
          <strong>Token expirado:</strong> {tokenService.isTokenExpired() ? 'Sí' : 'No'}
        </Typography>
      </Box>
      
      {user && (
        <>
          <Typography variant="subtitle1" gutterBottom>Usuario</Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>ID:</strong> {user.id}
            </Typography>
            <Typography variant="body2">
              <strong>Nombre:</strong> {user.nombre}
            </Typography>
            <Typography variant="body2">
              <strong>Email:</strong> {user.email}
            </Typography>
            <Typography variant="body2">
              <strong>Rol:</strong> {user.role}
            </Typography>
          </Box>
        </>
      )}
      
      {tokenDecoded && (
        <>
          <Typography variant="subtitle1" gutterBottom>Payload del Token</Typography>
          <Box 
            component="pre" 
            sx={{ 
              p: 1, 
              bgcolor: 'background.paper', 
              borderRadius: 1, 
              fontSize: '0.75rem',
              maxWidth: '100%',
              overflow: 'auto'
            }}
          >
            {JSON.stringify(tokenDecoded, null, 2)}
          </Box>
        </>
      )}
    </Paper>
  );
};

export default AuthDebugger;