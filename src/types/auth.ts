// src/types/auth.ts

export enum UserRole {
  ADMIN = "ROLE_ADMINISTRADOR",
  PROFESOR = "ROLE_PROFESOR",
  ESTUDIANTE = "ROLE_ESTUDIANTE",
  TUTOR = "ROLE_TUTOR"
  
}

export interface User {
  id: number;
  nombre: string;
  apellido?: string;
  email: string;
  role: UserRole;
  activo?: boolean;
}

export interface UserRequestDTO {
  id?: number;
  email: string;
  nombre: string;
  apellido: string;
  dni: string;
  tipoDocumento: string;
  telefono: string;
  contrasena?: string;
  institucion: string;
}

export interface UserResponseDTO {
  id: number;
  email: string;
  nombre: string;
  tipoDocumento: string;
  dni: string;
  apellido: string;
  telefono: string;
  institucion: string;
  rol: string;
  activo: boolean;
}

export interface LoginCredentials {
  email: string;
  contrasena: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Interfaz para el payload del token JWT
export interface JwtPayload {
  sub: string;      // Email del usuario
  role: string;     // Rol del usuario (ROLE_ADMINISTRADOR, etc.)
  iss: string;      // Emisor del token
  id: number;       // ID del usuario
  exp: number;      // Timestamp de expiración
  nombre: string;   // Nombre del usuario
  iat: number;      // Timestamp de emisión
  jti: string;      // ID único del token
}