// src/types/asistencia.ts

/**
 * Corresponde a AsistenciaDTO.java
 * Representa un registro de asistencia para un estudiante en una fecha específica.
 * Usado en respuestas como getAsistenciasByDateAndGrado.
 */
export interface ApiAsistenciaDTO {
  id: number;
  fecha: string; // LocalDate se serializa como "YYYY-MM-DD"
  justificativos: string | null; // Asumo que puede ser null si no hay justificativo
  porcentajeAsistencia?: number; // Podría ser el % general del alumno hasta esa fecha
  nombreEstudiante?: string; // Nombre del estudiante asociado a este registro
  estado: string; // Ej: "PRESENTE", "AUSENTE", "TARDE", "JUSTIFICADO_AUSENTE". Definir como union type después.
  estudiante: number; // ID del estudiante (mapeado desde 'estudiante')
  grado: number; // ID del grado (mapeado desde 'grado')
}

/**
 * Estados de asistencia posibles (ajusta según tu lógica de negocio)
 * Estos se usarán para dar tipado fuerte al campo 'estado'.
 */
export type TipoEstadoAsistencia =
  | 'PRESENTE'
  | 'AUSENTE'
  | 'TARDE'
  | 'JUSTIFICADO' 
  |'NO_REGISTRADA';// Estado para el frontend si no hay registro
    


/**
 * Corresponde a AsistenciaRequest.java
 * Para registrar asistencias de múltiples alumnos para un grado en una fecha (la fecha se infiere en backend como "hoy").
 */
export interface ApiAsistenciaRequest {
  asistencia: Record<number, string>; // Map<Long, String> -> { [alumnoId: number]: estado }
  gradoId: number;
}

/**
 * Corresponde a AsistenciaRequestDto.java (para actualizar una asistencia existente)
 */
export interface ApiAsistenciaUpdateRequestDto {
  id: number; // ID del registro de asistencia a actualizar
  estado: string; // Nuevo estado
  justificativos?: string | null;
  estudianteId: number; // ID del estudiante (mapeado desde 'estudiante')
  gradoId: number; // ID del grado (mapeado desde 'grado')
}

/**
 * Corresponde a DetalleAsistenciaByAlumno.java
 * Para obtener el resumen/detalle de asistencias de un alumno.
 */
export interface ApiDetalleAsistenciaByAlumno {
  idEstudiante: number;
  nombreEstudiante: string;
  grado: string; // Nombre del grado
  AsistenciasPresente: number;
  AsistenciasAusente: number;
  AsistenciasJustificadas: number; // Este podría ser la suma de ausencias y tardes justificadas
  AsistenciasTarde: number;
  clasesVistasDelGrado: number; // Total de días de clase que debería haber asistido
  porcentajeDeAsistencias: number;
}

// Interfaz genérica para la respuesta de tu API (si no la tienes definida globalmente)
// Asegúrate que coincida con la estructura de ApiResponseDto.java
export interface BackendApiResponse<TItem> { // TItem es el tipo del objeto individual en la lista
  estado: boolean;
  message: string;
  data?: TItem; // Para respuestas con un solo objeto
  dataIterable?: TItem[]; // Para respuestas con una lista de objetos
}

export interface ApiAsistenciaDiariaDTO {
  id: number;
  fecha: string; // LocalDate se serializa como "YYYY-MM-DD"
  asistencias: ApiAsistenciaDTO[]; // Lista de asistencias para esa fecha
  porcentajeAsistencia?: number; // Podría ser el % general del grado hasta esa fecha
  nombreGrado?: string; // Nombre del grado asociado a este registro
}