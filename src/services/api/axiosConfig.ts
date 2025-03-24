// src/services/api/axiosConfig.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { tokenService } from '../auth/tokenService';

// Tipos para respuestas API
export interface ApiResponse<T = any> {
  estado: boolean;
  message?: string;
  data?: T;
  dataIterable?: T[];
}

// Clase base para configurar y gestionar instancias de Axios
class ApiClient {
  private instance: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL;
    
    this.instance = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 15000, // 15 segundos timeout
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Interceptor de solicitud para añadir token
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        const token = tokenService.getToken();
        if (token) {
          config.headers.set('Authorization', `Bearer ${token}`);
        }
        return config;
      },
      (error: AxiosError): Promise<AxiosError> => {
        console.error('Error en interceptor de solicitud:', error);
        return Promise.reject(error);
      }
    );

    // Interceptor de respuesta para manejar errores
    this.instance.interceptors.response.use(
      (response: AxiosResponse): AxiosResponse => response,
      (error: AxiosError): Promise<AxiosError> => {
        if (error.response?.status === 401) {
          console.warn('Error 401: Token inválido o expirado');
          tokenService.removeToken();
          
          // Redirigir a login si no estamos ya en esa página
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Métodos para operaciones CRUD
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.instance.get<T>(url, config);
      return response.data;
    } catch (error) {
      this.handleError(error as AxiosError);
      throw error;
    }
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.instance.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error as AxiosError);
      throw error;
    }
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.instance.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error as AxiosError);
      throw error;
    }
  }

  public async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.instance.patch<T>(url, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error as AxiosError);
      throw error;
    }
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.instance.delete<T>(url, config);
      return response.data;
    } catch (error) {
      this.handleError(error as AxiosError);
      throw error;
    }
  }

  private handleError(error: AxiosError): void {
    const errorResponse = error.response?.data as { message?: string } | undefined;
    const errorMessage = errorResponse?.message || 'Error en la solicitud';
    
    console.error('Error API:', {
      url: error.config?.url,
      status: error.response?.status,
      message: errorMessage,
    });
  }
}

// Exportamos una única instancia que se usará en toda la aplicación
export const apiClient = new ApiClient();