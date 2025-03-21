// src/pages/teacher/GradeManagement.tsx
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
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  IconButton,
  Tooltip,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Print as PrintIcon,
  CloudDownload as DownloadIcon
} from '@mui/icons-material';

// Datos de ejemplo
const courses = [
  { id: 1, name: 'Matemáticas', grade: '1°A' },
  { id: 2, name: 'Ciencias', grade: '2°B' },
  { id: 3, name: 'Historia', grade: '1°A' },
];

// Tipos de evaluación
const evaluationTypes = [
  { id: 1, name: 'Primer Trimestre' },
  { id: 2, name: 'Segundo Trimestre' },
  { id: 3, name: 'Tercer Trimestre' },
  { id: 4, name: 'Final' },
];

// Estudiantes de ejemplo
const students = [
  { id: 1, name: 'Juan Pérez', grades: { 1: 8.5, 2: 7.8, 3: null, 4: null } },
  { id: 2, name: 'María García', grades: { 1: 9.2, 2: 8.7, 3: null, 4: null } },
  { id: 3, name: 'Carlos López', grades: { 1: 7.5, 2: 8.0, 3: null, 4: null } },
  { id: 4, name: 'Sofía Martínez', grades: { 1: 6.8, 2: 7.2, 3: null, 4: null } },
  { id: 5, name: 'Luis Rodríguez', grades: { 1: 8.9, 2: 9.1, 3: null, 4: null } },
  { id: 6, name: 'Ana Sánchez', grades: { 1: 7.7, 2: 8.3, 3: null, 4: null } },
  { id: 7, name: 'Pablo González', grades: { 1: 6.5, 2: 7.0, 3: null, 4: null } },
  { id: 8, name: 'Laura Fernández', grades: { 1: 9.5, 2: 9.3, 3: null, 4: null } },
];

const GradeManagement: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState<number>(0);
  const [selectedEvaluation, setSelectedEvaluation] = useState<number>(0);
  const [studentGrades, setStudentGrades] = useState<any[]>(students);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  
  const handleCourseChange = (event: SelectChangeEvent<number>) => {
    setSelectedCourse(Number(event.target.value));
  };
  
  const handleEvaluationChange = (event: SelectChangeEvent<number>) => {
    setSelectedEvaluation(Number(event.target.value));
  };
  
  const handleGradeChange = (studentId: number, value: string) => {
    // Validar que sea un número entre 0 y 10
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0 || numValue > 10) {
      return;
    }
    
    setStudentGrades(students.map(student => {
      if (student.id === studentId) {
        return {
          ...student,
          grades: {
            ...student.grades,
            [selectedEvaluation]: numValue
          }
        };
      }
      return student;
    }));
  };
  
  const handleSaveGrades = () => {
    console.log('Guardando calificaciones...', studentGrades);
    setSnackbarOpen(true);
  };
  
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Gestión de Calificaciones
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
          
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="evaluation-select-label">Tipo de Evaluación</InputLabel>
            <Select
              labelId="evaluation-select-label"
              id="evaluation-select"
              value={selectedEvaluation}
              label="Tipo de Evaluación"
              onChange={handleEvaluationChange}
              disabled={!selectedCourse}
            >
              <MenuItem value={0} disabled>Seleccionar evaluación</MenuItem>
              {evaluationTypes.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Box sx={{ marginLeft: 'auto', display: 'flex', gap: 1 }}>
            <Tooltip title="Guardar calificaciones">
              <span>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveGrades}
                  disabled={!selectedCourse || !selectedEvaluation}
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
            
            <Tooltip title="Imprimir calificaciones">
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
      
      {selectedCourse && selectedEvaluation ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width="50">#</TableCell>
                <TableCell>Estudiante</TableCell>
                <TableCell align="center">Calificación</TableCell>
                <TableCell align="center">Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {studentGrades.map((student, index) => (
                <TableRow key={student.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell align="center">
                    <TextField
                      type="number"
                      variant="outlined"
                      size="small"
                      inputProps={{ min: 0, max: 10, step: 0.1 }}
                      value={student.grades[selectedEvaluation] === null ? '' : student.grades[selectedEvaluation]}
                      onChange={(e) => handleGradeChange(student.id, e.target.value)}
                      sx={{ width: '100px' }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    {student.grades[selectedEvaluation] === null ? (
                      <Typography variant="body2" color="text.secondary">
                        Pendiente
                      </Typography>
                    ) : student.grades[selectedEvaluation] >= 7 ? (
                      <Typography variant="body2" color="success.main">
                        Aprobado
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="error.main">
                        Reprobado
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            Seleccione un curso y tipo de evaluación para gestionar las calificaciones.
          </Typography>
        </Paper>
      )}
      
      <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Calificaciones guardadas con éxito
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default GradeManagement;