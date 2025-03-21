// src/pages/teacher/AttendanceManagement.tsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Button,
  IconButton,
  Tooltip,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
  Alert,
  Snackbar,
  TextField
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Print as PrintIcon,
  CloudDownload as DownloadIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Remove as RemoveIcon
} from '@mui/icons-material';
import { es as esLocale } from 'date-fns/locale';

// Datos de ejemplo
const courses = [
  { id: 1, name: 'Matemáticas', grade: '1°A' },
  { id: 2, name: 'Ciencias', grade: '2°B' },
  { id: 3, name: 'Historia', grade: '1°A' },
];

// Estudiantes de ejemplo
const students = [
  { id: 1, name: 'Juan Pérez' },
  { id: 2, name: 'María García' },
  { id: 3, name: 'Carlos López' },
  { id: 4, name: 'Sofía Martínez' },
  { id: 5, name: 'Luis Rodríguez' },
  { id: 6, name: 'Ana Sánchez' },
  { id: 7, name: 'Pablo González' },
  { id: 8, name: 'Laura Fernández' },
];

// Estado de asistencia
type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

const AttendanceManagement: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [attendance, setAttendance] = useState<Record<number, AttendanceStatus>>(
    students.reduce((acc, student) => ({ ...acc, [student.id]: 'present' }), {})
  );
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  
  const handleCourseChange = (event: SelectChangeEvent<number>) => {
    setSelectedCourse(Number(event.target.value));
  };
  
  const handleDateChange = (newDate: Date | null) => {
    setSelectedDate(newDate);
  };
  
  const handleAttendanceChange = (studentId: number, status: AttendanceStatus) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };
  
  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case 'present': return 'success';
      case 'absent': return 'error';
      case 'late': return 'warning';
      case 'excused': return 'info';
      default: return 'default';
    }
  };
  
  const getStatusLabel = (status: AttendanceStatus) => {
    switch (status) {
      case 'present': return 'Presente';
      case 'absent': return 'Ausente';
      case 'late': return 'Tardanza';
      case 'excused': return 'Justificado';
      default: return '';
    }
  };
  
  const handleSaveAttendance = () => {
    console.log('Guardando asistencia...', {
      course: selectedCourse,
      date: selectedDate,
      attendance
    });
    setSnackbarOpen(true);
  };
  
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={esLocale}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Control de Asistencia
        </Typography>
        
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel id="course-select-label">Curso</InputLabel>
              <Select
                labelId="course-select-label"
                id="course-select"
                value={selectedCourse}
                label="Curso"
                onChange={handleCourseChange}
              >
                <MenuItem value={0} disabled>Seleccionar curso</MenuItem>
                {courses.map((course) => (
                  <MenuItem key={course.id} value={course.id}>
                    {course.name} - {course.grade}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <DatePicker
              label="Fecha"
              value={selectedDate}
              onChange={handleDateChange}
              slotProps={{ textField: { variant: 'outlined', fullWidth: false, sx: { minWidth: 200 } } }}
              disableFuture
            />
            
            <Box sx={{ marginLeft: 'auto', display: 'flex', gap: 1 }}>
              <Tooltip title="Guardar asistencia">
                <span>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveAttendance}
                    disabled={!selectedCourse || !selectedDate}
                  >
                    Guardar
                  </Button>
                </span>
              </Tooltip>
              
              <Tooltip title="Actualizar datos">
                <IconButton color="primary">
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Imprimir asistencia">
                <IconButton color="primary">
                  <PrintIcon />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Descargar como Excel">
                <IconButton color="primary">
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Paper>
        
        {selectedCourse && selectedDate ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width="50">#</TableCell>
                  <TableCell>Estudiante</TableCell>
                  <TableCell align="center">Estado</TableCell>
                  <TableCell align="center">Asistencia</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student, index) => (
                  <TableRow key={student.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={getStatusLabel(attendance[student.id])} 
                        color={getStatusColor(attendance[student.id])} 
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <ToggleButtonGroup
                        value={attendance[student.id]}
                        exclusive
                        onChange={(_, value) => {
                          if (value !== null) {
                            handleAttendanceChange(student.id, value as AttendanceStatus);
                          }
                        }}
                        size="small"
                      >
                        <ToggleButton value="present" aria-label="presente" color="success">
                          <Tooltip title="Presente">
                            <CheckIcon />
                          </Tooltip>
                        </ToggleButton>
                        <ToggleButton value="absent" aria-label="ausente" color="error">
                          <Tooltip title="Ausente">
                            <CloseIcon />
                          </Tooltip>
                        </ToggleButton>
                        <ToggleButton value="late" aria-label="tardanza" color="warning">
                          <Tooltip title="Tardanza">
                            <RemoveIcon />
                          </Tooltip>
                        </ToggleButton>
                        <ToggleButton value="excused" aria-label="justificado" color="info">
                          <Tooltip title="Justificado">
                            <Typography variant="caption">J</Typography>
                          </Tooltip>
                        </ToggleButton>
                      </ToggleButtonGroup>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              Seleccione un curso y una fecha para registrar la asistencia.
            </Typography>
          </Paper>
        )}
        
        <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
            Asistencia guardada con éxito
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
};

export default AttendanceManagement;