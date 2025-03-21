// src/pages/admin/Reports.tsx
import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { 
  Download as DownloadIcon,
  Print as PrintIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Timeline as TimelineIcon,
  School as SchoolIcon,
} from '@mui/icons-material';

// Datos de ejemplo para reportes
const monthlyAttendance = [
  { month: 'Enero', percentage: 92 },
  { month: 'Febrero', percentage: 94 },
  { month: 'Marzo', percentage: 91 },
  { month: 'Abril', percentage: 89 },
  { month: 'Mayo', percentage: 93 },
];

const coursePerformance = [
  { course: 'Matemáticas', average: 78, passing: 85 },
  { course: 'Historia', average: 82, passing: 92 },
  { course: 'Ciencias', average: 75, passing: 80 },
  { course: 'Literatura', average: 88, passing: 95 },
  { course: 'Física', average: 70, passing: 75 },
];

const AdminReports: React.FC = () => {
  const [reportType, setReportType] = useState('attendance');
  const [period, setPeriod] = useState('term1');
  const [grade, setGrade] = useState('all');
  
  const handleReportTypeChange = (event: SelectChangeEvent) => {
    setReportType(event.target.value);
  };
  
  const handlePeriodChange = (event: SelectChangeEvent) => {
    setPeriod(event.target.value);
  };
  
  const handleGradeChange = (event: SelectChangeEvent) => {
    setGrade(event.target.value);
  };
  
  const handleGenerateReport = () => {
    console.log('Generating report with:', { reportType, period, grade });
    // Aquí iría la lógica para generar el reporte
  };
  
  const handleExportReport = () => {
    console.log('Exporting report with:', { reportType, period, grade });
    // Aquí iría la lógica para exportar el reporte
  };
  
  const handlePrintReport = () => {
    console.log('Printing report with:', { reportType, period, grade });
    // Aquí iría la lógica para imprimir el reporte
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Reportes Académicos
      </Typography>
      
      {/* Filtros de reportes */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel id="report-type-label">Tipo de Reporte</InputLabel>
              <Select
                labelId="report-type-label"
                id="report-type"
                value={reportType}
                label="Tipo de Reporte"
                onChange={handleReportTypeChange}
              >
                <MenuItem value="attendance">Asistencia</MenuItem>
                <MenuItem value="grades">Calificaciones</MenuItem>
                <MenuItem value="performance">Rendimiento</MenuItem>
                <MenuItem value="behavior">Comportamiento</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel id="period-label">Período</InputLabel>
              <Select
                labelId="period-label"
                id="period"
                value={period}
                label="Período"
                onChange={handlePeriodChange}
              >
                <MenuItem value="term1">Primer Trimestre</MenuItem>
                <MenuItem value="term2">Segundo Trimestre</MenuItem>
                <MenuItem value="term3">Tercer Trimestre</MenuItem>
                <MenuItem value="full-year">Año Completo</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel id="grade-label">Grado</InputLabel>
              <Select
                labelId="grade-label"
                id="grade"
                value={grade}
                label="Grado"
                onChange={handleGradeChange}
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="primary">Primaria</MenuItem>
                <MenuItem value="secondary">Secundaria</MenuItem>
                <MenuItem value="high-school">Bachillerato</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={3} sx={{ display: 'flex', alignItems: 'center' }}>
            <Button 
              variant="contained" 
              fullWidth 
              onClick={handleGenerateReport}
            >
              Generar Reporte
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Reportes rápidos */}
      <Typography variant="h5" gutterBottom>
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
                    startIcon={<DownloadIcon />} 
                    size="small"
                    onClick={handleExportReport}
                  >
                    Exportar
                  </Button>
                  <Button 
                    startIcon={<PrintIcon />} 
                    size="small"
                    onClick={handlePrintReport}
                    sx={{ ml: 1 }}
                  >
                    Imprimir
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
                    {monthlyAttendance.map((row) => (
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
                    startIcon={<DownloadIcon />} 
                    size="small"
                    onClick={handleExportReport}
                  >
                    Exportar
                  </Button>
                  <Button 
                    startIcon={<PrintIcon />} 
                    size="small"
                    onClick={handlePrintReport}
                    sx={{ ml: 1 }}
                  >
                    Imprimir
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
                    {coursePerformance.map((row) => (
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
      
      {/* Reportes personalizados */}
      <Typography variant="h5" gutterBottom>
        Reportes Personalizados
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <TimelineIcon color="primary" sx={{ fontSize: 48, mb: 2, mx: 'auto' }} />
            <Typography variant="h6" gutterBottom>
              Progreso Académico
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
              Genere reportes detallados sobre el progreso académico de los estudiantes a lo largo del tiempo.
            </Typography>
            <Button variant="outlined" fullWidth>
              Generar Reporte
            </Button>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <SchoolIcon color="secondary" sx={{ fontSize: 48, mb: 2, mx: 'auto' }} />
            <Typography variant="h6" gutterBottom>
              Análisis por Grado
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
              Compare el rendimiento entre diferentes grados y niveles educativos.
            </Typography>
            <Button variant="outlined" fullWidth>
              Generar Reporte
            </Button>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <PieChartIcon color="success" sx={{ fontSize: 48, mb: 2, mx: 'auto' }} />
            <Typography variant="h6" gutterBottom>
              Estadísticas de Profesores
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
              Analice el desempeño de los profesores y su impacto en el rendimiento estudiantil.
            </Typography>
            <Button variant="outlined" fullWidth>
              Generar Reporte
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminReports;