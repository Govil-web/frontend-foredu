import { useQuery } from '@tanstack/react-query';
import { userRepository } from '../repositories/userRepository';
import { User } from '../mappers/userMapper';

export function useUsers() {
  const {
    data: users = [],
    isLoading,
    error,
    refetch,
  } = useQuery<User[], Error>({
    queryKey: ['users'],
    queryFn: userRepository.getAll,
  });

  return { users, isLoading, error, refetch };
} 