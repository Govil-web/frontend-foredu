import { useMutation, useQueryClient } from '@tanstack/react-query';
import { courseRepository } from '../repositories/courseRepository';

export function useDeleteCourse() {
  const queryClient = useQueryClient();
  const {
    mutate,
    isPending,
    error,
    data,
  } = useMutation<void, Error, number>({
    mutationFn: courseRepository.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });

  return { mutate, isLoading: isPending, error, data };
} 