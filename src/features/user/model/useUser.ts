import { useQuery } from '@tanstack/react-query';
import { userApi } from '../api/userApi';
import { userMapper } from '../api/userMapper';
import { User } from '../types';

export function useUser(id: number) {
  return useQuery<User, Error>({
    queryKey: ['user', id],
    queryFn: async () => {
      const res = await userApi.getById(id);
      return userMapper.fromApi(res.dataIterable);
    },
    enabled: !!id,
  });
} 