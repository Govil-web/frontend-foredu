import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  CircularProgress, 
  Avatar, 
  IconButton,
  Tabs,
  Tab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  useTheme
} from '@mui/material';
import { 
  Add as AddIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  EventNote as EventNoteIcon,
  Settings as SettingsIcon,
  Visibility as VisibilityIcon,

} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { courseService } from '../../services/courses/courseService';
import { Course } from '../../typeh';

const courseIcons: Record<string, { icon: React.ReactNode, color: string, bgColor: string }> = {
  "PRIMERO": { icon: <SchoolIcon sx={{ fontSize: 40 }} />, color: "#F8D449", bgColor: "#FFF8E1" },
  "SEGUNDO": { icon: <SchoolIcon sx={{ fontSize: 40 }} />, color: "#4E97F3", bgColor: "#E3F2FD" },
  "TERCERO": { icon: <SchoolIcon sx={{ fontSize: 40 }} />, color: "#66BB6A", bgColor: "#E8F5E9" },
  "CUARTO": { icon: <SchoolIcon sx={{ fontSize: 40 }} />, color: "#7E57C2", bgColor: "#EDE7F6" },
  "QUINTO": { icon: <SchoolIcon sx={{ fontSize: 40 }} />, color: "#FF5722", bgColor: "#FBE9E7" },
  "SEXTO": { icon: <SchoolIcon sx={{ fontSize: 40 }} />, color: "#26A69A", bgColor: "#E0F2F1" },
};

// Interfaces para las props
interface CourseCardProps {
  course: Course;
  onClick: () => void;
}

// Componente para la tarjeta de curso
const CourseCard: React.FC<CourseCardProps> = ({ course, onClick }) => {
  const theme = useTheme();
  const courseInfo = courseIcons[course.curso] || { 
    icon: <SchoolIcon sx={{ fontSize: 40 }} />, 
    color: theme.palette.primary.main, 
    bgColor: `${theme.palette.primary.light}20` 
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        borderRadius: '12px', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
          cursor: 'pointer'
        }
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Box sx={{ 
            width: 80, 
            height: 80, 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            bgcolor: courseInfo.bgColor,
            color: courseInfo.color,
            mx: 'auto'
          }}>
            {courseInfo.icon}
          </Box>
          <Typography 
            variant="h5" 
            sx={{ 
              mt: 2, 
              fontWeight: 'bold',
              color: theme.palette.secondary.main
            }}
          >
            {`${course.curso} ${course.aula}`}
          </Typography>
          <Typography 
            variant="subtitle1" 
            color="textSecondary"
            sx={{ mb: 1 }}
          >
            {course.materia}
          </Typography>
          <Chip 
            label={`Turno ${course.turno.toLowerCase()}`} 
            size="small" 
            sx={{ 
              bgcolor: course.turno === 'MAÑANA' ? '#E3F2FD' : 
                      course.turno === 'TARDE' ? '#FFF8E1' : '#EDE7F6',
              color: course.turno === 'MAÑANA' ? '#1976D2' : 
                     course.turno === 'TARDE' ? '#F57C00' : '#5E35B1',
              fontWeight: 500
            }} 
          />
        </Box>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          borderTop: '1px solid #f0f0f0',
          pt: 2
        }}>
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Alumnos
            </Typography>
            <Typography variant="h6">
              {course.contador || '30'}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="subtitle2" color="textSecondary">
              Profesor
            </Typography>
            <Typography variant="h6">
          {`Prof. ${course.profesorNombre ||  'No asignado'}`}
          </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

// Componente Dashboard principal
const Dashboard: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [users, setUsers] = useState<UserResponseDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [tabValue, setTabValue] = useState<number>(0);
  const [filterTurno, setFilterTurno] = useState<string>('Todos');

  // Obtener datos al cargar el componente
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const coursesResponse = await courseService.getAll();
        
        console.log("Respuesta completa de cursos:", coursesResponse);
        console.log("Tipo de dataIterable:", typeof coursesResponse.dataIterable);
        
        if (coursesResponse.estado && Array.isArray(coursesResponse.dataIterable)) {
          const mappedCourses = coursesResponse.dataIterable.map((courseData) => ({
            id: courseData.id,
            curso: courseData.curso,
            aula: courseData.aula,
            materia: courseData.materia,
            turno: courseData.turno,
            profesor: courseData.profesor,
            profesorNombre: courseData.profesorNombre || 'No asignado',
            contador: courseData.contador,
          }));
          
          setCourses(mappedCourses);
        } else {
          console.warn("Respuesta inesperada:", coursesResponse);
          setCourses([]);
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  

  // Manejadores de eventos
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCourseClick = (courseId: number) => {
    navigate(`/admin/courses/${courseId}`);
  };

  const handleCreateCourse = () => {
    navigate('/admin/courses/new');
  };

  // Filtrar cursos por turno
  const filteredCourses = filterTurno === 'Todos' 
    ? courses 
    : courses.filter(course => course.turno === filterTurno.toUpperCase());

  // Datos para las tarjetas de estadísticas
  const statistics = [
    { 
      title: 'Total Cursos', 
      value: courses.length, 
      icon: <SchoolIcon sx={{ fontSize: 32 }} />, 
      color: theme.palette.primary.main,
      bgColor: `${theme.palette.primary.light}20`
    },
    { 
      title: 'Total Estudiantes', 
      value: users.filter(u => u?.rol === UserRole.ESTUDIANTE).length || '120', 
      icon: <PersonIcon sx={{ fontSize: 32 }} />, 
      color: '#4CAF50',
      bgColor: '#E8F5E9'
    },
    { 
      title: 'Total Profesores', 
      value: users.filter(u => u?.rol === UserRole.PROFESOR).length || '7', 
      icon: <GroupIcon sx={{ fontSize: 32 }} />, 
      color: '#2196F3',
      bgColor: '#E3F2FD'
    },
    { 
      title: 'Eventos Activos', 
      value: '8', 
      icon: <EventNoteIcon sx={{ fontSize: 32 }} />, 
      color: '#FF9800',
      bgColor: '#FFF3E0'
    }
  ];

  // Filtro de turnos
  const turnoFilters = ['Todos', 'Mañana', 'Tarde', 'Noche'];

  return (
    <Box sx={{ py: 3, px: { xs: 2, md: 3 } }}>
      {/* Encabezado del dashboard */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', sm: 'center' }, 
          mb: 4
        }}
      >
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 'bold',
            color: theme.palette.secondary.main,
            mb: { xs: 2, sm: 0 }
          }}
        >
          Panel de Administración
        </Typography>
        
        <Button 
          variant="contained" 
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateCourse}
          sx={{ 
            borderRadius: '8px', 
            boxShadow: '0 2px 8px rgba(233, 81, 29, 0.25)',
            bgcolor: theme.palette.primary.main,
            '&:hover': {
              bgcolor: theme.palette.primary.dark
            }
          }}
        >
          Nuevo Curso
        </Button>
      </Box>

      {/* Tarjetas de estadísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statistics.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ 
              borderRadius: '12px', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <Box>
                    <Typography 
                      variant="subtitle2" 
                      color="textSecondary"
                      gutterBottom
                    >
                      {stat.title}
                    </Typography>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontWeight: 'bold', 
                        color: theme.palette.secondary.main 
                      }}
                    >
                      {stat.value}
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    width: 56, 
                    height: 56, 
                    borderRadius: '12px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: stat.color,
                    bgcolor: stat.bgColor
                  }}>
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {/* Tabs de navegación */}
      <Box sx={{ mb: 4 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: theme.palette.primary.main,
            },
            '& .MuiTab-root': {
              minWidth: 'auto',
              textTransform: 'none',
              fontWeight: 500,
              mx: 1,
              '&.Mui-selected': {
                color: theme.palette.primary.main,
              },
            },
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Tab label="Todos los Cursos" />
          <Tab label="Profesores" />
          <Tab label="Estudiantes" />
          <Tab label="Calendario" />
        </Tabs>
      </Box>

      {/* Filtro de turnos */}
      <Box 
        sx={{ 
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          mb: 3
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: { xs: 2, sm: 0 } }}>
          Listado de Cursos
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ mr: 2 }}>
            Filtrar por:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {turnoFilters.map((turno) => (
              <Chip
                key={turno}
                label={turno}
                variant={filterTurno === turno ? "filled" : "outlined"}
                onClick={() => setFilterTurno(turno)}
                sx={{
                  fontWeight: 500,
                  backgroundColor: filterTurno === turno ? theme.palette.primary.main : 'transparent',
                  color: filterTurno === turno ? 'white' : theme.palette.text.primary,
                  '&:hover': {
                    backgroundColor: filterTurno === turno ? theme.palette.primary.dark : 'rgba(0,0,0,0.04)',
                  }
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>

      {/* Contenido principal */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress sx={{ color: theme.palette.primary.main }} />
        </Box>
      ) : tabValue === 0 ? (
        // Vista de cursos
        <Grid container spacing={3}>
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={course.id}>
                <CourseCard course={course} onClick={() => handleCourseClick(course.id)} />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Box 
                sx={{ 
                  textAlign: 'center', 
                  py: 6, 
                  px: 2,
                  bgcolor: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}
              >
                <Typography variant="h6" gutterBottom>
                  No hay cursos disponibles
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                  {filterTurno !== 'Todos' 
                    ? `No hay cursos para el turno ${filterTurno.toLowerCase()}.` 
                    : 'Comienza creando tu primer curso.'}
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleCreateCourse}
                >
                  Crear Curso
                </Button>
              </Box>
            </Grid>
          )}
          
          {/* Tarjeta para añadir nuevo curso */}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                borderRadius: '12px',
                boxShadow: 'none',
                border: '2px dashed #e0e0e0',
                '&:hover': {
                  border: `2px dashed ${theme.palette.primary.main}`,
                  cursor: 'pointer'
                }
              }}
              onClick={handleCreateCourse}
            >
              <CardContent sx={{ textAlign: 'center', py: 5 }}>
                <AddIcon 
                  sx={{ 
                    fontSize: 48, 
                    color: theme.palette.text.secondary,
                    mb: 1
                  }} 
                />
                <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                  Nuevo Curso
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : tabValue === 1 ? (
        // Vista de profesores
        <TableContainer component={Paper} sx={{ borderRadius: '12px' }}>
          <Table>
            <TableHead sx={{ bgcolor: theme.palette.secondary.main }}>
              <TableRow>
                <TableCell sx={{ color: 'white' }}>Nombre</TableCell>
                <TableCell sx={{ color: 'white' }}>Asignatura</TableCell>
                <TableCell sx={{ color: 'white' }}>Curso asignado</TableCell>
                <TableCell sx={{ color: 'white' }}>Contacto</TableCell>
                <TableCell sx={{ color: 'white' }} align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users
                .filter(user => user?.rol === UserRole.PROFESOR)
                .slice(0, 5)
                .map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          sx={{ 
                            mr: 2, 
                            width: 40, 
                            height: 40, 
                            bgcolor: theme.palette.primary.main 
                          }}
                        >
                          {teacher.nombre?.charAt(0) || 'P'}
                        </Avatar>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                            {`${teacher.nombre || ''} ${teacher.apellido || ''}`}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            ID: {teacher.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{'No asignada'}</TableCell>
                    <TableCell>
                      {courses
                        .filter(course => course.profesor === teacher.id)
                        .map(course => 
                          <Chip 
                            key={course.id} 
                            label={`${course.curso} ${course.aula}`}
                            size="small"
                            sx={{ mr: 1, mb: 1 }}
                          />
                        )}
                    </TableCell>
                    <TableCell>{teacher.email || 'No disponible'}</TableCell>
                    <TableCell align="right">
                      <IconButton 
                        color="primary"
                        onClick={() => navigate(`/admin/users/${teacher.id}`)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton 
                        color="secondary"
                        onClick={() => navigate(`/admin/users/${teacher.id}/edit`)}
                      >
                        <SettingsIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        // Vista temporal para otras pestañas
        <Box 
          sx={{ 
            textAlign: 'center', 
            py: 10, 
            px: 2,
            bgcolor: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}
        >
          <Typography variant="h6" gutterBottom>
            {tabValue === 2 ? 'Lista de Estudiantes' : 'Calendario de Eventos'}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Esta sección está en desarrollo. Estará disponible próximamente.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Dashboard;