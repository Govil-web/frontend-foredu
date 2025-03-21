// src/services/tokenService.ts
import { JwtPayload, User, UserRole } from '../types/auth';
import { debugService } from './debugService';

/**
 * Servicio para manejar tokens JWT
 */
export const tokenService = {
  /**
   * Guarda el token JWT en localStorage
   * @param token Token JWT
   */
  saveToken(token: string): void {
    if (!token) {
      debugService.error('Intento de guardar un token vacío o nulo');
      return;
    }
    localStorage.setItem('token', token);
    debugService.log('Token guardado en localStorage');
  },

  /**
   * Obtiene el token JWT de localStorage
   * @returns Token JWT o null si no existe
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  },

  /**
   * Elimina el token JWT de localStorage
   */
  removeToken(): void {
    localStorage.removeItem('token');
    debugService.log('Token eliminado de localStorage');
  },

  /**
   * Verifica si hay un token JWT en localStorage
   * @returns true si existe un token, false en caso contrario
   */
  hasToken(): boolean {
    return !!this.getToken();
  },

  /**
   * Decodifica el payload del token JWT
   * @param token Token JWT
   * @returns Payload decodificado o null si hay error
   */
  decodeToken(token: string): JwtPayload | null {
    try {
      // Verificar que el token existe y tiene formato válido
      if (!token || typeof token !== 'string') {
        debugService.error('Token inválido: token nulo o no es string');
        return null;
      }

      // Verificar que el token tiene la estructura esperada (3 partes separadas por punto)
      const parts = token.split('.');
      if (parts.length !== 3) {
        debugService.error('Token inválido: formato incorrecto, debe tener 3 partes');
        return null;
      }

      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      
      // Decodificar payload
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      return JSON.parse(jsonPayload);
    } catch (error) {
      debugService.error('Error al decodificar token:', error);
      return null;
    }
  },

  /**
   * Extrae la información del usuario del token JWT
   * @returns Objeto User con la información del token o null si no hay token
   */
  getUserFromToken(): User | null {
    const token = this.getToken();
    if (!token) {
      debugService.log('No hay token almacenado');
      return null;
    }

    const payload = this.decodeToken(token);
    if (!payload) {
      debugService.error('No se pudo extraer información del payload');
      return null;
    }

    // Validar que el payload tenga los campos necesarios
    if (!payload.id || !payload.sub || !payload.role) {
      debugService.error('Payload incompleto, falta información del usuario');
      return null;
    }

    // Crear objeto de usuario a partir del payload del token
    const user: User = {
      id: payload.id,
      nombre: payload.nombre || 'Usuario',
      email: payload.sub,
      role: payload.role as UserRole,
    };

    debugService.log('Usuario extraído del token:', user);
    return user;
  },

  /**
   * Verifica si el token ha expirado
   * @returns true si el token ha expirado, false en caso contrario
   */
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    const payload = this.decodeToken(token);
    if (!payload || !payload.exp) return true;

    // Verificar si el token ha expirado
    const currentTime = Math.floor(Date.now() / 1000);
    const isExpired = payload.exp < currentTime;

    if (isExpired) {
      debugService.warn('Token expirado');
    }

    return isExpired;
  }
};