import { useQuery } from '@tanstack/react-query';
import { userRepository } from '../repositories/userRepository';
import { User } from '../mappers/userMapper';

export function useUser(id: number) {
  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery<User, Error>({
    queryKey: ['user', id],
    queryFn: () => userRepository.getById(id),
    enabled: !!id,
  });

  return { user, isLoading, error, refetch };
} 