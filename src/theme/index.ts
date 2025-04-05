// src/theme/index.ts
import { createTheme, Theme } from '@mui/material/styles';
import { palette } from './palette';
import { typography } from './typography';
import { shape } from './shape';
import { components } from './components';

// Declara módulos adicionales para ampliar la paleta de colores
declare module '@mui/material/styles' {
  interface Palette {
    sidebar: Palette['primary'];
  }
  
  interface PaletteOptions {
    sidebar?: PaletteOptions['primary'];
  }
}

// Construye y exporta el tema de Foredu
const foreduTheme: Theme = createTheme({
  palette,
  typography,
  shape,
  components,
});

export default foreduTheme;