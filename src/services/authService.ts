// src/services/authService.ts
import axios from 'axios';
import { User, AuthResponse } from '../types/auth';
import { debugService } from './debugService';
import { tokenService } from './tokenService';

// Configuración de axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:10000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Añadir interceptor para incluir token en peticiones
api.interceptors.request.use(
  (config) => {
    const token = tokenService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      debugService.log('Añadiendo token a la solicitud:', config.url);
    }
    return config;
  },
  (error) => {
    debugService.error('Error en interceptor de solicitud:', error);
    return Promise.reject(error);
  }
);

// Manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      debugService.warn('Error 401: Token inválido o expirado');
      tokenService.removeToken();
      
      // Solo redirigir a login si no estamos ya en esa página
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    debugService.log('Enviando solicitud de login para:', email);
      
    try {
      const response = await api.post('/auth/login', {
        email,
        contrasena: password
      });
        
      debugService.log('Respuesta de login exitosa:', {
        status: response.status,
        statusText: response.statusText
      });
      
      // Log completo para depuración
      debugService.log('Datos de respuesta:', JSON.stringify(response.data));
        
      // Extraer token - soportar ambos formatos de respuesta
      let token;
      
      if (response.data.token) {
        token = response.data.token;
      } else if (response.data.jwtToken) {
        token = response.data.jwtToken;
      } else {
        debugService.error('Estructura de respuesta:', response.data);
        throw new Error('No se pudo encontrar un token válido en la respuesta');
      }
      
      // Validar que el token tenga el formato correcto antes de guardarlo
      if (!token || typeof token !== 'string' || token.split('.').length !== 3) {
        throw new Error('El formato del token recibido no es válido');
      }
        
      // Guardar token en localStorage
      tokenService.saveToken(token);
        
      // Extraer información del usuario desde el token
      const user = tokenService.getUserFromToken();
        
      if (!user) {
        throw new Error('No se pudo extraer la información del usuario del token');
      }
        
      debugService.log('Información de usuario extraída del token:', user);
        
      // Construir y devolver objeto AuthResponse
      return {
        token,
        user
      };
    } catch (error: any) {
      // Limpiar token si existe en caso de error
      tokenService.removeToken();
        
      const errorMessage = error.response?.data?.message || error.message || 'Error de autenticación';
      debugService.error('Error en solicitud de login:', errorMessage);
      throw error;
    }
  }
,
  
  logout: async (): Promise<void> => {
    const token = tokenService.getToken();
    
    if (!token) {
      debugService.log('Intento de logout sin token disponible');
      return;
    }
    
    try {
      debugService.log('Enviando solicitud de logout al servidor');
      await api.post('/auth/logout');
      debugService.log('Logout exitoso en el servidor');
    } catch (error: any) {
      debugService.error('Error durante logout en el servidor:', error.response?.data || error.message);
      // No propagamos el error para asegurar que siempre se limpie el token local
    } finally {
      tokenService.removeToken();
    }
  },
  
  getCurrentUser: async (): Promise<User> => {
    debugService.log('Obteniendo información del usuario actual');
    
    // Primero intentamos obtener el usuario del token
    const userFromToken = tokenService.getUserFromToken();
    
    if (userFromToken) {
      debugService.log('Usuario obtenido del token JWT');
      return userFromToken;
    }
    
    // Si no hay usuario en el token o está expirado, intentamos obtenerlo del endpoint /me
    try {
      debugService.log('Solicitando información del usuario al servidor');
      const response = await api.get<User>('/auth/me');
      debugService.log('Información de usuario recibida del servidor');
      return response.data;
    } catch (error: any) {
      debugService.error('Error al obtener usuario del servidor:', error.response?.data || error.message);
      throw error;
    }
  },
  
  isAuthenticated: (): boolean => {
    // Verificar si hay token y no está expirado
    const isAuth = tokenService.hasToken() && !tokenService.isTokenExpired();
    debugService.log(`Verificación de autenticación: ${isAuth ? 'Autenticado' : 'No autenticado'}`);
    return isAuth;
  }
};

export default api;