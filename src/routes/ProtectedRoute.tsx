// src/routes/ProtectedRoute.tsx
import React, { useEffect, useState, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import { useAuthStore } from '../store/authStore';
import { UserRole } from '../types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

/**
 * Componente que protege rutas basado en autenticación y roles
 * Optimizado con React.memo para prevenir re-renders innecesarios
 */
const ProtectedRouteComponent: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles 
}) => {
  const { user, loading, isAuthenticated, checkAuth } = useAuthStore();
  const location = useLocation();
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const checkRef = useRef(false);

  useEffect(() => {
    // Solo ejecutar una vez o cuando cambie isAuthenticated
    const runAuthCheck = async () => {
      if (!checkRef.current && !isAuthenticated) {
        checkRef.current = true;
        await checkAuth();
        setInitialCheckDone(true);
      } else if (!initialCheckDone) {
        setInitialCheckDone(true);
      }
    };

    runAuthCheck();
  }, [checkAuth, isAuthenticated]);

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

const ProtectedRoute = React.memo(ProtectedRouteComponent);
export default ProtectedRoute;
