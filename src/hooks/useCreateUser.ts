import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userRepository } from '../repositories/userRepository';
import { User } from '../mappers/userMapper';

export function useCreateUser() {
  const queryClient = useQueryClient();
  const {
    mutate,
    isPending,
    error,
    data,
  } = useMutation<User, Error, User>({
    mutationFn: userRepository.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return { mutate, isLoading: isPending, error, data };
} 