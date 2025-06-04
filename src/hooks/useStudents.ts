import { useQuery } from '@tanstack/react-query';
import { studentRepository } from '../repositories/studentRepository';
import { Estudiante } from '../types/appModels';

export function useStudents(pageNumber = 0, pageSize = 10) {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['students', pageNumber, pageSize],
    queryFn: () => studentRepository.getAll(pageNumber, pageSize),
    keepPreviousData: true,
  });

  return {
    students: data?.estudiantes || [],
    totalPages: data?.totalPages || 0,
    totalElements: data?.totalElements || 0,
    isLoading,
    error,
    refetch,
  };
} 