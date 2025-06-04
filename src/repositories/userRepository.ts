import { apiClient } from '../api/apiClient';
import { userMapper, User } from '../mappers/userMapper';
import { UserRequestDTO, UserResponseDTO } from '../types/auth';

const BASE_URL = '/user';

export const userRepository = {
  async getAll(): Promise<User[]> {
    const response = await apiClient.get<{ dataIterable: UserResponseDTO[] }>(`${BASE_URL}/getAll`);
    return (response.dataIterable || []).map(userMapper.fromApi);
  },

  async getById(id: number): Promise<User> {
    const response = await apiClient.get<{ dataIterable: UserResponseDTO }>(`${BASE_URL}/${id}`);
    return userMapper.fromApi(response.dataIterable);
  },

  async create(user: User): Promise<User> {
    const dto: UserRequestDTO = userMapper.toApi(user);
    const response = await apiClient.post<{ dataIterable: UserResponseDTO }>(`${BASE_URL}/add`, dto);
    return userMapper.fromApi(response.dataIterable);
  },

  async update(user: User): Promise<User> {
    const dto: UserRequestDTO = userMapper.toApi(user);
    const response = await apiClient.put<{ dataIterable: UserResponseDTO }>(`${BASE_URL}/update`, dto);
    return userMapper.fromApi(response.dataIterable);
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`${BASE_URL}/${id}`);
  },
}; 