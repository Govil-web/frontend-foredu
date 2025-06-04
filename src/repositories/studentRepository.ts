import { apiClient } from '../api/apiClient';
import { studentMapper } from '../mappers/studentMapper';
import { Estudiante } from '../types/appModels';
import { ApiEstudianteData, ApiEstudiantePageResponse } from '../types';

const BASE_URL = '/estudiante';

export const studentRepository = {
  async getAll(pageNumber = 0, pageSize = 10): Promise<{ estudiantes: Estudiante[]; totalPages: number; totalElements: number }> {
    const response = await apiClient.get<ApiEstudiantePageResponse>(`${BASE_URL}`, {
      params: { pagina: pageNumber, tamano: pageSize },
    });
    const content = response.data?.content || [];
    const page = response.data?.page || { totalPages: 0, totalElements: 0 };
    return {
      estudiantes: content.map(studentMapper.fromApi),
      totalPages: page.totalPages,
      totalElements: page.totalElements,
    };
  },

  async getById(id: number): Promise<Estudiante> {
    const response = await apiClient.get<{ data: ApiEstudianteData }>(`${BASE_URL}/${id}`);
    return studentMapper.fromApi(response.data);
  },

  async create(student: Estudiante): Promise<Estudiante> {
    const dto: ApiEstudianteData = studentMapper.toApi(student);
    const response = await apiClient.post<{ data: ApiEstudianteData }>(`${BASE_URL}/add`, dto);
    return studentMapper.fromApi(response.data);
  },

  async update(student: Estudiante): Promise<Estudiante> {
    const dto: ApiEstudianteData = studentMapper.toApi(student);
    const response = await apiClient.put<{ data: ApiEstudianteData }>(`${BASE_URL}/update`, dto);
    return studentMapper.fromApi(response.data);
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`${BASE_URL}/${id}`);
  },
}; 