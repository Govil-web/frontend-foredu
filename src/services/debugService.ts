// src/services/debugService.ts

/**
 * Servicio de depuración para la aplicación
 * Permite habilitar o deshabilitar los mensajes de depuración globalmente
 */
class DebugService {
    private isEnabled: boolean = false;
  
    /**
     * Inicializa el servicio según la configuración del entorno
     */
    constructor() {
      // Habilitar depuración solo en entorno de desarrollo
      this.isEnabled = import.meta.env.DEV && 
        (import.meta.env.VITE_DEBUG_MODE === 'true' || localStorage.getItem('debug_mode') === 'true');
    }
  
    /**
     * Habilita o deshabilita la depuración
     * @param enabled Estado de la depuración
     */
    enable(enabled: boolean): void {
      this.isEnabled = enabled;
      
      if (enabled) {
        localStorage.setItem('debug_mode', 'true');
      } else {
        localStorage.removeItem('debug_mode');
      }
    }
  
    /**
     * Registra un mensaje en la consola si la depuración está habilitada
     * @param message Mensaje a registrar
     * @param data Datos adicionales
     */
    log(message: string, ...data: any[]): void {
      if (this.isEnabled) {
        console.log(`[DEBUG] ${message}`, ...data);
      }
    }
  
    /**
     * Registra un error en la consola si la depuración está habilitada
     * @param message Mensaje de error
     * @param data Datos adicionales
     */
    error(message: string, ...data: any[]): void {
      if (this.isEnabled) {
        console.error(`[DEBUG ERROR] ${message}`, ...data);
      }
    }
  
    /**
     * Registra una advertencia en la consola si la depuración está habilitada
     * @param message Mensaje de advertencia
     * @param data Datos adicionales
     */
    warn(message: string, ...data: any[]): void {
      if (this.isEnabled) {
        console.warn(`[DEBUG WARN] ${message}`, ...data);
      }
    }
  
    /**
     * Registra información en la consola si la depuración está habilitada
     * @param message Información
     * @param data Datos adicionales
     */
    info(message: string, ...data: any[]): void {
      if (this.isEnabled) {
        console.info(`[DEBUG INFO] ${message}`, ...data);
      }
    }
    
    /**
     * Activa temporalmente la depuración para una operación específica
     * @param callback Función a ejecutar con depuración habilitada
     */
    withDebug<T>(callback: () => T): T {
      const prevState = this.isEnabled;
      this.isEnabled = true;
      
      try {
        return callback();
      } finally {
        this.isEnabled = prevState;
      }
    }
  }
  
  // Exportamos una instancia singleton del servicio
  export const debugService = new DebugService();