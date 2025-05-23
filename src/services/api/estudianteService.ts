import { apiClient } from './apiClient';

// Interfaz para el contenido de la respuesta paginada
interface EstudianteContent {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  genero: string;
  activo: boolean;
  gradoId: number;
  gradoNombre: string;
}

// Definimos una estructura similar a UserResponseDTO para consistencia
export interface EstudianteResponseDTO {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  activo: boolean;
  gradoId: number;
  gradoNombre: string;
}

const BASE_URL = '/estudiante';

export const estudianteService = {
  getAll: async (page: number = 0, size: number = 10): Promise<{
    estudiantes: EstudianteResponseDTO[];
    totalPages: number;
    totalElements: number;
  }> => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await apiClient.get<any>(`${BASE_URL}`, {
        params: {
          pagina: page,
          tamano: size
        }
      });

      if (!response.data || !Array.isArray(response.data.content)) {
        return {
          estudiantes: [],
          totalPages: 0,
          totalElements: 0
        };
      }

      const { content, page: pageInfo } = response.data;

      const mappedEstudiantes: EstudianteResponseDTO[] = content.map((est: EstudianteContent) => ({
        id: est.id,
        nombre: est.nombre,
        apellido: est.apellido,
        dni: est.dni,
        activo: est.activo,
        gradoId: est.gradoId,
        gradoNombre: est.gradoNombre
      }));

      return {
        estudiantes: mappedEstudiantes,
        totalPages: pageInfo.totalPages,
        totalElements: pageInfo.totalElements
      };
    } catch (error) {
      console.error('Error detallado al obtener estudiantes:', error);
      return {
        estudiantes: [],
        totalPages: 0,
        totalElements: 0
      };
    }
  }
}; 