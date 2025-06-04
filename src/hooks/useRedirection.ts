// src/hooks/useRedirection.ts
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types';
import { useAuth } from './useAuth';

/**
 * Hook personalizado para manejar la redirección basada en el rol del usuario
 * Redirige automáticamente a los usuarios autenticados a su dashboard correspondiente
 * cuando están en la página de inicio o login
 */
export const useRedirection = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

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

  // No necesitamos retornar nada, ya que el hook maneja la redirección internamente
  return null;
};

export default useRedirection;