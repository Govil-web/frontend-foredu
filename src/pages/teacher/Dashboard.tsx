// src/pages/teacher/Dashboard.tsx
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
  ListItemAvatar, 
  Avatar, 
  Divider,
  LinearProgress
} from '@mui/material';
import {
  Class as ClassIcon,
  Assignment as AssignmentIcon,
  Today as TodayIcon,
  Announcement as AnnouncementIcon
} from '@mui/icons-material';

// Datos simulados
const upcomingClasses = [
  { id: 1, subject: 'Matemáticas', grade: '1°A', time: '9:00 - 10:30', room: 'Aula 101' },
  { id: 2, subject: 'Ciencias', grade: '2°B', time: '11:00 - 12:30', room: 'Laboratorio 3' },
  { id: 3, subject: 'Historia', grade: '1°A', time: '14:00 - 15:30', room: 'Aula 205' },
];

const pendingTasks = [
  { id: 1, task: 'Calificar exámenes de Matemáticas', deadline: '05/03/2025', progress: 60 },
  { id: 2, task: 'Preparar informe trimestral', deadline: '10/03/2025', progress: 30 },
  { id: 3, task: 'Actualizar planificación de clases', deadline: '12/03/2025', progress: 10 },
];

const recentAnnouncements = [
  { id: 1, title: 'Reunión de profesores', content: 'Reunión general este viernes a las 15:00', date: '01/03/2025' },
  { id: 2, title: 'Entrega de calificaciones', content: 'Recordatorio de entrega de calificaciones antes del 10 de marzo', date: '28/02/2025' },
];

const TeacherDashboard: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Panel del Profesor
      </Typography>
      
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Bienvenido al panel docente. Aquí puede ver sus próximas clases, tareas pendientes y anuncios recientes.
      </Typography>
      
      <Grid container spacing={3}>
        {/* Próximas clases */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <TodayIcon sx={{ mr: 1 }} color="primary" />
                Próximas Clases
              </Typography>
              <List>
                {upcomingClasses.map((cls, index) => (
                  <React.Fragment key={cls.id}>
                    {index > 0 && <Divider component="li" />}
                    <ListItem>
                      <ListItemIcon>
                        <ClassIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={`${cls.subject} - ${cls.grade}`}
                        secondary={`${cls.time} | ${cls.room}`}
                      />
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Tareas pendientes */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <AssignmentIcon sx={{ mr: 1 }} color="primary" />
                Tareas Pendientes
              </Typography>
              <List>
                {pendingTasks.map((task, index) => (
                  <React.Fragment key={task.id}>
                    {index > 0 && <Divider component="li" />}
                    <ListItem>
                    <ListItemText
  primary={task.task}
  secondary={
    <Box component="span"> {/* Cambia aquí: añade component="span" */}
      <Typography variant="caption" component="span" display="block" gutterBottom>
        Fecha límite: {task.deadline}
      </Typography>
      <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}> {/* Aquí también */}
        <Box component="span" sx={{ width: '100%', mr: 1 }}> {/* Y aquí */}
          <LinearProgress 
            variant="determinate" 
            value={task.progress} 
            color={task.progress < 30 ? "error" : task.progress < 70 ? "warning" : "success"} 
          />
        </Box>
        <Box component="span"> {/* Y aquí */}
          <Typography variant="body2" color="text.secondary" component="span">
            {task.progress}%
          </Typography>
        </Box>
      </Box>
    </Box>
  }
/>
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Anuncios recientes */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <AnnouncementIcon sx={{ mr: 1 }} color="primary" />
                Anuncios Recientes
              </Typography>
              <List>
                {recentAnnouncements.map((announcement, index) => (
                  <React.Fragment key={announcement.id}>
                    {index > 0 && <Divider component="li" />}
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          <AnnouncementIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={announcement.title}
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {announcement.content}
                            </Typography>
                            <Typography 
                              component="span" 
                              variant="caption"
                              color="text.secondary"
                              sx={{ display: 'block', mt: 0.5 }}
                            >
                              Publicado: {announcement.date}
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

export default TeacherDashboard;