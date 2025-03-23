// src/pages/admin/Dashboard.tsx
import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Button, 
  useTheme,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  alpha,
  Avatar
} from '@mui/material';
import { 
  Add as AddIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  CalendarMonth as CalendarIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import StyledCard from '../../components/ui/StyledCard';
import StatCard from '../../components/ui/StatCard';
import { useAuth } from '../../hooks/useAuth';

// Importar datos mock
import { mockCoursePerformance, mockStudentAttendance } from '../../mock-data/courses';

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
    { 
      title: 'Tareas Pendientes', 
      value: 124, 
      icon: <AssignmentIcon />, 
      color: theme.palette.warning.main,
      trend: -3.5,
      subtitle: '15 para esta semana'
    },
  ];

  const handleAddUser = () => {
    console.log('Redireccionar a la página de agregar usuario');
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap',
        mb: 4
      }}>
        <SectionHeading variant="h4">
          Panel de Administración
        </SectionHeading>
       
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
                ¡Bienvenido de vuelta, {user?.nombre || 'Administrador'}!
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
          <Grid item xs={12} sm={6} md={3} key={index}>
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
      
      {/* Reportes rápidos */}
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: theme.palette.secondary.main }}>
        Reportes Rápidos
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Asistencia Mensual" 
              avatar={<BarChartIcon color="primary" />}
              action={
                <Box>
                  <Button 
                    startIcon={<BarChartIcon />} 
                    size="small"
                  >
                    Ver completo
                  </Button>
                </Box>
              }
            />
            <Divider />
            <CardContent>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Mes</TableCell>
                      <TableCell align="right">Porcentaje de Asistencia</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockStudentAttendance.map((row) => (
                      <TableRow key={row.month}>
                        <TableCell component="th" scope="row">
                          {row.month}
                        </TableCell>
                        <TableCell align="right">{row.percentage}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Rendimiento por Curso" 
              avatar={<PieChartIcon color="secondary" />}
              action={
                <Box>
                  <Button 
                    startIcon={<PieChartIcon />} 
                    size="small"
                  >
                    Ver completo
                  </Button>
                </Box>
              }
            />
            <Divider />
            <CardContent>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Curso</TableCell>
                      <TableCell align="right">Promedio</TableCell>
                      <TableCell align="right">% Aprobados</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockCoursePerformance.map((row) => (
                      <TableRow key={row.course}>
                        <TableCell component="th" scope="row">
                          {row.course}
                        </TableCell>
                        <TableCell align="right">{row.average}</TableCell>
                        <TableCell align="right">{row.passing}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Calendario y actividades */}
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: theme.palette.secondary.main }}>
        Actividad Reciente
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardHeader 
              title="Próximos Eventos" 
              avatar={<CalendarIcon color="primary" />}
            />
            <Divider />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
                  <Box sx={{ 
                    width: 50, 
                    height: 50, 
                    bgcolor: alpha(theme.palette.primary.main, 0.1), 
                    borderRadius: 1, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    mr: 2
                  }}>
                    <Typography fontWeight="bold" color="primary.main">25</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Reunión de Profesores</Typography>
                    <Typography variant="caption" color="text.secondary">25 Mar, 2025 • 10:00 AM</Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
                  <Box sx={{ 
                    width: 50, 
                    height: 50, 
                    bgcolor: alpha(theme.palette.success.main, 0.1), 
                    borderRadius: 1, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    mr: 2
                  }}>
                    <Typography fontWeight="bold" color="success.main">30</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Entrega de Calificaciones</Typography>
                    <Typography variant="caption" color="text.secondary">30 Mar, 2025 • Todo el día</Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
                  <Box sx={{ 
                    width: 50, 
                    height: 50, 
                    bgcolor: alpha(theme.palette.warning.main, 0.1), 
                    borderRadius: 1, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    mr: 2
                  }}>
                    <Typography fontWeight="bold" color="warning.main">2</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Inicio de Período</Typography>
                    <Typography variant="caption" color="text.secondary">2 Abr, 2025 • 8:00 AM</Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardHeader 
              title="Actividades Recientes" 
              avatar={<PersonIcon color="primary" />}
            />
            <Divider />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
                  <Box sx={{ mr: 2 }}>
                    <Avatar sx={{ bgcolor: theme.palette.primary.main }}>JD</Avatar>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Juan Díaz actualizó su perfil</Typography>
                    <Typography variant="caption" color="text.secondary">Hace 2 horas</Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
                  <Box sx={{ mr: 2 }}>
                    <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>ML</Avatar>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">María López añadió nuevos materiales</Typography>
                    <Typography variant="caption" color="text.secondary">Hace 4 horas</Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
                  <Box sx={{ mr: 2 }}>
                    <Avatar sx={{ bgcolor: theme.palette.success.main }}>CR</Avatar>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Carlos Ruiz publicó calificaciones</Typography>
                    <Typography variant="caption" color="text.secondary">Hace 1 día</Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;