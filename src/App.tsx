// src/App.tsx
import { CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import importedForeduTheme from './theme/theme';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './contexts/AuthContext';
import { createTheme } from '@mui/material/styles';
import AuthDebugger from './components/debug/AuthDebugger';

// Crear cliente de React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
});

// Definir tema personalizado de Foredu
const foreduTheme = createTheme({
  ...importedForeduTheme,
  palette: {
    primary: {
      main: '#E9511D', // Naranja Foredu
      light: '#FF7A47',
      dark: '#C43C00',
    },
    secondary: {
      main: '#262853', // Azul oscuro Foredu
      light: '#3E4178',
      dark: '#1A1C3F',
    },
    background: {
      default: '#F0F4FA', // Blanco azulado
    },
    text: {
      primary: '#1E1E1E', // Gris pizarra para textos
    },
  },
  typography: {
    fontFamily: '"Noto Sans TC", sans-serif',
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={foreduTheme}>
        <CssBaseline /> {/* Normaliza los estilos CSS */}
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
            {/* Herramienta de depuración en desarrollo */}
            <AuthDebugger />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;