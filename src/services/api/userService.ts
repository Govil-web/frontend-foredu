// src/services/api/userService.ts
import { apiClient, ApiResponse } from './axiosConfig';
import { UserRequestDTO, UserResponseDTO } from '../../types/auth';

// URL base para las operaciones de usuarios
const BASE_URL = '/user';

export const userService = {
  /**
   * Obtiene todos los usuarios del sistema
   * @returns Promise con la respuesta de los usuarios
   */
  getAll: async (): Promise<ApiResponse<UserResponseDTO>> => {
    try {
      return await apiClient.get<ApiResponse<UserResponseDTO>>(`${BASE_URL}/getAll`);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      return {
        estado: false,
        message: 'Error al obtener usuarios'
      };
    }
  },

  /**
   * Obtiene un usuario específico por ID
   * @param id ID del usuario a obtener
   * @returns Promise con la respuesta del usuario
   */
  getById: async (id: number): Promise<ApiResponse<UserResponseDTO>> => {
    try {
      return await apiClient.get<ApiResponse<UserResponseDTO>>(`${BASE_URL}/${id}`);
    } catch (error) {
      console.error(`Error al obtener usuario con ID ${id}:`, error);
      return {
        estado: false,
        message: 'Error al obtener el usuario'
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
      return await apiClient.post<ApiResponse<UserResponseDTO>>(BASE_URL, userData);
    } catch (error) {
      console.error('Error al crear usuario:', error);
      return {
        estado: false,
        message: 'Error al crear el usuario'
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
      return await apiClient.put<ApiResponse<UserResponseDTO>>(`${BASE_URL}/${userData.id}`, userData);
    } catch (error) {
      console.error(`Error al actualizar usuario con ID ${userData.id}:`, error);
      return {
        estado: false,
        message: 'Error al actualizar el usuario'
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
      return await apiClient.delete<ApiResponse<null>>(`${BASE_URL}/${id}`);
    } catch (error) {
      console.error(`Error al eliminar usuario con ID ${id}:`, error);
      return {
        estado: false,
        message: 'Error al eliminar el usuario'
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
      return await apiClient.patch<ApiResponse<UserResponseDTO>>(`${BASE_URL}/${id}/estado`, { activo: active });
    } catch (error) {
      console.error(`Error al cambiar estado del usuario con ID ${id}:`, error);
      return {
        estado: false,
        message: 'Error al cambiar estado del usuario'
      };
    }
  }
};