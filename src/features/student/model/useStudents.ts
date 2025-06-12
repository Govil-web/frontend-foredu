import { useQuery } from '@tanstack/react-query';
import { Student } from '../types';
import { studentApi } from '../api/studentApi';

export const useStudents = () => {
  return useQuery<Student[]>({
    queryKey: ['students'],
    queryFn: async () => {
      const response = await studentApi.getAll();
      return response.data;
    },
  });
}; 