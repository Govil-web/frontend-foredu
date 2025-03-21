// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/auth';
import { authService } from '../services/authService';
import { debugService } from '../services/debugService';
import { tokenService } from '../services/tokenService';
import { CircularProgress, Box } from '@mui/material';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  // Habilitar depuración en desarrollo
  useEffect(() => {
    if (import.meta.env.DEV) {
      debugService.enable(true);
    }
  }, []);

  // Verificar si hay un token válido al iniciar
  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        debugService.log('Iniciando verificación de autenticación');
        
        if (authService.isAuthenticated()) {
          debugService.log('Token válido encontrado, obteniendo usuario');
          
          // Intentar obtener el usuario directamente del token
          const userFromToken = tokenService.getUserFromToken();
          
          if (userFromToken) {
            debugService.log('Usuario obtenido del token:', userFromToken);
            setUser(userFromToken);
          } else {
            // Si no podemos obtener el usuario del token, lo pedimos al servidor
            try {
              const userData = await authService.getCurrentUser();
              debugService.log('Usuario obtenido del servidor:', userData);
              setUser(userData);
            } catch (err) {
              debugService.error('Error al obtener usuario del servidor:', err);
              await logout(); // Limpia la sesión si hay error
            }
          }
        } else {
          debugService.log('No hay token válido');
        }
      } catch (err) {
        debugService.error('Error en la inicialización de autenticación:', err);
      } finally {
        setLoading(false);
        setInitialCheckDone(true);
      }
    };
    
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      debugService.log('Iniciando proceso de login para:', email);
      const { user, token } = await authService.login(email, password);
      
      if (!user) {
        throw new Error('No se recibió información del usuario');
      }
      
      debugService.log('Login exitoso, usuario:', user);
      setUser(user);
      return;
    } catch (err: any) {
      debugService.error('Error durante el proceso de login:', err);
      
      // Manejo de errores específicos
      if (err.response?.status === 400) {
        if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError('Error de validación. Verifique los datos ingresados.');
        }
      } else if (err.response?.status === 401) {
        setError('Credenciales inválidas. Por favor, intente nuevamente.');
      } else if (err.response?.status === 403) {
        setError('Su cuenta está inactiva. Contacte al administrador.');
      } else {
        setError('Error al iniciar sesión. Por favor, intente más tarde.');
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      debugService.log('Iniciando proceso de logout');
      await authService.logout();
      debugService.log('Logout exitoso');
    } catch (err) {
      debugService.error('Error durante el logout:', err);
    } finally {
      tokenService.removeToken();
      setUser(null);
      setLoading(false);
      debugService.log('Sesión cerrada completamente');
    }
  };

  const clearError = () => {
    setError(null);
  };

  // Evitar renderizado hasta verificar autenticación inicial
  if (!initialCheckDone && loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        isAuthenticated: !!user,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  
  return context;
};