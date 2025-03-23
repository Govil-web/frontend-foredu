// src/services/index.ts
import { apiClient } from './api/axiosConfig';
import { authService } from './api/authService';
import { userService } from './api/userService';
import { tokenService } from './auth/tokenService';

// Exportamos todos los servicios desde un único punto
export {
  apiClient,
  authService,
  userService,
  tokenService
};

// Exportación por defecto para mayor flexibilidad
export default {
  apiClient,
  authService,
  userService,
  tokenService
};