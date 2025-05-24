// src/pages/tutor/Dashboard.tsx
import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Button,
  Divider,
  IconButton,
} from '@mui/material';
import {
  Face as FaceIcon,
  Event as EventIcon,
  Notifications as NotificationsIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

const TutorDashboard: React.FC = () => {
  const { user } = useAuth();

  // Datos de ejemplo para el dashboard
  const students = [
    { id: '1', name: 'Juan Pérez', grade: '1°A', performance: 'Excelente' },
    { id: '2', name: 'María García', grade: '2°B', performance: 'Bueno' },
    { id: '3', name: 'Carlos López', grade: '3°C', performance: 'Regular' },
  ];

  const upcomingEvents = [
    { id: '1', title: 'Reunión de Padres', date: '25 Nov, 2023', time: '18:00 - 19:30' },
    { id: '2', title: 'Entrega de Boletines', date: '15 Dic, 2023', time: '12:00 - 15:00' },
    { id: '3', title: 'Cierre del Año Escolar', date: '22 Dic, 2023', time: '10:00 - 12:00' },
  ];

  const notifications = [
    { id: '1', title: 'Asistencia', message: 'Juan Pérez ha faltado a clases por 2 días consecutivos', time: '2 días' },
    { id: '2', title: 'Calificación', message: 'María García ha obtenido una nota destacada en Matemáticas', time: '1 semana' },
    { id: '3', title: 'Comportamiento', message: 'Carlos López ha mejorado su conducta en clase', time: '2 semanas' },
  ];

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Bienvenido, {user?.nombre || 'Tutor'}
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Estudiantes a mi cargo
            </Typography>
            <List>
              {students.map((student, index) => (
                <React.Fragment key={student.id}>
                  {index > 0 && <Divider />}
                  <ListItem
                    secondaryAction={
                      <Button variant="outlined" size="small">
                        Ver detalles
                      </Button>
                    }
                  >
                    <Avatar sx={{ bgcolor: 'primary.light', mr: 2 }}>{student.name.charAt(0)}</Avatar>
                    <ListItemText
                      primary={student.name}
                      secondary={
                        <>
                          <Typography component="span" variant="body2">
                            Grado: {student.grade}
                          </Typography>
                          <Typography 
                            component="span" 
                            variant="body2" 
                            sx={{ 
                              ml: 2,
                              color: 
                                student.performance === 'Excelente' ? 'success.main' :
                                student.performance === 'Bueno' ? 'primary.main' :
                                'warning.main'
                            }}
                          >
                            Rendimiento: {student.performance}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader
              title="Próximos Eventos"
              action={
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              }
            />
            <CardContent>
              <List>
                {upcomingEvents.map((event, index) => (
                  <React.Fragment key={event.id}>
                    {index > 0 && <Divider />}
                    <ListItem>
                      <EventIcon color="primary" sx={{ mr: 2 }} />
                      <ListItemText
                        primary={event.title}
                        secondary={
                          <>
                            <Typography component="span" variant="body2">
                              {event.date}
                            </Typography>
                            <Typography component="span" variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
                              {event.time}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
              <Button fullWidth variant="outlined" sx={{ mt: 2 }}>
                Ver calendario completo
              </Button>
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardHeader
              title="Notificaciones"
              action={
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              }
            />
            <CardContent>
              <List>
                {notifications.map((notification, index) => (
                  <React.Fragment key={notification.id}>
                    {index > 0 && <Divider />}
                    <ListItem>
                      <NotificationsIcon color="primary" sx={{ mr: 2 }} />
                      <ListItemText
                        primary={notification.title}
                        secondary={
                          <>
                            <Typography component="span" variant="body2">
                              {notification.message}
                            </Typography>
                            <Typography component="span" variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                              Hace {notification.time}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
              <Button fullWidth variant="outlined" sx={{ mt: 2 }}>
                Ver todas las notificaciones
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TutorDashboard;