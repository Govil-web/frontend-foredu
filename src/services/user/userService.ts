// src/services/userService.ts
import api from '../auth/authService';
import { UserRequestDTO, UserResponseDTO } from '../../types/auth';

// Interfaz para respuestas del servidor
interface ApiResponse<T> {
  estado: boolean;
  message?: string;
  data?: T;
  dataIterable?: T[];
}

export const userService = {
  /**
   * Obtiene todos los usuarios del sistema
   * @returns Promise con los datos de los usuarios
   */
  getAll: async (): Promise<ApiResponse<UserResponseDTO>> => {
    try {
      const response = await api.get<ApiResponse<UserResponseDTO>>('/usuarios');
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener usuarios:', error);
      return {
        estado: false,
        message: error.response?.data?.message || 'Error al obtener usuarios'
      };
    }
  },

  /**
   * Obtiene un usuario específico por ID
   * @param id ID del usuario a obtener
   * @returns Promise con los datos del usuario
   */
  getById: async (id: number): Promise<ApiResponse<UserResponseDTO>> => {
    try {
      const response = await api.get<ApiResponse<UserResponseDTO>>(`/usuarios/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error al obtener usuario con ID ${id}:`, error);
      return {
        estado: false,
        message: error.response?.data?.message || 'Error al obtener el usuario'
      };
    }
  },

  /**
   * Crea un nuevo usuario
   * @param userData Datos del usuario a crear
   * @returns Promise con la respuesta del servidor
   */
  create: async (userData: UserRequestDTO): Promise<ApiResponse<UserResponseDTO>> => {
    try {
      const response = await api.post<ApiResponse<UserResponseDTO>>('/usuarios', userData);
      return response.data;
    } catch (error: any) {
      console.error('Error al crear usuario:', error);
      return {
        estado: false,
        message: error.response?.data?.message || 'Error al crear el usuario'
      };
    }
  },

  /**
   * Actualiza un usuario existente
   * @param userData Datos del usuario a actualizar
   * @returns Promise con la respuesta del servidor
   */
  update: async (userData: UserRequestDTO): Promise<ApiResponse<UserResponseDTO>> => {
    if (!userData.id) {
      return {
        estado: false,
        message: 'Se requiere ID para actualizar un usuario'
      };
    }

    try {
      const response = await api.put<ApiResponse<UserResponseDTO>>(`/usuarios/${userData.id}`, userData);
      return response.data;
    } catch (error: any) {
      console.error(`Error al actualizar usuario con ID ${userData.id}:`, error);
      return {
        estado: false,
        message: error.response?.data?.message || 'Error al actualizar el usuario'
      };
    }
  },

  /**
   * Elimina un usuario por ID
   * @param id ID del usuario a eliminar
   * @returns Promise con la respuesta del servidor
   */
  delete: async (id: number): Promise<ApiResponse<null>> => {
    try {
      const response = await api.delete<ApiResponse<null>>(`/usuarios/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error al eliminar usuario con ID ${id}:`, error);
      return {
        estado: false,
        message: error.response?.data?.message || 'Error al eliminar el usuario'
      };
    }
  },

  /**
   * Cambia el estado de activación de un usuario
   * @param id ID del usuario
   * @param active Estado de activación (true/false)
   * @returns Promise con la respuesta del servidor
   */
  toggleActive: async (id: number, active: boolean): Promise<ApiResponse<UserResponseDTO>> => {
    try {
      const response = await api.patch<ApiResponse<UserResponseDTO>>(`/usuarios/${id}/estado`, { activo: active });
      return response.data;
    } catch (error: any) {
      console.error(`Error al cambiar estado del usuario con ID ${id}:`, error);
      return {
        estado: false,
        message: error.response?.data?.message || 'Error al cambiar estado del usuario'
      };
    }
  }
};