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
    default: '#F9FAFB', // Fondo principal
    paper: '#FFFFFF',
    main: '#EAEDF5CC'
  },
  text: {
    primary: '#1E1E1E', 
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