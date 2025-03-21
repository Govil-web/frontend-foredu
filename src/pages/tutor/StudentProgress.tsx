// src/pages/tutor/StudentProgress.tsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CardHeader,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Divider,
  Button,
  LinearProgress,
  TextField,
  MenuItem,
} from '@mui/material';
import {
  School as SchoolIcon,
  Assessment as AssessmentIcon,
  EventNote as EventNoteIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

// Datos de ejemplo
const mockStudents = [
  { id: '1', name: 'Juan Pérez', grade: '1°A' },
  { id: '2', name: 'María García', grade: '2°B' },
  { id: '3', name: 'Carlos López', grade: '3°C' },
];

const mockCourses = [
  { id: '1', name: 'Matemáticas', grade: 85, progress: 70 },
  { id: '2', name: 'Física', grade: 78, progress: 65 },
  { id: '3', name: 'Química', grade: 92, progress: 80 },
  { id: '4', name: 'Historia', grade: 88, progress: 75 },
  { id: '5', name: 'Literatura', grade: 75, progress: 60 },
];

const mockAttendance = [
  { date: '01/11/2023', status: 'present' },
  { date: '02/11/2023', status: 'present' },
  { date: '03/11/2023', status: 'absent' },
  { date: '06/11/2023', status: 'present' },
  { date: '07/11/2023', status: 'present' },
  { date: '08/11/2023', status: 'late' },
  { date: '09/11/2023', status: 'present' },
  { date: '10/11/2023', status: 'present' },
];

const mockBehavior = [
  { id: '1', date: '02/11/2023', note: 'Participó activamente en clase', type: 'positive' },
  { id: '2', date: '03/11/2023', note: 'Faltó entregar la tarea asignada', type: 'negative' },
  { id: '3', date: '08/11/2023', note: 'Demostró liderazgo en el trabajo en equipo', type: 'positive' },
  { id: '4', date: '10/11/2023', note: 'Ayudó a sus compañeros durante el examen', type: 'negative' },
];

const StudentProgress: React.FC = () => {
  const [selectedStudent, setSelectedStudent] = useState('1');
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Calcular estadísticas de asistencia
  const attendanceStats = {
    present: mockAttendance.filter(day => day.status === 'present').length,
    absent: mockAttendance.filter(day => day.status === 'absent').length,
    late: mockAttendance.filter(day => day.status === 'late').length,
    total: mockAttendance.length,
  };

  const attendancePercentage = (attendanceStats.present / attendanceStats.total) * 100;

  // Calcular promedio general
  const overallGrade = mockCourses.reduce((sum, course) => sum + course.grade, 0) / mockCourses.length;

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Progreso Estudiantil
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Seleccionar Estudiante
            </Typography>
            <TextField
              select
              label="Estudiante"
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              fullWidth
              sx={{ mb: 3 }}
            >
              {mockStudents.map((student) => (
                <MenuItem key={student.id} value={student.id}>
                  {student.name} ({student.grade})
                </MenuItem>
              ))}
            </TextField>

            <Box sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
              <Avatar 
                sx={{ 
                  width: 80, 
                  height: 80, 
                  bgcolor: 'primary.light',
                  fontSize: '2rem',
                  mr: 2
                }}
              >
                {mockStudents.find(s => s.id === selectedStudent)?.name.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="h6">
                  {mockStudents.find(s => s.id === selectedStudent)?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Grado: {mockStudents.find(s => s.id === selectedStudent)?.grade}
                </Typography>
                <Typography 
                  variant="body2" 
                  color={
                    overallGrade >= 90 ? 'success.main' :
                    overallGrade >= 70 ? 'primary.main' :
                    'error.main'
                  }
                  fontWeight="medium"
                  sx={{ mt: 0.5 }}
                >
                  Promedio General: {overallGrade.toFixed(1)}/100
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 0 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab icon={<SchoolIcon />} label="ACADÉMICO" />
              <Tab icon={<EventNoteIcon />} label="ASISTENCIA" />
              <Tab icon={<PersonIcon />} label="COMPORTAMIENTO" />
            </Tabs>

            <Box sx={{ p: 3 }}>
              {tabValue === 0 && (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Desempeño Académico
                    </Typography>
                    {mockCourses.map((course) => (
                      <Box key={course.id} sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                          <Typography variant="body1">{course.name}</Typography>
                          <Typography 
                            variant="body2" 
                            fontWeight="medium"
                            color={
                              course.grade >= 90 ? 'success.main' :
                              course.grade >= 70 ? 'primary.main' :
                              'error.main'
                            }
                          >
                            {course.grade}/100
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={course.progress} 
                          sx={{ 
                            height: 8, 
                            borderRadius: 1,
                            backgroundColor: 'rgba(0,0,0,0.1)',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: 
                                course.grade >= 90 ? 'success.main' :
                                course.grade >= 70 ? 'primary.main' :
                                'error.main'
                            }
                          }} 
                        />
                      </Box>
                    ))}
                  </Grid>
                </Grid>
              )}

              {tabValue === 1 && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardHeader title="Resumen de Asistencia" />
                      <CardContent>
                        <Box sx={{ textAlign: 'center', mb: 3 }}>
                          <Typography variant="h3" color={
                            attendancePercentage >= 90 ? 'success.main' :
                            attendancePercentage >= 75 ? 'primary.main' :
                            'error.main'
                          }>
                            {attendancePercentage.toFixed(1)}%
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Asistencia General
                          </Typography>
                        </Box>
                        <Grid container spacing={2}>
                          <Grid item xs={4}>
                            <Paper elevation={0} sx={{ p: 2, textAlign: 'center', bgcolor: 'success.light' }}>
                              <Typography variant="h5" color="success.main">
                                {attendanceStats.present}
                              </Typography>
                              <Typography variant="caption">Presente</Typography>
                            </Paper>
                          </Grid>
                          <Grid item xs={4}>
                            <Paper elevation={0} sx={{ p: 2, textAlign: 'center', bgcolor: 'error.light' }}>
                              <Typography variant="h5" color="error.main">
                                {attendanceStats.absent}
                              </Typography>
                              <Typography variant="caption">Ausente</Typography>
                            </Paper>
                          </Grid>
                          <Grid item xs={4}>
                            <Paper elevation={0} sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.light' }}>
                              <Typography variant="h5" color="warning.main">
                                {attendanceStats.late}
                              </Typography>
                              <Typography variant="caption">Tarde</Typography>
                            </Paper>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardHeader title="Registro Detallado" />
                      <CardContent sx={{ maxHeight: 300, overflow: 'auto' }}>
                        <List>
                          {mockAttendance.map((day, index) => (
                            <React.Fragment key={day.date}>
                              {index > 0 && <Divider />}
                              <ListItem>
                                <ListItemText
                                  primary={day.date}
                                  secondary={
                                    day.status === 'present' ? 'Presente' :
                                    day.status === 'absent' ? 'Ausente' : 'Tarde'
                                  }
                                  primaryTypographyProps={{ variant: 'body2' }}
                                  secondaryTypographyProps={{ 
                                    color: 
                                      day.status === 'present' ? 'success.main' :
                                      day.status === 'absent' ? 'error.main' : 'warning.main',
                                    fontWeight: 'medium'
                                  }}
                                />
                              </ListItem>
                            </React.Fragment>
                          ))}
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}

              {tabValue === 2 && (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Card>
                      <CardHeader title="Notas de Comportamiento" />
                      <CardContent>
                        <List>
                          {mockBehavior.map((note, index) => (
                            <React.Fragment key={note.id}>
                              {index > 0 && <Divider />}
                              <ListItem>
                                <Box 
                                  sx={{ 
                                    width: 4, 
                                    height: 40, 
                                    bgcolor: note.type === 'positive' ? 'success.main' : 'error.main',
                                    borderRadius: 1,
                                    mr: 2
                                  }} 
                                />
                                <ListItemText
                                  primary={note.note}
                                  secondary={`Fecha: ${note.date}`}
                                  primaryTypographyProps={{ 
                                    color: note.type === 'positive' ? 'success.main' : 'error.main',
                                    fontWeight: 'medium'
                                  }}
                                />
                              </ListItem>
                            </React.Fragment>
                          ))}
                        </List>
                        <Button 
                          variant="outlined" 
                          fullWidth 
                          sx={{ mt: 2 }}
                        >
                          Agregar nueva nota
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentProgress;