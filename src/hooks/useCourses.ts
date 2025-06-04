import { useQuery } from '@tanstack/react-query';
import { courseRepository } from '../repositories/courseRepository';
import { Course } from '../types/appModels';

export function useCourses() {
  const {
    data: courses = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Course[], Error>({
    queryKey: ['courses'],
    queryFn: courseRepository.getAll,
  });

  return { courses, isLoading, error, refetch };
} 