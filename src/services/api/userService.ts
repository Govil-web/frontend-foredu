import { apiClient } from './apiClient';
import { UserRequestDTO, UserResponseDTO } from '../../types/auth';

const BASE_URL = '/user';

// Interfaz para la respuesta del servidor
interface ApiResponse<T> {
  estado: boolean;
  message: string;
  dataIterable?: T;
  // Otros campos posibles
}

export const userService = {
  getAll: async (): Promise<UserResponseDTO[] | undefined> => {
    try {
      const response = await apiClient.get<ApiResponse<UserResponseDTO[]>>(`${BASE_URL}/getAll`);
      // Extraer el array de dataIterable si existe, o devolver un array vacío
      return response.dataIterable || [];
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      return undefined;
    }
  },

  getById: async (id: number): Promise<UserResponseDTO | undefined> => {
    try {
      const response = await apiClient.get<ApiResponse<UserResponseDTO>>(`${BASE_URL}/${id}`);
      return response.dataIterable;
    } catch (error) {
      console.error(`Error al obtener usuario con ID ${id}:`, error);
      return undefined;
    }
  },

  create: async (userData: UserRequestDTO): Promise<UserResponseDTO | undefined> => {
    try {
      const response = await apiClient.post<ApiResponse<UserResponseDTO>>(`${BASE_URL}/add`, userData);
      return response.dataIterable;
    } catch (error) {
      console.error('Error al crear usuario:', error);
      return undefined;
    }
  },

  update: async (userData: UserRequestDTO): Promise<UserResponseDTO | undefined> => {
    try {
      const response = await apiClient.put<ApiResponse<UserResponseDTO>>(`${BASE_URL}/update`, userData);
      return response.dataIterable;
    } catch (error) {
      console.error(`Error al actualizar usuario con ID ${userData.id}:`, error);
      return undefined;
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`${BASE_URL}/${id}`);
    } catch (error) {
      console.error(`Error al eliminar usuario con ID ${id}:`, error);
      throw error;
    }
  },
};