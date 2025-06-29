import { useMutation, useQueryClient } from '@tanstack/react-query';
import { attendanceRepository } from '../repositories/attendanceRepository';
import { Attendance } from '../mappers/attendanceMapper';

export function useCreateAttendance() {
  const queryClient = useQueryClient();
  const {
    mutate,
    isPending,
    error,
    data,
  } = useMutation<Attendance, Error, Attendance>({
    mutationFn: attendanceRepository.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendances'] });
    },
  });

  return { mutate, isLoading: isPending, error, data };
} 