// src/hooks/useCourses.ts
import { useQuery} from '@tanstack/react-query';
import { getService } from '../services/api/serviceFactory';
import { Course } from '../types/course';

export const useCourses = () => {

  // Usar el servicio existente a través de la fábrica
  const courseService = getService('course') as { getAll: () => Promise<{ dataIterable: Course[] }> };

  const {
    data: coursesResponse,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['courses'],
    queryFn: () => courseService.getAll(),
  });

  // Extraer los cursos de la respuesta de la API
  const courses = coursesResponse?.dataIterable || [];

  return {
    courses,
    isLoading,
    error,
    refetch
  };
};