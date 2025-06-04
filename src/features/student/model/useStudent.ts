import { useQuery } from '@tanstack/react-query';
import { studentApi } from '../api/studentApi';
import { studentMapper } from '../api/studentMapper';
import { Student } from '../types';

export function useStudent(id: number) {
  return useQuery<Student, Error>({
    queryKey: ['student', id],
    queryFn: async () => {
      const res = await studentApi.getById(id);
      return studentMapper.fromApi(res.dataIterable);
    },
    enabled: !!id,
  });
} 