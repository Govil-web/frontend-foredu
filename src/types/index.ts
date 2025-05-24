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
export interface ApiEstudiantePageResponse {
    content: ApiEstudianteData[];
    totalPages: number;
    totalElements: number;
    number: number; // Número de página actual (usualmente basado en 0)
    size: number;   // Tamaño de la página
    // Podría haber otras propiedades como: first, last, sort, numberOfElements, empty
}