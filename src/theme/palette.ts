// src/theme/palette.ts
import { PaletteOptions } from '@mui/material/styles';

/**
 * Paleta de colores para el tema de Foredu
 * Define los colores principales de la marca y los colores funcionales
 */
export const palette: PaletteOptions = {
  primary: {
    main: '#E9511D', // Naranja Foredu
    light: '#FF7A47',
    dark: '#C43C00',
    contrastText: '#FFFFFF',
  },

  // Colores para los iconos de cursos
  courseIcons: {
    PRIMERO: { color: '#F8D449', bgColor: '#FFF8E1' },
    SEGUNDO: { color: '#4E97F3', bgColor: '#E3F2FD' },
    TERCERO: { color: '#66BB6A', bgColor: '#E8F5E9' },
    CUARTO: { color: '#7E57C2', bgColor: '#EDE7F6' },
    QUINTO: { color: '#FF5722', bgColor: '#FBE9E7' },
    SEXTO: { color: '#26A69A', bgColor: '#E0F2F1' },
    SEPTIMO: { color: '#FF7043', bgColor: '#FFEBEE' },
    OCTAVO: { color: '#AB47BC', bgColor: '#F3E5F5' },
    NOVENO: { color: '#FFCA28', bgColor: '#FFFDE7' },
    DECIMO: { color: '#FF7043', bgColor: '#FFEBEE' },
  },
  secondary: {
    main: '#262853', // Azul oscuro Foredu
    light: '#3E4178',
    dark: '#1A1C3F',
    contrastText: '#FFFFFF',
  },
  sidebar: {
    main: '#F9FAFB', // Fondo gris claro para sidebar
    light: '#FFFFFF',
    dark: '#E0E0E0',
    contrastText: '#1E1E1E',
  },
  background: {
    default: '#EAEDF5CC', // Fondo principal
    paper: '#FFFFFF',

  },
  text: {
    primary: '#717171', 
    secondary: '#637381',
  },
  error: {
    main: '#F44336',
  },
  warning: {
    main: '#FF9800',
  },
  info: {
    main: '#2196F3',
  },
  success: {
    main: '#4CAF50',
  },
  // Agregamos un objeto con variables de color semánticas para referencias
  // en components y otras partes de la aplicación
  grey: {
    50: '#F9FAFB',
    100: '#F4F6F8',
    200: '#E0E0E0',
    300: '#DFE3E8',
    400: '#C4CDD5',
    500: '#919EAB',
    600: '#637381',
    700: '#454F5B',
    800: '#212B36',
    900: '#161C24',
  }
};
