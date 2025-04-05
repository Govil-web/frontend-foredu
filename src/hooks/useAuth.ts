// src/hooks/useAuth.ts
import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  return useAuthStore();
};

export default useAuth;