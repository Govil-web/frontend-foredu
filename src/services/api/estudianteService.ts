import { apiClient } from './apiClient';
import {
  ApiEstudianteData,
  ApiEstudiantePageResponse,
  ApiEstudiantePorGradoResponse,
 BackendApiResponse,
  AsistenciaResponse,
  
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

  getAll: async (pageNumber: number = 0, pageSize: number = 10): Promise<{
    estudiantes: Estudiante[];
    totalPages: number;
    totalElements: number;

  }> => {
    try {
     
      const response = await apiClient.get<ApiEstudiantePageResponse>(`${BASE_URL}`, { 
        params: {
          pagina: pageNumber, 
          tamano: pageSize
        }
      });

      
      if (
        !response.data ||              
        !Array.isArray(response.data.content) || 
        !response.data.page       
      ) {
        console.warn('Respuesta inesperada o estructura incorrecta de la API de paginación de estudiantes:', response.data);
        return {
          estudiantes: [],
          totalPages: 0,
          totalElements: 0
        };
      }

  
      const { content, page } = response.data;
      const { totalPages, totalElements } = page;

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
        totalElements: 0,
       
      };
    }
  },
obtenerDetalleAsistencia: async (
  estudianteId: number
): Promise<{
  estado: boolean;
  data: AsistenciaResponse[];
  message: string;
}> => {
  try {
    const response = await apiClient.get<BackendApiResponse<AsistenciaResponse[]>>(
      `${BASE_URL}/${estudianteId}/asistencias`
    );

    const { estado, message, data } = response;

    return {
      estado,
      data: data || [],
      message
    };
  } catch (error) {
    console.error('Error al obtener asistencias del estudiante:', error);
    return {
      estado: false,
      data: [],
      message: error instanceof Error ? error.message : 'Error obteniendo asistencias'
    };
  }
}
};