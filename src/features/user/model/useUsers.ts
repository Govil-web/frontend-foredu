import { useQuery } from '@tanstack/react-query';
import { User } from '../types';
import { userApi } from '../api/userApi';

export const useUsers = () => {
  return useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        const response = await userApi.getAll();
        if (response?.dataIterable) {
          return response.dataIterable;
        }
        return [];
      } catch (error) {
        console.error('Error fetching users:', error);
        return [];
      }
    },
  });
}; 