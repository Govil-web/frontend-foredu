export * from './auth';
export * from './course';
export * from './appModels';

export type {
    BaseApiResponse,
    EstudiantePorGradoApiResponse,
    EstudiantePageApiResponse,
    PageInfo
} from './apiTypes';

export type {
    Course,
    Estudiante
} from './appModels';

export type {
ApiAsistenciaDTO, ApiDetalleAsistenciaByAlumno, TipoEstadoAsistencia, 
ApiAsistenciaRequest, ApiAsistenciaUpdateRequestDto,BackendApiResponse, 
ApiAsistenciaDiariaDTO
} from './asistencia';

export interface ApiResponse<T> {
    estado: boolean;
    message: string;
    data?: T;
    dataIterable?: T[];
}

export interface ApiCourseData {
    id: number;
    curso: string;
    aula: string;
    turno: string;
    profesorNombre?: string;
}

export interface CourseListApiResponse {
    estado: boolean;
    dataIterable?: ApiCourseData[]; // <-- CORREGIDO: de boolean a ApiCourseData[] | undefined
    message?: string; // Opcional: si tu API también devuelve un mensaje
}
export interface ApiEstudianteData { // Asegúrate que esta interfaz esté completa
    id: number;
    nombre: string;
    apellido: string;
    dni: string;
    activo: boolean;
    genero: string;
    gradoId: number;
    gradoNombre: string;
}
export interface ApiEstudiantePorGradoResponse {
  estado: boolean;                        // Indica el estado de la operación desde la API
  message: string;                        // Mensaje descriptivo de la API
  data: ApiEstudianteData[];              // Array de estudiantes (principalmente usado)
}
export interface PaginatedEstudianteContent {
  content: ApiEstudianteData[]; // Array de estudiantes (ApiEstudianteData ya la tienes definida)
  page: PageDetails;
}
export interface ApiEstudiantePageResponse {
   estado: boolean;
  message: string;
  data: PaginatedEstudianteContent; 
}

export interface PageDetails {
  size: number;
  number: number; // Número de página actual
  totalElements: number;
  totalPages: number;
}