import { useQuery } from '@tanstack/react-query';
import { userApi } from '../api/userApi';
import { userMapper } from '../api/userMapper';
import { User } from '../types';

export function useUsers() {
  return useQuery<User[], Error>({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await userApi.getAll();
      return (res.dataIterable || []).map(userMapper.fromApi);
    },
  });
} 