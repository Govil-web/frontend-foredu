export interface User {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  activo: boolean;
  dni: string;
  tipoDocumento: string;
  telefono: string;
  institucion: string;
}

export interface UserRequestDTO {
  id?: number;
  nombre: string;
  apellido: string;
  email: string;
  dni: string;
  tipoDocumento: string;
  telefono: string;
  contrasena?: string;
  institucion: string;
}

export interface UserResponseDTO {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  activo: boolean;
  dni: string;
  tipoDocumento: string;
  telefono: string;
  institucion: string;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  PROFESOR = 'PROFESOR',
  ESTUDIANTE = 'ESTUDIANTE',
  TUTOR = 'TUTOR',
} 