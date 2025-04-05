// src/routes/AppRoutes.tsx
import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { UserRole } from '../types/auth';
import { useAuth } from '../hooks/useAuth';

// Importar las funciones que devuelven elementos de ruta
import { getAdminRoutes } from './adminRoutes';
import { getTeacherRoutes } from './teacherRoutes';
import { getStudentRoutes } from './studentRoutes';
import { getTutorRoutes } from './tutorRoutes';
import { getSharedRoutes } from './sharedRoutes';

// Páginas públicas
import Landing from '../pages/Landing/Landing';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import Unauthorized from '../pages/auth/Unauthorized';

/**
 * Componente principal de rutas que organiza todas las rutas de la aplicación
 * y gestiona la redirección basada en la autenticación y rol del usuario
 */
const AppRoutes: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  // Redirigir basado en el rol del usuario cuando está autenticado
  useEffect(() => {
    if (isAuthenticated && user) {
      const pathSegments = window.location.pathname.split('/');
      // Si el usuario está en la página de inicio o login, redirigir a su dashboard
      if (pathSegments.length <= 1 || pathSegments[1] === 'login') {
        switch (user.role) {
          case UserRole.ADMIN:
            navigate('/admin/dashboard', { replace: true });
            break;
          case UserRole.PROFESOR:
            navigate('/teacher/dashboard', { replace: true });
            break;
          case UserRole.ESTUDIANTE:
            navigate('/student/dashboard', { replace: true });
            break;
          case UserRole.TUTOR:
            navigate('/tutor/dashboard', { replace: true });
            break;
        }
      }
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Rutas específicas por rol */}
      {getAdminRoutes()}
      {getTeacherRoutes()}
      {getStudentRoutes()}
      {getTutorRoutes()}
      
      {/* Rutas compartidas */}
      {getSharedRoutes()}

      {/* Ruta 404 */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;