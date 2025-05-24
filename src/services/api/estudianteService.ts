import { apiClient } from './apiClient';
import {
  ApiEstudianteData,
  ApiEstudiantePageResponse,
  ApiEstudiantePorGradoResponse
} from '../../types';
import { Estudiante } from '../../types';

const BASE_URL = '/estudiante';


const mapApiEstudianteToModel = (apiEst: ApiEstudianteData): Estudiante => ({
  id: apiEst.id,
  nombre: apiEst.nombre,
  apellido: apiEst.apellido,
  dni: apiEst.dni,
  activo: apiEst.activo,
  genero: apiEst.genero,
  gradoId: apiEst.gradoId,
  gradoNombre: apiEst.gradoNombre,
});

export const estudianteService = {
  obtenerPorGrado: async (gradoId: number): Promise<{
    estado: boolean;
    data: Estudiante[];
    message: string;
  }> => {
    try {

      const response = await apiClient.get<ApiEstudiantePorGradoResponse>(`${BASE_URL}/grado/${gradoId}`, {
        params: { gradoId }
      });


      const apiEstudiantes = response.data || [];
      const mappedData: Estudiante[] = apiEstudiantes.map(mapApiEstudianteToModel);
      return {
        estado: true,
        data: mappedData,
        message: 'Estudiantes obtenidos con éxito.'
      };
    } catch (error) {
      console.error('Error obteniendo estudiantes por grado:', error);
      return {
        estado: false,
        data: [],
        message: error instanceof Error ? error.message : 'Error obteniendo estudiantes'
      };
    }
  },

  getAll: async (page: number = 0, size: number = 10): Promise<{
    estudiantes: Estudiante[];
    totalPages: number;
    totalElements: number;
  }> => {
    try {
      const response = await apiClient.get<ApiEstudiantePageResponse>(`${BASE_URL}`, {
        params: {
          pagina: page,
          tamano: size
        }
      });

      if (!response || !Array.isArray(response.content)) {
        console.warn('Respuesta inesperada de la API de paginación de estudiantes:', response);
        return {
          estudiantes: [],
          totalPages: 0,
          totalElements: 0
        };
      }

      const { content, totalPages, totalElements /*, number, size */ } = response;
      const mappedEstudiantes: Estudiante[] = content.map(mapApiEstudianteToModel);

      return {
        estudiantes: mappedEstudiantes,
        totalPages: totalPages,
        totalElements: totalElements
      };
    } catch (error) {
      console.error('Error detallado al obtener estudiantes paginados:', error);
      return {
        estudiantes: [],
        totalPages: 0,
        totalElements: 0
      };
    }
  }
};