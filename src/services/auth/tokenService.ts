// src/services/tokenService.ts
import { JwtPayload, User, UserRole } from '../../types/auth';

export const tokenService = {
  saveToken(token: string): void {
    if (!token) {
      console.error('Intento de guardar un token vacío o nulo');
      return;
    }
    localStorage.setItem('token', token);
    console.log('Token guardado en localStorage');
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  removeToken(): void {
    localStorage.removeItem('token');
    console.log('Token eliminado de localStorage');
  },

  hasToken(): boolean {
    return !!this.getToken();
  },

  decodeToken(token: string): JwtPayload | null {
    try {
      if (!token || typeof token !== 'string') {
        console.error('Token inválido: token nulo o no es string');
        return null;
      }

      const parts = token.split('.');
      if (parts.length !== 3) {
        console.error('Token inválido: formato incorrecto, debe tener 3 partes');
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
      console.error('Error al decodificar token:', error);
      return null;
    }
  },

  getUserFromToken(): User | null {
    const token = this.getToken();
    if (!token) {
      console.log('No hay token almacenado');
      return null;
    }

    const payload = this.decodeToken(token);
    if (!payload) {
      console.error('No se pudo extraer información del payload');
      return null;
    }

    if (!payload.id || !payload.sub || !payload.role) {
      console.error('Payload incompleto, falta información del usuario');
      return null;
    }

    const user: User = {
      id: payload.id,
      nombre: payload.nombre || 'Usuario',
      email: payload.sub,
      role: payload.role as UserRole,
    };

    console.log('Usuario extraído del token:', user);
    return user;
  },

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    const payload = this.decodeToken(token);
    if (!payload || !payload.exp) return true;

    // Verificar si el token ha expirado
    const currentTime = Math.floor(Date.now() / 1000);
    const isExpired = payload.exp < currentTime;

    if (isExpired) {
      console.warn('Token expirado');
    }

    return isExpired;
  }
};