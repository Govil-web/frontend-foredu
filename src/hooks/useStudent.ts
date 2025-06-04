import { useQuery } from '@tanstack/react-query';
import { studentRepository } from '../repositories/studentRepository';
import { Estudiante } from '../types/appModels';

export function useStudent(id: number) {
  const {
    data: student,
    isLoading,
    error,
    refetch,
  } = useQuery<Estudiante, Error>({
    queryKey: ['student', id],
    queryFn: () => studentRepository.getById(id),
    enabled: !!id,
  });

  return { student, isLoading, error, refetch };
} 