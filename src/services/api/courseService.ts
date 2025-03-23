// src/services/api/courseService.ts
import { apiClient, ApiResponse } from './axiosConfig';

// Definición de interfaces para cursos
export interface Course {
  id: number;
  nombre: string;
  descripcion: string;
  nivel: string;
  grado: string;
  seccion: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CourseRequest {
  id?: number;
  nombre: string;
  descripcion: string;
  nivel: string;
  grado: string;
  seccion: string;
  activo?: boolean;
}

// URL base para las operaciones de cursos
const BASE_URL = '/cursos';

export const courseService = {
  /**
   * Obtiene todos los cursos
   * @returns Promise con la respuesta de los cursos
   */
  getAll: async (): Promise<ApiResponse<Course>> => {
    try {
      return await apiClient.get<ApiResponse<Course>>(BASE_URL);
    } catch (error) {
      console.error('Error al obtener cursos:', error);
      return {
        estado: false,
        message: 'Error al obtener cursos'
      };
    }
  },

  /**
   * Obtiene un curso específico por ID
   * @param id ID del curso
   * @returns Promise con la respuesta del curso
   */
  getById: async (id: number): Promise<ApiResponse<Course>> => {
    try {
      return await apiClient.get<ApiResponse<Course>>(`${BASE_URL}/${id}`);
    } catch (error) {
      console.error(`Error al obtener curso con ID ${id}:`, error);
      return {
        estado: false,
        message: 'Error al obtener el curso'
      };
    }
  },

  /**
   * Crea un nuevo curso
   * @param courseData Datos del curso a crear
   * @returns Promise con la respuesta del servidor
   */
  create: async (courseData: CourseRequest): Promise<ApiResponse<Course>> => {
    try {
      return await apiClient.post<ApiResponse<Course>>(BASE_URL, courseData);
    } catch (error) {
      console.error('Error al crear curso:', error);
      return {
        estado: false,
        message: 'Error al crear el curso'
      };
    }
  },

  /**
   * Actualiza un curso existente
   * @param courseData Datos del curso a actualizar
   * @returns Promise con la respuesta del servidor
   */
  update: async (courseData: CourseRequest): Promise<ApiResponse<Course>> => {
    if (!courseData.id) {
      return {
        estado: false,
        message: 'Se requiere ID para actualizar un curso'
      };
    }

    try {
      return await apiClient.put<ApiResponse<Course>>(`${BASE_URL}/${courseData.id}`, courseData);
    } catch (error) {
      console.error(`Error al actualizar curso con ID ${courseData.id}:`, error);
      return {
        estado: false,
        message: 'Error al actualizar el curso'
      };
    }
  },

  /**
   * Elimina un curso por ID
   * @param id ID del curso a eliminar
   * @returns Promise con la respuesta del servidor
   */
  delete: async (id: number): Promise<ApiResponse<null>> => {
    try {
      return await apiClient.delete<ApiResponse<null>>(`${BASE_URL}/${id}`);
    } catch (error) {
      console.error(`Error al eliminar curso con ID ${id}:`, error);
      return {
        estado: false,
        message: 'Error al eliminar el curso'
      };
    }
  },

  /**
   * Obtiene los estudiantes inscritos en un curso
   * @param courseId ID del curso
   * @returns Promise con la respuesta de estudiantes
   */
  getStudents: async (courseId: number): Promise<ApiResponse<any>> => {
    try {
      return await apiClient.get<ApiResponse<any>>(`${BASE_URL}/${courseId}/students`);
    } catch (error) {
      console.error(`Error al obtener estudiantes del curso ${courseId}:`, error);
      return {
        estado: false,
        message: 'Error al obtener estudiantes del curso'
      };
    }
  },

  /**
   * Asigna profesor a un curso
   * @param courseId ID del curso
   * @param teacherId ID del profesor
   * @returns Promise con la respuesta del servidor
   */
  assignTeacher: async (courseId: number, teacherId: number): Promise<ApiResponse<Course>> => {
    try {
      return await apiClient.post<ApiResponse<Course>>(`${BASE_URL}/${courseId}/teachers`, {
        teacherId
      });
    } catch (error) {
      console.error(`Error al asignar profesor al curso ${courseId}:`, error);
      return {
        estado: false,
        message: 'Error al asignar profesor al curso'
      };
    }
  }
};