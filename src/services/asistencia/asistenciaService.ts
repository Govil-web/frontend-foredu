// src/services/asistencia/asistenciaService.ts
import { apiClient } from '../../api/apiClient.ts'; // Asegúrate que la ruta sea correcta
import {
  ApiAsistenciaDTO,
  ApiAsistenciaRequest, // <-- Asegúrate de que este tipo exista en '../../types'
  // ... otros DTOs que puedas necesitar para otras funciones ...
  BackendApiResponse,
  ApiDetalleAsistenciaByAlumno, // <-- Agregado para solucionar el error
} from '../../types'; // Asegúrate que la ruta sea correcta

const BASE_URL = '/asistencia';

export const asistenciaService = {
  getAsistenciasByDateAndGrado: async (
    gradoId: number,
    fechaInicio: string,
    fechaFin: string
  ): Promise<BackendApiResponse<ApiAsistenciaDTO>> => {
    try {
      console.log(`asistenciaService: Llamando a apiClient.get para ${BASE_URL}/fechaAndGrado/${gradoId} con params:`, { fechaInicio, fechaFin });
      
      // Si apiClient.get YA DEVUELVE el cuerpo de la respuesta (tu BackendApiResponse)
      const backendResponse: BackendApiResponse<ApiAsistenciaDTO> = await apiClient.get<BackendApiResponse<ApiAsistenciaDTO>>(
        `${BASE_URL}/fechaAndGrado/${gradoId}`,
        { params: { fechaInicio, fechaFin } }
      );

      console.log("asistenciaService: Respuesta directa de apiClient.get (debería ser BackendApiResponse):", backendResponse);
      
      // Verificamos que la respuesta del backend tenga la estructura esperada
      if (backendResponse && typeof backendResponse.estado !== 'undefined') {
        console.log("asistenciaService: Devolviendo backendResponse:", backendResponse);
        return backendResponse;
      } else {
        console.error("asistenciaService: La respuesta directa de apiClient.get no tiene la estructura BackendApiResponse esperada o es undefined/null.", backendResponse);
        const errorResponse: BackendApiResponse<ApiAsistenciaDTO> = {
            estado: false,
            message: 'Respuesta del servidor con formato inesperado.',
            dataIterable: []
        };
        return errorResponse;
      }
    } catch (error: any) {
      console.error(`asistenciaService: Error en CATCH para /fechaAndGrado/${gradoId}:`, error);
      let errorMessage = 'Error al obtener asistencias por fecha y grado.';
      // Si el error tiene un objeto 'response' y ese objeto tiene 'data' (común en errores de Axios)
      if (error.response && error.response.data && typeof error.response.data.message === 'string') {
        errorMessage = error.response.data.message;
      } else if (typeof error.message === 'string') {
        errorMessage = error.message;
      }

      const errorResponse: BackendApiResponse<ApiAsistenciaDTO> = {
        estado: false,
        message: errorMessage,
        dataIterable: []
      };
      console.log("asistenciaService: Devolviendo objeto de error desde CATCH:", errorResponse);
      return errorResponse;
    }
  },

  // HAZ CAMBIOS SIMILARES EN LAS OTRAS FUNCIONES DEL SERVICIO:
  // Si apiClient.get/post/patch YA DEVUELVEN el cuerpo JSON (BackendApiResponse),
  // entonces no necesitas acceder a una subpropiedad 'data' de la respuesta del apiClient.

  addAsistencia: async (
    asistenciaRequest: ApiAsistenciaRequest
  ): Promise<BackendApiResponse<string | null>> => {
    try {
      const backendResponse = await apiClient.post<BackendApiResponse<string | null>>(`${BASE_URL}/add`, asistenciaRequest);
      if (backendResponse && typeof backendResponse.estado !== 'undefined') {
        return backendResponse;
      }
      console.error("asistenciaService (addAsistencia): Respuesta con formato inesperado.");
      return { estado: false, message: "Respuesta inesperada del servidor al agregar asistencia.", data: null };
    } catch (error: any) {
      console.error("asistenciaService (addAsistencia): Error en CATCH", error);
      return { estado: false, message: error.response?.data?.message || error.message || "Error al agregar.", data: null };
    }
  },

    updateAsistencia: async (
    asistenciaUpdateDto: ApiAsistenciaRequest
  ): Promise<BackendApiResponse<null>> => {
    try {
      const backendResponse = await apiClient.patch<BackendApiResponse<null>>(`${BASE_URL}/update`, asistenciaUpdateDto);
      if (backendResponse && typeof backendResponse.estado !== 'undefined') {
        return backendResponse;
      }
      console.error("asistenciaService (updateAsistencia): Respuesta con formato inesperado.");
      return { estado: false, message: "Respuesta inesperada del servidor al actualizar.", data: null };
    } catch (error: any) {
      console.error("asistenciaService (updateAsistencia): Error en CATCH", error);
      return { estado: false, message: error.response?.data?.message || error.message || "Error al actualizar.", data: null };
    }
  },

  getDetailsByStudent: async (
    alumnoId: number
  ): Promise<BackendApiResponse<ApiDetalleAsistenciaByAlumno | null>> => {
    try {
      const backendResponse = await apiClient.get<BackendApiResponse<ApiDetalleAsistenciaByAlumno | null>>(`${BASE_URL}/detailsByStudent/${alumnoId}`);
      if (backendResponse && typeof backendResponse.estado !== 'undefined') {
        return backendResponse;
      }
      console.error("asistenciaService (getDetailsByStudent): Respuesta con formato inesperado.");
      return { estado: false, message: "Respuesta inesperada del servidor al obtener detalles.", data: null };
    } catch (error: any) {
      console.error("asistenciaService (getDetailsByStudent): Error en CATCH", error);
      return { estado: false, message: error.response?.data?.message || error.message || "Error al obtener detalles.", data: null };
    }
  },

  getAsistenciasByGradoId: async (
    gradoId: number
  ): Promise<BackendApiResponse<ApiAsistenciaDTO>> => {
    try {
      const backendResponse = await apiClient.get<BackendApiResponse<ApiAsistenciaDTO>>(
        `${BASE_URL}/grado/${gradoId}`
      );
      if (backendResponse && typeof backendResponse.estado !== 'undefined') {
        return backendResponse;
      }
      console.error(`asistenciaService (getAsistenciasByGradoId): Respuesta con formato inesperado para grado ${gradoId}.`);
      return { estado: false, message: `Respuesta inesperada del servidor al obtener asistencias para el grado ${gradoId}.`, dataIterable: [] };
    } catch (error: any) {
      console.error(`asistenciaService (getAsistenciasByGradoId): Error en CATCH para grado ${gradoId}`, error);
      const errorResponse: BackendApiResponse<ApiAsistenciaDTO> = {
        estado: false,
        message: error.response?.data?.message || error.message || `Error al obtener asistencias para el grado ${gradoId}.`,
        dataIterable: []
      };
      return errorResponse;
    }
  },
};