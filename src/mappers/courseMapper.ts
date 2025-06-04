import { ApiCourseData } from '../types';
import { Course } from '../types/appModels';

export const courseMapper = {
  fromApi: (apiCourse: ApiCourseData): Course => ({
    id: apiCourse.id,
    curso: apiCourse.curso,
    aula: apiCourse.aula,
    turno: apiCourse.turno,
    profesorNombre: apiCourse.profesorNombre || '',
    contador: 0,
    padresCount: 0,
    profesoresCount: 0,
  }),

  toApi: (course: Course): ApiCourseData => ({
    id: course.id,
    curso: course.curso,
    aula: course.aula,
    turno: course.turno,
    profesorNombre: course.profesorNombre,
  }),
}; 