// src/store/authStore.ts 
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { authService } from '../services/api/authService';
import { tokenService } from '../services/auth/tokenService';
import { User } from '../types';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  // Acciones
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // Estado inicial
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false,

        // Acciones
        login: async (email: string, password: string) => {
          set({ loading: true, error: null });

          try {
            const { user, token } = await authService.login(email, password);

            if (!user || !token) {
              throw new Error('No se recibió información del usuario o token');
            }

            set({ user, isAuthenticated: true, loading: false });
          } catch (err: Error | unknown) {
            let errorMessage = 'Error al iniciar sesión. Por favor, intente más tarde.';

            // Manejo de errores específicos
            const apiError = err as { response?: { status?: number; data?: { message?: string } } };
            if (apiError.response?.status === 400) {
              errorMessage = apiError.response?.data?.message || 'Error de validación. Verifique los datos ingresados.';
            } else if (apiError.response?.status === 401) {
              errorMessage = 'Credenciales inválidas. Por favor, intente nuevamente.';
            } else if (apiError.response?.status === 403) {
              errorMessage = 'Su cuenta está inactiva. Contacte al administrador.';
            }

            set({ error: errorMessage, loading: false, user: null, isAuthenticated: false });
            throw err;
          }
        },

        logout: async () => {
          set({ loading: true });

          try {
            await authService.logout();
          } catch (err) {
            // Error silently handled
          } finally {
            tokenService.removeToken();
            set({ user: null, isAuthenticated: false, loading: false });
          }
        },

        clearError: () => {
          set({ error: null });
        },

        /**
         * Verifica el estado de autenticación del usuario
         * 1. Intenta obtener el usuario del token almacenado
         * 2. Si no es posible, intenta obtenerlo de la API
         * 3. Si ambos fallan, cierra la sesión
         */
        checkAuth: async () => {
          set({ loading: true });

          // Caso 1: No hay token o está expirado
          if (!tokenService.hasToken() || tokenService.isTokenExpired()) {
            await get().logout();
            return;
          }

          // Caso 2: Hay token válido y podemos obtener el usuario de él
          const userFromToken = tokenService.getUserFromToken();
          if (userFromToken) {
            set({ 
              user: userFromToken,
              isAuthenticated: true,
              loading: false 
            });
            return;
          }

          // Caso 3: Hay token pero no podemos obtener el usuario, intentamos con la API
          try {
            const userData = await authService.getCurrentUser();
            set({ 
              user: userData,
              isAuthenticated: true,
              loading: false 
            });
          } catch (err) {
            // Si falla la API, cerramos sesión
            await get().logout();
          }
        }
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated })
      }
    )
  )
);
