import { useMutation, useQueryClient } from '@tanstack/react-query';
import { attendanceRepository } from '../repositories/attendanceRepository';

export function useDeleteAttendance() {
  const queryClient = useQueryClient();
  const {
    mutate,
    isPending,
    error,
    data,
  } = useMutation<void, Error, number>({
    mutationFn: attendanceRepository.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendances'] });
    },
  });

  return { mutate, isLoading: isPending, error, data };
} 