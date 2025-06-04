import { useMutation, useQueryClient } from '@tanstack/react-query';
import { studentRepository } from '../repositories/studentRepository';

export function useDeleteStudent() {
  const queryClient = useQueryClient();
  const {
    mutate,
    isPending,
    error,
    data,
  } = useMutation<void, Error, number>({
    mutationFn: studentRepository.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });

  return { mutate, isLoading: isPending, error, data };
} 