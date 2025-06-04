import { apiClient } from '../api/apiClient';
import { attendanceMapper, Attendance } from '../mappers/attendanceMapper';
import { ApiAsistenciaDTO, AsistenciaResponse, BackendApiResponse } from '../types/asistencia';

const BASE_URL = '/asistencia';

export const attendanceRepository = {
  async getAllByGradoAndFecha(gradoId: number, fechaInicio: string, fechaFin: string): Promise<Attendance[]> {
    const response = await apiClient.get<BackendApiResponse<ApiAsistenciaDTO[]>>(
      `${BASE_URL}/fechaAndGrado/${gradoId}`,
      { params: { fechaInicio, fechaFin } }
    );
    const data = response.data || [];
    return data.map(attendanceMapper.fromApi);
  },

  async getById(id: number): Promise<Attendance> {
    const response = await apiClient.get<BackendApiResponse<AsistenciaResponse>>(`${BASE_URL}/${id}`);
    return attendanceMapper.fromApi(response.data!);
  },

  async create(attendance: Attendance): Promise<Attendance> {
    const dto = attendanceMapper.toApi(attendance);
    const response = await apiClient.post<BackendApiResponse<ApiAsistenciaDTO>>(`${BASE_URL}/add`, dto);
    return attendanceMapper.fromApi(response.data!);
  },

  async update(attendance: Attendance): Promise<Attendance> {
    const dto = attendanceMapper.toApi(attendance);
    const response = await apiClient.patch<BackendApiResponse<ApiAsistenciaDTO>>(`${BASE_URL}/update`, dto);
    return attendanceMapper.fromApi(response.data!);
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`${BASE_URL}/${id}`);
  },
}; 