// src/hooks/useAuth.ts
import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  // Simplemente re-exporta el store completo para mantener compatibilidad con el código existente
  return useAuthStore();
};

export default useAuth;