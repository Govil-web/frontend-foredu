import { useQuery } from '@tanstack/react-query';
import { courseRepository } from '../repositories/courseRepository';
import { Course } from '../types/appModels';

export function useCourse(id: number) {
  const {
    data: course,
    isLoading,
    error,
    refetch,
  } = useQuery<Course, Error>({
    queryKey: ['course', id],
    queryFn: () => courseRepository.getById(id),
    enabled: !!id,
  });

  return { course, isLoading, error, refetch };
} 