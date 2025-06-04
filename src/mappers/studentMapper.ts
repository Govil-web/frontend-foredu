import { ApiEstudianteData } from '../types';
import { Estudiante } from '../types/appModels';

export const studentMapper = {
  fromApi: (apiEst: ApiEstudianteData): Estudiante => ({
    id: apiEst.id,
    nombre: apiEst.nombre,
    apellido: apiEst.apellido,
    dni: apiEst.dni,
    activo: apiEst.activo,
    genero: apiEst.genero,
    gradoId: apiEst.gradoId,
    gradoNombre: apiEst.gradoNombre,
  }),

  toApi: (student: Estudiante): ApiEstudianteData => ({
    id: student.id,
    nombre: student.nombre,
    apellido: student.apellido,
    dni: student.dni || '',
    activo: student.activo ?? true,
    genero: student.genero || '',
    gradoId: student.gradoId || 0,
    gradoNombre: student.gradoNombre || '',
  }),
}; 