import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userRepository } from '../repositories/userRepository';
import { User } from '../mappers/userMapper';

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const {
    mutate,
    isPending,
    error,
    data,
  } = useMutation<User, Error, User>({
    mutationFn: userRepository.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return { mutate, isLoading: isPending, error, data };
} 