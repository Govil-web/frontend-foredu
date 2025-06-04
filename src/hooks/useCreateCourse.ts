import { useMutation, useQueryClient } from '@tanstack/react-query';
import { courseRepository } from '../repositories/courseRepository';
import { Course } from '../types/appModels';

export function useCreateCourse() {
  const queryClient = useQueryClient();
  const {
    mutate,
    isPending,
    error,
    data,
  } = useMutation<Course, Error, Course>({
    mutationFn: courseRepository.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });

  return { mutate, isLoading: isPending, error, data };
} 