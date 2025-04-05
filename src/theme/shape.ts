// src/theme/shape.ts
import { Theme } from '@mui/material/styles';

/**
 * Configuración de formas para el tema de Foredu
 * Define bordes y radios para componentes
 */
export const shape = {
  borderRadius: 8,
};

// Utilizamos el tipo que MUI espera en createTheme
export type ShapeOptions = Theme['shape'];