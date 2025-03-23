// src/routes/AppRoutes.tsx
import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { UserRole } from '../types/auth';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../hooks/useAuth';

// Layouts
import MainLayout from '../components/layout/MainLayout/MainLayout';

// Páginas públicas
import Landing from '../pages/Landing/Landing';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import Unauthorized from '../pages/auth/Unauthorized';

// Páginas de administrador
import AdminDashboard from '../pages/admin/Dashboard';
import ManageUsers from '../pages/admin/ManageUsers';
import AdminReports from '../pages/admin/Reports';
import AdminSettings from '../pages/admin/Settings';

// Páginas de profesor
import TeacherDashboard from '../pages/teacher/Dashboard';
import GradeManagement from '../pages/teacher/GradeManagement';
import AttendanceManagement from '../pages/teacher/AttendanceManagement';

// Páginas de estudiante
import StudentDashboard from '../pages/student/Dashboard';
import StudentGrades from '../pages/student/Grades';

// Páginas de tutor
import TutorDashboard from '../pages/tutor/Dashboard';
import StudentProgress from '../pages/tutor/StudentProgress';

// Páginas compartidas
import Profile from '../pages/shared/Profile';

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

      {/* Rutas de administrador */}
      <Route path="/admin/*" element={
        <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
          <MainLayout>
            <Routes>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<ManageUsers />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
            </Routes>
          </MainLayout>
        </ProtectedRoute>
      } />

      {/* Rutas de profesor */}
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

      {/* Rutas de estudiante */}
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

      {/* Rutas de tutor */}
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

      {/* Rutas compartidas */}
      <Route path="/profile" element={
        <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.PROFESOR, UserRole.ESTUDIANTE, UserRole.TUTOR]}>
          <MainLayout>
            <Profile />
          </MainLayout>
        </ProtectedRoute>
      } />

      {/* Ruta 404 */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;