// src/pages/student/Dashboard.tsx
import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  LinearProgress,
  Chip,
  Avatar
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Book as BookIcon,
  Event as EventIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';

// Datos simulados
const upcomingAssignments = [
  { id: 1, title: 'Proyecto de Ciencias', subject: 'Ciencias', deadline: '10/03/2025', status: 'pendiente' },
  { id: 2, title: 'Ensayo de Literatura', subject: 'Lengua', deadline: '15/03/2025', status: 'pendiente' },
  { id: 3, title: 'Ejercicios de Matemáticas', subject: 'Matemáticas', deadline: '08/03/2025', status: 'pendiente' },
];

const courseProgress = [
  { id: 1, name: 'Matemáticas', progress: 75, grade: 8.5 },
  { id: 2, name: 'Ciencias', progress: 60, grade: 7.8 },
  { id: 3, name: 'Historia', progress: 80, grade: 9.2 },
  { id: 4, name: 'Lengua', progress: 85, grade: 8.7 },
];

const upcomingEvents = [
  { id: 1, title: 'Examen de Matemáticas', date: '15/03/2025', time: '9:00 - 10:30' },
  { id: 2, title: 'Entrega Proyecto de Ciencias', date: '10/03/2025', time: 'Todo el día' },
  { id: 3, title: 'Excursión al Museo', date: '20/03/2025', time: '8:00 - 14:00' },
];

const notifications = [
  { id: 1, title: 'Calificación publicada', message: 'Tu calificación de Matemáticas ha sido publicada', time: '2 horas', read: false },
  { id: 2, title: 'Recordatorio de tarea', message: 'Recuerda entregar el ensayo de Literatura', time: '1 día', read: true },
  { id: 3, title: 'Comentario del profesor', message: 'El profesor ha comentado tu último trabajo', time: '3 días', read: true },
];

const StudentDashboard: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Mi Panel de Estudiante
      </Typography>
      
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Bienvenido a tu panel personalizado. Aquí puedes ver tus tareas pendientes, progreso académico y eventos próximos.
      </Typography>
      
      <Grid container spacing={3}>
        {/* Tareas pendientes */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <AssignmentIcon sx={{ mr: 1 }} color="primary" />
                Tareas Pendientes
              </Typography>
              <List>
                {upcomingAssignments.map((assignment, index) => (
                  <React.Fragment key={assignment.id}>
                    {index > 0 && <Divider component="li" />}
                    <ListItem>
                      <ListItemIcon>
                        <BookIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={assignment.title}
                        secondary={
                          <>
                            <Typography variant="body2" component="span">
                              {assignment.subject}
                            </Typography>
                            <Typography variant="caption" display="block" color="text.secondary">
                              Fecha límite: {assignment.deadline}
                            </Typography>
                          </>
                        }
                      />
                      <Chip 
                        label="Pendiente" 
                        size="small" 
                        color="warning"
                      />
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Progreso académico */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Progreso Académico
              </Typography>
              <List>
                {courseProgress.map((course) => (
                  <ListItem key={course.id}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body1">{course.name}</Typography>
                          <Typography variant="body2" color={course.grade >= 7 ? 'success.main' : 'error.main'}>
                            {course.grade.toFixed(1)}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box sx={{ width: '100%' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ width: '100%', mr: 1 }}>
                              <LinearProgress 
                                variant="determinate" 
                                value={course.progress}
                                color={course.progress < 60 ? "error" : course.progress < 80 ? "warning" : "success"}
                                sx={{ height: 8, borderRadius: 5 }}
                              />
                            </Box>
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {course.progress}%
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Próximos eventos */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <EventIcon sx={{ mr: 1 }} color="primary" />
                Próximos Eventos
              </Typography>
              <List>
                {upcomingEvents.map((event, index) => (
                  <React.Fragment key={event.id}>
                    {index > 0 && <Divider component="li" />}
                    <ListItem>
                      <ListItemText
                        primary={event.title}
                        secondary={
                          <>
                            <Typography variant="caption" display="block">
                              Fecha: {event.date}
                            </Typography>
                            <Typography variant="caption" display="block" color="text.secondary">
                              Hora: {event.time}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Notificaciones */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <NotificationsIcon sx={{ mr: 1 }} color="primary" />
                Notificaciones
              </Typography>
              <List>
                {notifications.map((notification, index) => (
                  <React.Fragment key={notification.id}>
                    {index > 0 && <Divider component="li" />}
                    <ListItem sx={{ opacity: notification.read ? 0.7 : 1 }}>
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: notification.read ? 'grey.300' : 'primary.main' }}>
                          <NotificationsIcon />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {notification.title}
                            {!notification.read && (
                              <Chip 
                                label="Nueva" 
                                size="small" 
                                color="primary"
                                sx={{ ml: 1, height: 20 }}
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" component="span">
                              {notification.message}
                            </Typography>
                            <Typography variant="caption" display="block" color="text.secondary">
                              Hace {notification.time}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentDashboard;