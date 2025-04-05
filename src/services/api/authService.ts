import { apiClient } from './apiClient';
import { User, AuthResponse } from '../../types/auth';
import { tokenService } from '../auth/tokenService';

const BASE_URL = '/auth';

interface LoginResponse {
  jwtToken?: string;
  user?: User;
}

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<LoginResponse>(`${BASE_URL}/login`, {
        email,
        contrasena: password
      });
      
      // Properly access the token from the response.data object
      const token = response?.jwtToken;
      
      if (!token) {
        throw new Error('No se recibió un token válido en la respuesta');
      }
      
      tokenService.saveToken(token);
      const user = tokenService.getUserFromToken();
      
      if (!user) {
        throw new Error('No se pudo extraer la información del usuario del token');
      }
      
      return { token, user };
    } catch (error) {
      tokenService.removeToken();
      console.error('Error en login:', error);
      throw error;
    }
  },
  
  logout: async (): Promise<void> => {
    const token = tokenService.getToken();
    
    if (!token) {
      console.log('Intento de logout sin token disponible');
      return;
    }
    
    try {
      await apiClient.post(`${BASE_URL}/logout`);
    } catch (error) {
      console.error('Error durante logout en el servidor:', error);
    } finally {
      tokenService.removeToken();
    }
  },
  
  isAuthenticated: (): boolean => {
    return tokenService.hasToken() && !tokenService.isTokenExpired();
  },
  
  // If you're using getCurrentUser in authStore.ts but it's not defined here
  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await apiClient.get<User>(`${BASE_URL}/me`);
      return response;
    } catch (error) {
      console.error('Error al obtener el usuario actual:', error);
      throw error;
    }
  }
}