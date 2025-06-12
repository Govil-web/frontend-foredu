import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../api/userApi';
import { userMapper } from '../api/userMapper';
import { User } from '../types';

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user: User) => {
      const res = await userApi.update(userMapper.toApi(user));
      return userMapper.fromApi(res.dataIterable);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
} 