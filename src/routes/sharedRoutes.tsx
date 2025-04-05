// src/routes/sharedRoutes.tsx
import React from 'react';
import { Route } from 'react-router-dom';
import { UserRole } from '../types/auth';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../components/layout/MainLayout/MainLayout';

// Páginas compartidas
import Profile from '../pages/shared/Profile';

/**
 * Rutas compartidas entre todos los roles
 * Este componente define las rutas accesibles para cualquier usuario autenticado
 */
const SharedRoutes: React.FC = () => {
  // Este componente no debe usarse directamente en <Routes>
  // En su lugar, usamos getSharedRoutes para obtener el elemento de ruta
  return null;
};

/**
 * Función que retorna el elemento de ruta compartida
 * @returns Elemento JSX con las rutas compartidas
 */
export const getSharedRoutes = () => (
  <Route path="/profile" element={
    <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.PROFESOR, UserRole.ESTUDIANTE, UserRole.TUTOR]}>
      <MainLayout>
        <Profile />
      </MainLayout>
    </ProtectedRoute>
  } />
);

export default SharedRoutes;