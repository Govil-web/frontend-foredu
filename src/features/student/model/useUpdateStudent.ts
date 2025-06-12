import { useMutation, useQueryClient } from '@tanstack/react-query';
import { studentApi } from '../api/studentApi';
import { studentMapper } from '../api/studentMapper';
import { Student } from '../types';

export function useUpdateStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (student: Student) => {
      const res = await studentApi.update(studentMapper.toApi(student));
      return studentMapper.fromApi(res.dataIterable);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
} 