import { apiClient } from '../api/apiClient';
import { courseMapper } from '../mappers/courseMapper';
import { Course } from '../types/appModels';
import { ApiCourseData, CourseListApiResponse } from '../types';

const BASE_URL = '/curso';

export const courseRepository = {
  async getAll(): Promise<Course[]> {
    const response = await apiClient.get<CourseListApiResponse>(`${BASE_URL}/getAll`);
    const dataIterable = response.dataIterable || [];
    return dataIterable.map(courseMapper.fromApi);
  },

  async getById(id: number): Promise<Course> {
    const response = await apiClient.get<{ data: ApiCourseData }>(`${BASE_URL}/${id}`);
    return courseMapper.fromApi(response.data);
  },

  async create(course: Course): Promise<Course> {
    const dto: ApiCourseData = courseMapper.toApi(course);
    const response = await apiClient.post<{ data: ApiCourseData }>(`${BASE_URL}/add`, dto);
    return courseMapper.fromApi(response.data);
  },

  async update(course: Course): Promise<Course> {
    const dto: ApiCourseData = courseMapper.toApi(course);
    const response = await apiClient.put<{ data: ApiCourseData }>(`${BASE_URL}/update`, dto);
    return courseMapper.fromApi(response.data);
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`${BASE_URL}/${id}`);
  },
}; 