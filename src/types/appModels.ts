export interface Course {
   id: number;
  curso: string;
  aula: string;
  turno: string;
  profesorNombre: string;
  contador: number;
  padresCount: number;
  profesoresCount: number;
}

export interface Estudiante {
  id: number;
  nombre: string;
  apellido: string;
  dni?: string;
  activo?: boolean;
  genero?: string;
  gradoId?: number;
  gradoNombre?: string;
  avatarUrl?: string; // Important for display
  nombreCompleto?: string; // Often added as a helper
}