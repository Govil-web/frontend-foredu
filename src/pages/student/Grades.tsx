// src/pages/student/Grades.tsx
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
  Grid,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Tab,
  Tabs,
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  BarChart as BarChartIcon,
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { StudentTable } from '../../features/student/ui/StudentTable';
import StudentForm from '../../features/student/ui/StudentForm';
import { Student, StudentRequestDTO } from '../../features/student/types';
import { useCreateStudent } from '../../features/student/model/useCreateStudent';
import { useUpdateStudent } from '../../features/student/model/useUpdateStudent';
import { useDeleteStudent } from '../../features/student/model/useDeleteStudent';

// Datos de ejemplo
const mockCourses = [
  { id: '1', name: 'Matemáticas' },
  { id: '2', name: 'Física' },
  { id: '3', name: 'Química' },
  { id: '4', name: 'Historia' },
  { id: '5', name: 'Literatura' },
];

const mockTerms = [
  { id: '1', name: 'Primer Bimestre' },
  { id: '2', name: 'Segundo Bimestre' },
  { id: '3', name: 'Tercer Bimestre' },
  { id: '4', name: 'Cuarto Bimestre' },
];

const mockAssignments = [
  { id: '1', name: 'Examen Parcial 1', weight: 30 },
  { id: '2', name: 'Trabajo Práctico', weight: 20 },
  { id: '3', name: 'Participación', weight: 10 },
  { id: '4', name: 'Examen Final', weight: 40 },
];

// Datos de calificaciones por curso y término
const mockGrades: Record<string, Record<string, Record<string, number>>> = {
  '1': { // Matemáticas
    '1': { '1': 85, '2': 78, '3': 90, '4': 82 },
    '2': { '1': 88, '2': 80, '3': 92, '4': 85 },
    '3': { '1': 90, '2': 85, '3': 95, '4': 88 },
    '4': { '1': 92, '2': 88, '3': 97, '4': 90 },
  },
  '2': { // Física
    '1': { '1': 75, '2': 80, '3': 85, '4': 78 },
    '2': { '1': 78, '2': 82, '3': 88, '4': 80 },
    '3': { '1': 80, '2': 85, '3': 90, '4': 83 },
    '4': { '1': 82, '2': 88, '3': 92, '4': 85 },
  },
  // Otros cursos...
};

const StudentGrades: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState('1');
  const [selectedTerm, setSelectedTerm] = useState('1');
  const [tabValue, setTabValue] = useState(0);
  const [openForm, setOpenForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  const createStudent = useCreateStudent();
  const updateStudent = useUpdateStudent();
  const deleteStudent = useDeleteStudent();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const calculateFinalGrade = (courseId: string, termId: string) => {
    const courseGrades = mockGrades[courseId]?.[termId];
    if (!courseGrades) return 'N/A';
    
    let totalWeight = 0;
    let weightedSum = 0;

    mockAssignments.forEach(assignment => {
      const grade = courseGrades[assignment.id];
      if (grade !== undefined) {
        weightedSum += (grade * assignment.weight);
        totalWeight += assignment.weight;
      }
    });

    return totalWeight > 0 ? (weightedSum / totalWeight).toFixed(1) : 'N/A';
  };

  const calculateOverallGrade = (courseId: string) => {
    let totalGrade = 0;
    let termCount = 0;

    Object.keys(mockGrades[courseId] || {}).forEach(termId => {
      const grade = parseFloat(calculateFinalGrade(courseId, termId));
      if (!isNaN(grade)) {
        totalGrade += grade;
        termCount++;
      }
    });

    return termCount > 0 ? (totalGrade / termCount).toFixed(1) : 'N/A';
  };

  const handleAdd = () => {
    setIsEdit(false);
    setSelectedStudent(null);
    setOpenForm(true);
  };

  const handleEdit = (student: Student) => {
    setIsEdit(true);
    setSelectedStudent(student);
    setOpenForm(true);
  };

  const handleDelete = (student: Student) => {
    setStudentToDelete(student);
    setDeleteDialogOpen(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedStudent(null);
  };

  const handleSaveStudent = async (studentData: StudentRequestDTO) => {
    if (isEdit && selectedStudent) {
      await updateStudent.mutateAsync({ ...selectedStudent, ...studentData }, {
        onSuccess: () => {
          setSnackbar({ open: true, message: 'Estudiante actualizado correctamente', severity: 'success' });
          setOpenForm(false);
        },
        onError: () => {
          setSnackbar({ open: true, message: 'Error al actualizar estudiante', severity: 'error' });
        },
      });
    } else {
      await createStudent.mutateAsync(studentData, {
        onSuccess: () => {
          setSnackbar({ open: true, message: 'Estudiante creado correctamente', severity: 'success' });
          setOpenForm(false);
        },
        onError: () => {
          setSnackbar({ open: true, message: 'Error al crear estudiante', severity: 'error' });
        },
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (studentToDelete) {
      await deleteStudent.mutateAsync(studentToDelete.id, {
        onSuccess: () => {
          setSnackbar({ open: true, message: 'Estudiante eliminado correctamente', severity: 'success' });
        },
        onError: () => {
          setSnackbar({ open: true, message: 'Error al eliminar estudiante', severity: 'error' });
        },
        onSettled: () => {
          setDeleteDialogOpen(false);
          setStudentToDelete(null);
        },
      });
    }
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  return (
    <>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Mis Calificaciones
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    label="Seleccionar Curso"
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    fullWidth
                  >
                    {mockCourses.map((course) => (
                      <MenuItem key={course.id} value={course.id}>
                        {course.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    label="Seleccionar Período"
                    value={selectedTerm}
                    onChange={(e) => setSelectedTerm(e.target.value)}
                    fullWidth
                  >
                    {mockTerms.map((term) => (
                      <MenuItem key={term.id} value={term.id}>
                        {term.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <SchoolIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Promedio Final del Curso
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color={
                      parseFloat(calculateOverallGrade(selectedCourse)) >= 90 ? 'success.main' :
                      parseFloat(calculateOverallGrade(selectedCourse)) >= 70 ? 'primary.main' :
                      'error.main'
                    }>
                      {calculateOverallGrade(selectedCourse)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper sx={{ mb: 4 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="Calificaciones por Período" />
            <Tab label="Progreso Académico" />
          </Tabs>
        </Paper>

        {tabValue === 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Evaluación</TableCell>
                  <TableCell>Peso</TableCell>
                  <TableCell>Calificación</TableCell>
                  <TableCell>Comentarios</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockAssignments.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell>{assignment.name}</TableCell>
                    <TableCell>{assignment.weight}%</TableCell>
                    <TableCell>
                      <Typography 
                        variant="body1" 
                        fontWeight="medium"
                        color={
                          (mockGrades[selectedCourse]?.[selectedTerm]?.[assignment.id] || 0) >= 90 ? 'success.main' :
                          (mockGrades[selectedCourse]?.[selectedTerm]?.[assignment.id] || 0) >= 70 ? 'primary.main' :
                          'error.main'
                        }
                      >
                        {mockGrades[selectedCourse]?.[selectedTerm]?.[assignment.id] || 'N/A'}/100
                      </Typography>
                    </TableCell>
                    <TableCell>-</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>Calificación Final</TableCell>
                  <TableCell>
                    <Typography 
                      variant="body1" 
                      fontWeight="bold"
                      color={
                        parseFloat(calculateFinalGrade(selectedCourse, selectedTerm)) >= 90 ? 'success.main' :
                        parseFloat(calculateFinalGrade(selectedCourse, selectedTerm)) >= 70 ? 'primary.main' :
                        'error.main'
                      }
                    >
                      {calculateFinalGrade(selectedCourse, selectedTerm)}/100
                    </Typography>
                  </TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Progreso Académico - {mockCourses.find(c => c.id === selectedCourse)?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Este gráfico muestra tu evolución académica a lo largo de los períodos escolares.
            </Typography>
            <Box sx={{ textAlign: 'center', p: 4 }}>
              <TrendingUpIcon sx={{ fontSize: 100, color: 'primary.light' }} />
              <Typography variant="body1" sx={{ mt: 2 }}>
                Aquí se mostraría un gráfico de líneas con tu progreso académico.
              </Typography>
              <Button variant="contained" sx={{ mt: 2 }}>
                Descargar Reporte Completo
              </Button>
            </Box>
          </Paper>
        )}
      </Box>
      <StudentTable onEdit={handleEdit} onDelete={handleDelete} onAdd={handleAdd} />
      <StudentForm
        open={openForm}
        onClose={handleCloseForm}
        onSave={handleSaveStudent}
        isEdit={isEdit}
        student={selectedStudent}
      />
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>¿Estás seguro de que deseas eliminar este estudiante?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="secondary">Cancelar</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">Eliminar</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default StudentGrades;