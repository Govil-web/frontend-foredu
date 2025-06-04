import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userRepository } from '../repositories/userRepository';

export function useDeleteUser() {
  const queryClient = useQueryClient();
  const {
    mutate,
    isPending,
    error,
    data,
  } = useMutation<void, Error, number>({
    mutationFn: userRepository.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return { mutate, isLoading: isPending, error, data };
} 