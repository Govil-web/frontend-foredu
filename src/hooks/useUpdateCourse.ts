import { useMutation, useQueryClient } from '@tanstack/react-query';
import { courseRepository } from '../repositories/courseRepository';
import { Course } from '../types/appModels';

export function useUpdateCourse() {
  const queryClient = useQueryClient();
  const {
    mutate,
    isPending,
    error,
    data,
  } = useMutation<Course, Error, Course>({
    mutationFn: courseRepository.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });

  return { mutate, isLoading: isPending, error, data };
} 