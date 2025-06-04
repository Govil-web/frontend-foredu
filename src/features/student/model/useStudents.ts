import { useQuery } from '@tanstack/react-query';
import { studentApi } from '../api/studentApi';
import { studentMapper } from '../api/studentMapper';
import { Student } from '../types';

export function useStudents(pagina: number = 0, tamano: number = 20) {
  return useQuery({
    queryKey: ['students', pagina, tamano],
    queryFn: async () => {
      const res = await studentApi.getPaginated(pagina, tamano);
      return {
        students: (res.data.content || []).map(studentMapper.fromApi),
        totalPages: res.data.totalPages,
        totalElements: res.data.totalElements,
        size: res.data.size,
        page: res.data.number,
      };
    },
  });
} 