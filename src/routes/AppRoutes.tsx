// src/routes/AppRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { UserRole } from '../types/auth';
import ProtectedRoute from './ProtectedRoute';

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
//import Calendar from '../pages/shared/Calendar';
//import Messages from '../pages/shared/Messages';
import Profile from '../pages/shared/Profile';

const AppRoutes: React.FC = () => {

 

  return (
    <Routes>
      {/* Redirección a la página de inicio según el rol */}
      <Route path="/" element={<Landing />} />

      {/* Rutas públicas */}
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
              {/* Más rutas de administrador */}
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
              {/* Más rutas de profesor */}
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
              {/* Más rutas de estudiante */}
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
              {/* Más rutas de tutor */}
            </Routes>
          </MainLayout>
        </ProtectedRoute>
      } />

      {/* Rutas compartidas */}
    {/*  <Route path="/calendar" element={
        <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT, UserRole.TUTOR]}>
          <MainLayout>
            <Calendar />
          </MainLayout>
        </ProtectedRoute>
      } />*/}
      
     {/*<Route path="/messages" element={
        <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT, UserRole.TUTOR]}>
          <MainLayout>
           <Messages />
          </MainLayout>
        </ProtectedRoute>
      } />*/}  
      
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