// src/routes/AppRoutes.tsx
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import { useRedirection } from '../hooks/useRedirection';

// Importar las funciones que devuelven elementos de ruta
import { getAdminRoutes } from './adminRoutes';
import { getTeacherRoutes } from './teacherRoutes';
import { getStudentRoutes } from './studentRoutes';
import { getTutorRoutes } from './tutorRoutes';
import { getSharedRoutes } from './sharedRoutes';

// Lazy loading de páginas públicas
const Landing = lazy(() => import('../pages/Landing/Landing'));
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'));
const Unauthorized = lazy(() => import('../pages/auth/Unauthorized'));

/**
 * Componente principal de rutas que organiza todas las rutas de la aplicación
 * La redirección basada en autenticación y rol se maneja a través del hook useRedirection
 */
const AppRoutes: React.FC = () => {
  // Usar el hook de redirección para manejar la navegación automática
  useRedirection();

  return (
    <Suspense fallback={
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    }>
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
    </Suspense>
  );
};

export default AppRoutes;
