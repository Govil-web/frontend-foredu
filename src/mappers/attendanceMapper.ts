import { ApiAsistenciaDTO, AsistenciaResponse } from '../types/asistencia';

export interface Attendance {
  id: number;
  fecha: string;
  estado: string;
  estudiante: number;
  grado: number;
  justificativos?: string | null;
  porcentajeAsistencia?: number;
  nombreEstudiante?: string;
}

export const attendanceMapper = {
  fromApi: (api: ApiAsistenciaDTO | AsistenciaResponse): Attendance => ({
    id: api.id,
    fecha: api.fecha,
    estado: api.estado,
    estudiante: api.estudiante,
    grado: api.grado,
    justificativos: 'justificativos' in api ? api.justificativos : undefined,
    porcentajeAsistencia: 'porcentajeAsistencia' in api ? api.porcentajeAsistencia : undefined,
    nombreEstudiante: 'nombreEstudiante' in api ? api.nombreEstudiante : undefined,
  }),

  toApi: (attendance: Attendance): ApiAsistenciaDTO => ({
    id: attendance.id,
    fecha: attendance.fecha,
    estado: attendance.estado,
    estudiante: attendance.estudiante,
    grado: attendance.grado,
    justificativos: attendance.justificativos || null,
    porcentajeAsistencia: attendance.porcentajeAsistencia,
    nombreEstudiante: attendance.nombreEstudiante,
  }),
}; 