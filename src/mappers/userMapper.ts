import { UserRequestDTO, UserResponseDTO } from '../types/auth';

// Modelo de dominio (puedes expandirlo si necesitas lógica extra)
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

export const userMapper = {
  fromApi: (apiUser: UserResponseDTO): User => ({
    id: apiUser.id,
    nombre: apiUser.nombre,
    apellido: apiUser.apellido,
    email: apiUser.email,
    rol: apiUser.rol,
    activo: apiUser.activo,
    dni: apiUser.dni,
    tipoDocumento: apiUser.tipoDocumento,
    telefono: apiUser.telefono,
    institucion: apiUser.institucion,
  }),

  toApi: (user: User): UserRequestDTO => ({
    id: user.id,
    nombre: user.nombre,
    apellido: user.apellido,
    email: user.email,
    dni: user.dni,
    tipoDocumento: user.tipoDocumento,
    telefono: user.telefono,
    institucion: user.institucion,
  }),
}; 