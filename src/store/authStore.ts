// src/store/authStore.ts 
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { authService } from '../services/api/authService';
import { tokenService } from '../services/auth/tokenService';
import { User } from '../types/auth';

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
          } catch (err: any) {
            let errorMessage = 'Error al iniciar sesión. Por favor, intente más tarde.';
            
            // Manejo de errores específicos
            if (err.response?.status === 400) {
              errorMessage = err.response?.data?.message || 'Error de validación. Verifique los datos ingresados.';
            } else if (err.response?.status === 401) {
              errorMessage = 'Credenciales inválidas. Por favor, intente nuevamente.';
            } else if (err.response?.status === 403) {
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
            console.error('Error durante el logout:', err);
          } finally {
            tokenService.removeToken();
            set({ user: null, isAuthenticated: false, loading: false });
          }
        },
        
        clearError: () => {
          set({ error: null });
        },
        
        checkAuth: async () => {
          set({ loading: true });
          
          try {
            if (tokenService.hasToken() && !tokenService.isTokenExpired()) {
              const userFromToken = tokenService.getUserFromToken();
              
              if (userFromToken) {
                set({ 
                  user: userFromToken,
                  isAuthenticated: true,
                  loading: false 
                });
                return;
              }
              
              try {
                const userData = await authService.getCurrentUser();
                set({ 
                  user: userData,
                  isAuthenticated: true,
                  loading: false 
                });
              } catch (err) {
                await get().logout();
              }
            } else {
              await get().logout();
            }
          } catch (err) {
            set({ 
              user: null,
              isAuthenticated: false,
              loading: false 
            });
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