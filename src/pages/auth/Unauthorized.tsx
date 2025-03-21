// src/pages/Unauthorized.tsx
import React from 'react';
import { Box, Typography, Button, Paper, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom color="error">
          Acceso No Autorizado
        </Typography>
        
        <Typography variant="body1" paragraph sx={{ mb: 4 }}>
          No tienes permisos para acceder a esta página. Si crees que esto es un error, por favor contacta al administrador del sistema.
        </Typography>
        
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/')}
        >
          Volver al Inicio
        </Button>
      </Paper>
    </Container>
  );
};

export default Unauthorized;