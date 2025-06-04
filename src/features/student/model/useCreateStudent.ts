import { useMutation, useQueryClient } from '@tanstack/react-query';
import { studentApi } from '../api/studentApi';
import { studentMapper } from '../api/studentMapper';
import { Student, StudentRequestDTO } from '../types';

export function useCreateStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (student: Student | StudentRequestDTO) => {
      const res = await studentApi.create(studentMapper.toApi(student as Student));
      return studentMapper.fromApi(res.dataIterable);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
} 