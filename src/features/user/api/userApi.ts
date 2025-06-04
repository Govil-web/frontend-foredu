import { apiClient } from '../../../api/apiClient';
import { UserRequestDTO, UserResponseDTO } from '../types';

export const userApi = {
  getAll: () => apiClient.get<{ dataIterable: UserResponseDTO[] }>(`/user/getAll`),
  getById: (id: number) => apiClient.get<{ dataIterable: UserResponseDTO }>(`/user/${id}`),
  create: (dto: UserRequestDTO) => apiClient.post<{ dataIterable: UserResponseDTO }>(`/user/add`, dto),
  update: (dto: UserRequestDTO) => apiClient.put<{ dataIterable: UserResponseDTO }>(`/user/update`, dto),
  delete: (id: number) => apiClient.delete(`/user/${id}`),
}; 