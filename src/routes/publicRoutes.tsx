// src/routes/publicRoutes.tsx
import React from 'react';
import { Route, Routes } from 'react-router-dom';

// Páginas públicas
import Landing from '../pages/Landing/Landing';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import Unauthorized from '../pages/auth/Unauthorized';

/**
 * Componente que define las rutas públicas de la aplicación
 * Estas rutas son accesibles sin autenticación
 */
const PublicRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
    </Routes>
  );
};

export default PublicRoutes;