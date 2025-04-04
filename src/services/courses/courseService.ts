// src/services/courses/courseService.ts
import { apiClient } from "../api/axiosConfig";
import { Course, ApiResponse } from "../../types/course";

export const courseService = {
  getAll: async () => {
    try {
      const response = await apiClient.get<ApiResponse<Course>>("/grado/getAll");
      
      // Logging detallado
      console.log("Respuesta del servicio de cursos:", response);
      
      return response;
    } catch (error) {
      console.error("Error al obtener cursos:", error);
      return {
        estado: false,
        message: "Error al obtener cursos",
        dataIterable: [],
      };
    }
  },
};