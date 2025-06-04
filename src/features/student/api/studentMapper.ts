import { Student, StudentRequestDTO, StudentResponseDTO } from '../types';

export const studentMapper = {
  fromApi: (apiStudent: StudentResponseDTO): Student => ({
    id: apiStudent.id,
    nombre: apiStudent.nombre,
    apellido: apiStudent.apellido,
    dni: apiStudent.dni,
    activo: apiStudent.activo,
    genero: apiStudent.genero,
    gradoId: apiStudent.gradoId,
    gradoNombre: apiStudent.gradoNombre,
    avatarUrl: apiStudent.avatarUrl,
    nombreCompleto: `${apiStudent.nombre} ${apiStudent.apellido}`,
    rol: 'ROLE_ESTUDIANTE',
  }),

  toApi: (student: Student): StudentRequestDTO => ({
    id: student.id,
    nombre: student.nombre,
    apellido: student.apellido,
    dni: student.dni,
    activo: student.activo,
    genero: student.genero,
    gradoId: student.gradoId,
    gradoNombre: student.gradoNombre,
    avatarUrl: student.avatarUrl,
  }),
}; 