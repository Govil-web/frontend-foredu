// src/App.tsx
import { CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import foreduTheme from './theme/theme'; // Importa directamente el tema completo
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './contexts/AuthContext';

// Importar CSS global con la fuente Candal
import './index.css'; // Asegúrate de que este archivo tenga el contenido que te recomendé

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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={foreduTheme}>
        <CssBaseline /> {/* Normaliza los estilos CSS */}
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
            {/* Herramienta de depuración en desarrollo */}
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;