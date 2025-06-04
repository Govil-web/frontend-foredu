import { useMutation, useQueryClient } from '@tanstack/react-query';
import { studentRepository } from '../repositories/studentRepository';
import { Estudiante } from '../types/appModels';

export function useCreateStudent() {
  const queryClient = useQueryClient();
  const {
    mutate,
    isPending,
    error,
    data,
  } = useMutation<Estudiante, Error, Estudiante>({
    mutationFn: studentRepository.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });

  return { mutate, isLoading: isPending, error, data };
} 