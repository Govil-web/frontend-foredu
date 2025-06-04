import { useQuery } from '@tanstack/react-query';
import { attendanceRepository } from '../repositories/attendanceRepository';
import { Attendance } from '../mappers/attendanceMapper';

export function useAttendance(id: number) {
  const {
    data: attendance,
    isLoading,
    error,
    refetch,
  } = useQuery<Attendance, Error>({
    queryKey: ['attendance', id],
    queryFn: () => attendanceRepository.getById(id),
    enabled: !!id,
  });

  return { attendance, isLoading, error, refetch };
} 