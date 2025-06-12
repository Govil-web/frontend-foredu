import { apiClient } from '../../../api/apiClient';
import { StudentRequestDTO, StudentResponseDTO } from '../types';

export const studentApi = {
  getAll: () => apiClient.get<{ data: StudentResponseDTO[] }>(`/estudiante/getAll`),
  getPaginated: (pagina: number = 0, tamano: number = 20) => apiClient.get<{ data: { content: StudentResponseDTO[], totalPages: number, totalElements: number, size: number, number: number } }>(`/estudiante/resumen/paginado?pagina=${pagina}&tamano=${tamano}`),
  getById: (id: number) => apiClient.get<{ data: StudentResponseDTO }>(`/student/${id}`),
  create: (dto: StudentRequestDTO) => apiClient.post<{ data: StudentResponseDTO }>(`/student/add`, dto),
  update: (dto: StudentRequestDTO) => apiClient.put<{ data: StudentResponseDTO }>(`/student/update`, dto),
  delete: (id: number) => apiClient.delete(`/student/${id}`),
}; 