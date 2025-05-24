// src/routes/adminRoutes.tsx
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { UserRole } from '../types';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../components/layout/MainLayout/MainLayout';
import GradeDetails from '../pages/shared/GradeDetails.tsx';

// Páginas de administrador
// import AdminDashboard from '../pages/admin/Dashboard';
import Grados from '../pages/admin/Grados';
import ManageUsers from '../pages/admin/ManageUsers';
import AdminReports from '../pages/admin/Reports';
import AdminSettings from '../pages/admin/Settings';

/**
 * Rutas para el rol de administrador
 * Este componente define las rutas disponibles para el rol de administrador
 */
const AdminRoutes: React.FC = () => {
  // Este componente no debe usarse directamente en <Routes>
  // En su lugar, usamos getAdminRoutes para obtener el elemento de ruta
  return null;
};

/**
 * Función que retorna el elemento de ruta para el administrador
 * @returns Elemento JSX con las rutas de administrador
 */
export const getAdminRoutes = () => (
  <Route path="/admin/*" element={
    <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
      <MainLayout>
        <Routes>
          {/* <Route path="dashboard" element={<AdminDashboard />} /> */}
          <Route path='grades' element={<Grados /> }/>
          <Route path="grados/:id" element={<GradeDetails />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </MainLayout>
    </ProtectedRoute>
  } />
);

export default AdminRoutes;