import { useQuery } from '@tanstack/react-query';
import { attendanceRepository } from '../repositories/attendanceRepository';
import { Attendance } from '../mappers/attendanceMapper';

export function useAttendances(gradoId: number, fechaInicio: string, fechaFin: string) {
  const {
    data: attendances = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Attendance[], Error>({
    queryKey: ['attendances', gradoId, fechaInicio, fechaFin],
    queryFn: () => attendanceRepository.getAllByGradoAndFecha(gradoId, fechaInicio, fechaFin),
    enabled: !!gradoId && !!fechaInicio && !!fechaFin,
  });

  return { attendances, isLoading, error, refetch };
} 