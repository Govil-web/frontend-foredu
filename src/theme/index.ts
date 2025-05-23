import { createTheme, Theme } from '@mui/material/styles';
import { palette } from './palette';
import { typography } from './typography';
import { shape } from './shape';
import { components } from './components';

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
  components: components
});

export default foreduTheme;