// src/services/api/apiResponse.ts
import axios from 'axios';

export class ApiError extends Error {
    public readonly status: number;
    public readonly data: any;
  
    constructor(message: string, status: number, data?: any) {
      super(message);
      this.name = 'ApiError';
      this.status = status;
      this.data = data;
    }
  }
  
  // Middleware para manejo global de errores
  export const handleApiError = (error: unknown): never => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.message || error.message || 'Error desconocido';
      const data = error.response?.data;
      
      throw new ApiError(message, status, data);
    }
    
    throw error instanceof Error 
      ? error 
      : new Error(String(error));
  };
  