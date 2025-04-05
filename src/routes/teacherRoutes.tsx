// src/routes/teacherRoutes.tsx
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { UserRole } from '../types/auth';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../components/layout/MainLayout/MainLayout';

// Páginas de profesor
import TeacherDashboard from '../pages/teacher/Dashboard';
import GradeManagement from '../pages/teacher/GradeManagement';
import AttendanceManagement from '../pages/teacher/AttendanceManagement';

/**
 * Rutas para el rol de profesor
 * Este componente define las rutas disponibles para el rol de profesor
 */
const TeacherRoutes: React.FC = () => {
  // Este componente no debe usarse directamente en <Routes>
  // En su lugar, usamos getTeacherRoutes para obtener el elemento de ruta
  return null;
};

/**
 * Función que retorna el elemento de ruta para el profesor
 * @returns Elemento JSX con las rutas de profesor
 */
export const getTeacherRoutes = () => (
  <Route path="/teacher/*" element={
    <ProtectedRoute allowedRoles={[UserRole.PROFESOR]}>
      <MainLayout>
        <Routes>
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="grades" element={<GradeManagement />} />
          <Route path="attendance" element={<AttendanceManagement />} />
          <Route path="*" element={<Navigate to="/teacher/dashboard" replace />} />
        </Routes>
      </MainLayout>
    </ProtectedRoute>
  } />
);

export default TeacherRoutes;