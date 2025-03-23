// src/services/api/authService.ts
import { apiClient, ApiResponse } from './axiosConfig';
import { User, AuthResponse } from '../../types/auth';
import { tokenService } from '../auth/tokenService';

// URL base para las operaciones de autenticación
const BASE_URL = '/auth';

interface LoginResponse {
  jwtToken?: string;
  token?: string;
  user?: User;
}

export const authService = {
  /**
   * Inicia sesión del usuario
   * @param email Email del usuario
   * @param password Contraseña del usuario
   * @returns Promise con la respuesta de autenticación
   */
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<LoginResponse>(`${BASE_URL}/login`, {
        email,
        contrasena: password
      });
      
      // Extraer token - soporte para ambos formatos de respuesta
      let token = response.token || response.jwtToken;
      
      if (!token) {
        throw new Error('No se recibió un token válido en la respuesta');
      }
      
      // Validar formato del token
      if (typeof token !== 'string' || token.split('.').length !== 3) {
        throw new Error('El formato del token recibido no es válido');
      }
      
      // Guardar token y extraer información del usuario
      tokenService.saveToken(token);
      const user = tokenService.getUserFromToken();
      
      if (!user) {
        throw new Error('No se pudo extraer la información del usuario del token');
      }
      
      return { token, user };
    } catch (error) {
      // Limpiar token en caso de error
      tokenService.removeToken();
      console.error('Error en login:', error);
      throw error;
    }
  },
  
  /**
   * Cierra la sesión del usuario
   * @returns Promise void
   */
  logout: async (): Promise<void> => {
    const token = tokenService.getToken();
    
    if (!token) {
      console.log('Intento de logout sin token disponible');
      return;
    }
    
    try {
      await apiClient.post<void>(`${BASE_URL}/logout`);
    } catch (error) {
      console.error('Error durante logout en el servidor:', error);
    } finally {
      tokenService.removeToken();
    }
  },
  
  /**
   * Obtiene información del usuario actual
   * @returns Promise con la información del usuario
   */
  getCurrentUser: async (): Promise<User> => {
    try {
      return await apiClient.get<User>(`${BASE_URL}/me`);
    } catch (error) {
      console.error('Error al obtener información del usuario:', error);
      throw error;
    }
  },
  
  /**
   * Verifica si el usuario está autenticado
   * @returns boolean
   */
  isAuthenticated: (): boolean => {
    return tokenService.hasToken() && !tokenService.isTokenExpired();
  },

  /**
   * Solicita cambio de contraseña
   * @param email Email del usuario
   * @returns Promise con la respuesta del servidor
   */
  requestPasswordReset: async (email: string): Promise<ApiResponse<void>> => {
    try {
      return await apiClient.post<ApiResponse<void>>(`${BASE_URL}/password-reset-request`, { email });
    } catch (error) {
      console.error('Error al solicitar cambio de contraseña:', error);
      return {
        estado: false,
        message: 'Error al solicitar cambio de contraseña'
      };
    }
  },

  /**
   * Confirma cambio de contraseña
   * @param token Token de confirmación
   * @param newPassword Nueva contraseña
   * @returns Promise con la respuesta del servidor
   */
  confirmPasswordReset: async (token: string, newPassword: string): Promise<ApiResponse<void>> => {
    try {
      return await apiClient.post<ApiResponse<void>>(`${BASE_URL}/password-reset-confirm`, {
        token,
        newPassword
      });
    } catch (error) {
      console.error('Error al confirmar cambio de contraseña:', error);
      return {
        estado: false,
        message: 'Error al confirmar cambio de contraseña'
      };
    }
  }
};