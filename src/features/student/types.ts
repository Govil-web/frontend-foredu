export interface Student {
  id: number;
  nombre: string;
  apellido: string;
  dni?: string;
  activo?: boolean;
  genero?: string;
  gradoId?: number;
  gradoNombre?: string;
  avatarUrl?: string;
  nombreCompleto?: string;
  rol?: string;
  email?: string;
}

export interface StudentRequestDTO {
  id?: number;
  nombre: string;
  apellido: string;
  dni?: string;
  activo?: boolean;
  genero?: string;
  gradoId?: number;
  gradoNombre?: string;
  avatarUrl?: string;
}

export interface StudentResponseDTO {
  id: number;
  nombre: string;
  apellido: string;
  dni?: string;
  activo?: boolean;
  genero?: string;
  gradoId?: number;
  gradoNombre?: string;
  avatarUrl?: string;
} 