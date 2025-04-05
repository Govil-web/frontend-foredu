// src/App.tsx
import { useEffect } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import foreduTheme from './theme';
import AppRoutes from './routes/AppRoutes';
import { useAuthStore } from './store/authStore';

// Importar CSS global
import './index.css';

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
  const { checkAuth } = useAuthStore();

  // Verificar autenticación al iniciar la aplicación
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={foreduTheme}>
        <CssBaseline /> {/* Normaliza los estilos CSS */}
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;