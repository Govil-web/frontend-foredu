// src/types/course.ts
export interface Course {
  id: number;
  aula: string;
  curso: string;
  turno: string;
  materia: string;
  profesor?: number;
  profesorNombre: string;
  contador?: number;
}

export interface CourseResponseDTO {
  id: number;
  curso: string;
  aula: string;
  materia: string;
  turno: string;
  contador: number;
  profesor_id: number;
}

export interface ApiResponse<T> {
  estado: boolean;
  message: string;
  dataIterable: T[];
}