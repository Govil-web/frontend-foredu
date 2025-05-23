// src/routes/ProtectedRoute.tsx
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import { useAuthStore } from '../store/authStore';
import { UserRole } from '../types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles 
}) => {
  const { user, loading, isAuthenticated, checkAuth } = useAuthStore();
  const location = useLocation();
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  useEffect(() => {
    const initialCheck = async () => {
      await checkAuth();
      setInitialCheckDone(true);
    };
    
    if (!isAuthenticated && !initialCheckDone) {
      initialCheck();
    } else {
      setInitialCheckDone(true);
    }
  }, [checkAuth, isAuthenticated, initialCheckDone]);

  // Mostrar loading mientras se verifica la autenticación
  if (loading || !initialCheckDone) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  // Redirigir a login si no está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si hay roles permitidos y el usuario no tiene uno de ellos
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Si está autenticado y tiene permisos, mostrar el contenido
  return <>{children}</>;
};

export default ProtectedRoute;