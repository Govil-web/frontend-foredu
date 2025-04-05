// src/routes/tutorRoutes.tsx
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { UserRole } from '../types/auth';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../components/layout/MainLayout/MainLayout';

// Páginas de tutor
import TutorDashboard from '../pages/tutor/Dashboard';
import StudentProgress from '../pages/tutor/StudentProgress';

/**
 * Rutas para el rol de tutor
 * Este componente define las rutas disponibles para el rol de tutor
 */
const TutorRoutes: React.FC = () => {
  // Este componente no debe usarse directamente en <Routes>
  // En su lugar, usamos getTutorRoutes para obtener el elemento de ruta
  return null;
};

/**
 * Función que retorna el elemento de ruta para el tutor
 * @returns Elemento JSX con las rutas de tutor
 */
export const getTutorRoutes = () => (
  <Route path="/tutor/*" element={
    <ProtectedRoute allowedRoles={[UserRole.TUTOR]}>
      <MainLayout>
        <Routes>
          <Route path="dashboard" element={<TutorDashboard />} />
          <Route path="progress" element={<StudentProgress />} />
          <Route path="*" element={<Navigate to="/tutor/dashboard" replace />} />
        </Routes>
      </MainLayout>
    </ProtectedRoute>
  } />
);

export default TutorRoutes;