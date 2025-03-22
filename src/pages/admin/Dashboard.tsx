// src/pages/admin/Dashboard.tsx
import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Button, 
  alpha,
} from '@mui/material';
import { 
  Add as AddIcon,
  School as SchoolIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import StyledCard from '../../components/ui/StyledCard';
import StatCard from '../../components/ui/StatCard';
import { useAuth } from '../../hooks/useAuth';
import { styled } from '@mui/material/styles';

// Importar datos mock
import { mockCoursePerformance } from '../../mock-data/courses';

const SectionHeading = styled(Typography)(({ theme }) => ({
  position: 'relative',
  display: 'inline-block',
  marginBottom: theme.spacing(3),
  fontWeight: 'bold',
  color: theme.palette.secondary.main,
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-8px',
    left: '0',
    width: '40px',
    height: '4px',
    backgroundColor: theme.palette.primary.main,
    borderRadius: '2px',
  },
}));

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const theme = useTheme();
  
  // Datos de ejemplo para el dashboard
  const stats = [
    { 
      title: 'Total Estudiantes', 
      value: 1254, 
      icon: <PersonIcon />, 
      color: theme.palette.primary.main,
      trend: 4.2,
      subtitle: '28 nuevos este mes'
    },
    { 
      title: 'Total Profesores', 
      value: 48, 
      icon: <PersonIcon />, 
      color: theme.palette.secondary.main,
      trend: 1.5,
      subtitle: '3 nuevos este mes'
    },
    { 
      title: 'Cursos Activos', 
      value: 36, 
      icon: <SchoolIcon />, 
      color: theme.palette.success.main,
      trend: 2.8,
      subtitle: '5 cursos nuevos'
    },
  ];

  return (
    <Box sx={{ position: 'relative' }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap',
        mb: 4
      }}>
        <SectionHeading variant="h4" as="h1">
          Panel de Administración
        </SectionHeading>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          color="primary"
          sx={{ 
            boxShadow: theme => `0 4px 10px ${alpha(theme.palette.primary.main, 0.2)}`,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: theme => `0 6px 15px ${alpha(theme.palette.primary.main, 0.3)}`,
            }
          }}
        >
          Nuevo Usuario
        </Button>
      </Box>
      
      {/* Mensaje de bienvenida */}
      <StyledCard 
        sx={{ 
          mb: 4, 
          background: theme => `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
          color: 'white',
          boxShadow: theme => `0 8px 20px ${alpha(theme.palette.secondary.main, 0.2)}`
        }}
        withDecoration
      >
        <Box sx={{ position: 'relative', zIndex: 1, py: 3, px: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                ¡Bienvenido de vuelta, {user?.nombre}!
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
                Tienes 3 notificaciones pendientes y 2 tareas por completar hoy.
              </Typography>
              <Button 
                variant="contained" 
                color="primary"
                size="small"
                sx={{ 
                  mt: 1,
                  boxShadow: theme => `0 4px 10px ${alpha(theme.palette.primary.main, 0.3)}`
                }}
              >
                Ver resumen
              </Button>
            </Grid>
          </Grid>
        </Box>
      </StyledCard>
      
      {/* Tarjetas de estadísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} md={4} key={index}>
            <StatCard
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              trend={stat.trend}
              subtitle={stat.subtitle}
            />
          </Grid>
        ))}
      </Grid>
      
      {/* Resto del componente... */}
    </Box>
  );
};

export default AdminDashboard;