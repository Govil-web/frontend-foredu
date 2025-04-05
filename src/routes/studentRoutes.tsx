// src/routes/studentRoutes.tsx
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { UserRole } from '../types/auth';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../components/layout/MainLayout/MainLayout';

// Páginas de estudiante
import StudentDashboard from '../pages/student/Dashboard';
import StudentGrades from '../pages/student/Grades';

/**
 * Rutas para el rol de estudiante
 * Este componente define las rutas disponibles para el rol de estudiante
 */
const StudentRoutes: React.FC = () => {
  // Este componente no debe usarse directamente en <Routes>
  // En su lugar, usamos getStudentRoutes para obtener el elemento de ruta
  return null;
};

/**
 * Función que retorna el elemento de ruta para el estudiante
 * @returns Elemento JSX con las rutas de estudiante
 */
export const getStudentRoutes = () => (
  <Route path="/student/*" element={
    <ProtectedRoute allowedRoles={[UserRole.ESTUDIANTE]}>
      <MainLayout>
        <Routes>
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="grades" element={<StudentGrades />} />
          <Route path="*" element={<Navigate to="/student/dashboard" replace />} />
        </Routes>
      </MainLayout>
    </ProtectedRoute>
  } />
);

export default StudentRoutes;