// types/apiTypes.ts

// Respuesta base
export interface BaseApiResponse {
    estado: boolean;
    message: string;
}

// =========================
// CURSOS
// =========================
export interface ApiCourseData {
    id: number;
    curso: string;
    aula: string;
    materia: string;
    turno: string;
    profesor: string;
    profesorNombre?: string;
    contador: number;
}

export interface CourseListApiResponse extends BaseApiResponse {
    data: ApiCourseData[];
    dataIterable: ApiCourseData[];
}


// =========================
// ESTUDIANTES
// =========================
export interface ApiEstudianteData {
    id: number;
    nombre: string;
    apellido: string;
    dni: string;
    activo: boolean;
    genero: string;
    gradoId: number;
    gradoNombre: string;
}

export interface EstudiantePorGradoApiResponse extends BaseApiResponse {
    data: ApiEstudianteData[];
}

export interface PageInfo {
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
}

export interface EstudiantePageApiResponse extends BaseApiResponse {
    content: ApiEstudianteData[];
    page: PageInfo;
}



