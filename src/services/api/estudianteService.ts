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

  getAll: async (pageNumber: number = 0, pageSize: number = 10): Promise<{
    estudiantes: Estudiante[];
    totalPages: number;
    totalElements: number;
    // Opcional: puedes devolver 'estado' y 'message' si la UI los necesita
    // estado?: boolean;
    // message?: string;
  }> => {
    try {
      // La llamada a la API. apiClient.get<T> debería devolver un objeto donde response.data es de tipo T
      const response = await apiClient.get<ApiEstudiantePageResponse>(`${BASE_URL}`, { // El endpoint puede ser solo BASE_URL o BASE_URL + '/all', etc.
        params: {
          pagina: pageNumber, // Verifica que 'pagina' y 'tamano' sean los nombres de parámetros correctos
          tamano: pageSize
        }
      });

      // Nueva comprobación basada en la estructura correcta
      if (
        !response.data ||              // Falta el cuerpo de la respuesta
        !Array.isArray(response.data.content) || // 'content' no es un array
        !response.data.page       // Falta el objeto 'page'
      ) {
        console.warn('Respuesta inesperada o estructura incorrecta de la API de paginación de estudiantes:', response.data);
        return {
          estudiantes: [],
          totalPages: 0,
          totalElements: 0
        };
      }

      // Extraer datos de la estructura anidada correcta
      const { content, page } = response.data;
      const { totalPages, totalElements } = page;

      const mappedEstudiantes: Estudiante[] = content.map(mapApiEstudianteToModel);

      return {
        // estado: response.data.estado, // Opcional: si quieres pasar el estado de la API
        // message: response.data.message, // Opcional: si quieres pasar el mensaje de la API
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
        // estado: false, // Ejemplo de cómo podrías manejar el estado en caso de error
        // message: 'Error al cargar los estudiantes paginados.' // Ejemplo de mensaje de error
      };
    }
  }
};