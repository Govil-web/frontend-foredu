// src/stores/authStore.ts
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
            console.log('Iniciando proceso de login para:', email);
            const { user, token } = await authService.login(email, password);
            
            if (!user || !token) {
              throw new Error('No se recibió información del usuario o token');
            }
            
            // Guardar el token explícitamente
            tokenService.saveToken(token);
            
            console.log('Login exitoso, usuario:', user);
            set({ user, isAuthenticated: true, loading: false });
          } catch (err: any) {
            console.error('Error durante el proceso de login:', err);
            
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
            console.log('Iniciando proceso de logout');
            await authService.logout();
            console.log('Logout exitoso');
          } catch (err) {
            console.error('Error durante el logout:', err);
          } finally {
            tokenService.removeToken();
            set({ user: null, isAuthenticated: false, loading: false });
            console.log('Sesión cerrada completamente');
          }
        },
        
        clearError: () => {
          set({ error: null });
        },
        
        checkAuth: async () => {
          set({ loading: true });
          
          try {
            if (tokenService.hasToken() && !tokenService.isTokenExpired()) {
              // Intentar obtener el usuario directamente del token
              const userFromToken = tokenService.getUserFromToken();
              
              if (userFromToken) {
                console.log('Usuario obtenido del token:', userFromToken);
                set({ 
                  user: userFromToken,
                  isAuthenticated: true,
                  loading: false 
                });
                return;
              }
              
              // Si no podemos obtener el usuario del token, lo pedimos al servidor
              try {
                const userData = await authService.getCurrentUser();
                console.log('Usuario obtenido del servidor:', userData);
                set({ 
                  user: userData,
                  isAuthenticated: true,
                  loading: false 
                });
              } catch (err) {
                console.error('Error al obtener usuario del servidor:', err);
                await get().logout(); // Limpia la sesión si hay error
              }
            } else {
              console.log('No hay token válido');
              await get().logout();
            }
          } catch (err) {
            console.error('Error en la verificación de autenticación:', err);
            set({ 
              user: null,
              isAuthenticated: false,
              loading: false 
            });
          } finally {
            set({ loading: false });
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