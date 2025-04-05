// src/services/api/serviceFactory.ts
import { AxiosHttpClient, HttpClient } from './apiClient';
import { authService } from './authService';
import { userService } from './userService';
import { courseService } from '../courses/courseService';

export class ServiceFactory {
  private static instance: ServiceFactory;
  private httpClient: HttpClient;
  private services: Record<string, any> = {};

  private constructor() {
    const baseURL = import.meta.env.VITE_API_URL || '/api';
    this.httpClient = new AxiosHttpClient(baseURL);
    
    // Inicializar los servicios existentes
    this.services.auth = authService;
    this.services.user = userService;
    this.services.course = courseService;
  }

  public static getInstance(): ServiceFactory {
    if (!ServiceFactory.instance) {
      ServiceFactory.instance = new ServiceFactory();
    }
    return ServiceFactory.instance;
  }

  public getService<T>(serviceName: string): T {
    if (!this.services[serviceName]) {
      throw new Error(`Service ${serviceName} not found`);
    }
    return this.services[serviceName] as T;
  }
}

// Exportamos una función de conveniencia para obtener servicios
export const getService = <T>(serviceName: string): T => {
  return ServiceFactory.getInstance().getService<T>(serviceName);
};