// src/components/grade/AsistenciaTab.tsx
import React, { useState, useEffect, useCallback } from 'react';
// ... (tus imports de MUI como estaban)
import {
  Box, Typography, Button, Avatar, Tooltip,
  CircularProgress, Alert, Grid, Paper, Select, MenuItem, FormControl, InputLabel, TextField
} from '@mui/material';
import { GenericTable } from '../common/GenericTable';
import { estudianteService } from '../../services/api/estudianteService';
import { asistenciaService } from '../../services/asistencia/asistenciaService';
import { Estudiante } from '../../types'; // Asegúrate que la ruta a tus tipos sea correcta
import { ApiAsistenciaDTO, TipoEstadoAsistencia, ApiAsistenciaRequest, BackendApiResponse, ApiDetalleAsistenciaByAlumno } from '../../types';

import SaveIcon from '@mui/icons-material/Save';
import ListAltIcon from '@mui/icons-material/ListAlt';
import EditNoteIcon from '@mui/icons-material/EditNote';
import SearchIcon from '@mui/icons-material/Search';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';


// ViewModel para el modo de ingreso diario
interface StudentDailyInput {
  studentId: number;
  nombreCompleto: string;
  avatarUrl?: string;
  estado: TipoEstadoAsistencia;
  justificativo?: string;
}

// ViewModel para la tabla de resumen del rango personalizado
interface StudentRangeSummary {
  studentId: number;
  nombreCompleto: string;
  avatarUrl?: string;
  totalPresente: number;
  totalAusente: number;
  totalTarde: number;
  totalJustificado: number;
  totalDiasEnRangoConRegistro: number;
}

const VALID_INPUT_ESTADOS: Exclude<TipoEstadoAsistencia, 'NO_REGISTRADA'>[] = [
  'PRESENTE', 'AUSENTE', 'TARDE', 'JUSTIFICADO_AUSENTE', 'JUSTIFICADO_TARDE'
];


interface AsistenciaTabProps {
  gradeId: number;
}

export const AsistenciaTab: React.FC<AsistenciaTabProps> = ({ gradeId }) => {
  const [viewMode, setViewMode] = useState<'input' | 'rangeView'>('input');
  const [rangeStartDate, setRangeStartDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [rangeEndDate, setRangeEndDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [rangeViewData, setRangeViewData] = useState<StudentRangeSummary[]>([]);
  const [studentsForInput, setStudentsForInput] = useState<StudentDailyInput[]>([]);
  const [allStudentsInGrade, setAllStudentsInGrade] = useState<Estudiante[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchAllStudentsForGrade = useCallback(async () => {
    if (!gradeId) return;
    console.log("AsistenciaTab: Iniciando fetchAllStudentsForGrade para gradeId:", gradeId);
    setLoading(true); setError(null);
    try {
      const response = await estudianteService.obtenerPorGrado(gradeId);
      console.log("AsistenciaTab: Respuesta de estudianteService.obtenerPorGrado:", response);
      if (response.estado && response.data) {
        setAllStudentsInGrade(response.data);
      } else {
        throw new Error(response.message || "No se pudieron cargar los estudiantes del grado.");
      }
    } catch (err: any) {
      console.error("AsistenciaTab: Error en fetchAllStudentsForGrade:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [gradeId]);

  useEffect(() => {
    fetchAllStudentsForGrade();
  }, [fetchAllStudentsForGrade]);

  useEffect(() => {
    if (viewMode === 'input' && allStudentsInGrade.length > 0) {
      console.log("AsistenciaTab: Configurando studentsForInput basado en allStudentsInGrade:", allStudentsInGrade);
      setStudentsForInput(allStudentsInGrade.map(s => {
        if (!s) {
          console.error("AsistenciaTab: Encontrado estudiante 'undefined' o 'null' en allStudentsInGrade durante el mapeo a studentsForInput.");
          // Devolver un objeto placeholder o filtrar, pero esto indicaría un problema en fetchAllStudentsForGrade
          return { studentId: 0, nombreCompleto: "Error Estudiante", avatarUrl: "", estado: 'NO_REGISTRADA', justificativo: "" };
        }
        return {
          studentId: s.id,
          nombreCompleto: `${s.nombre || ''} ${s.apellido || ''}`.trim(),
          avatarUrl: s.avatarUrl,
          estado: 'PRESENTE',
          justificativo: ''
        };
      }));
    }
  }, [viewMode, allStudentsInGrade]);

  const handleFetchCustomRangeData = async () => {
    if (!gradeId || !rangeStartDate || !rangeEndDate) {
      setError("Por favor, seleccione una fecha de inicio y fin.");
      return;
    }
    if (parseISO(rangeEndDate) < parseISO(rangeStartDate)) {
        setError("La fecha de fin no puede ser anterior a la fecha de inicio.");
        return;
    }

    setLoading(true); setError(null); setSuccessMessage(null); setRangeViewData([]);
    console.log(`AsistenciaTab: Iniciando handleFetchCustomRangeData para grado ${gradeId}, ${rangeStartDate} a ${rangeEndDate}`);
    try {
      const asistenciasApiRes: BackendApiResponse<ApiAsistenciaDTO> = await asistenciaService.getAsistenciasByDateAndGrado(
        gradeId, rangeStartDate, rangeEndDate
      );
      console.log("AsistenciaTab: Respuesta de asistenciaService.getAsistenciasByDateAndGrado:", asistenciasApiRes);

      if (asistenciasApiRes.estado) {
        const attendanceRecords: ApiAsistenciaDTO[] = asistenciasApiRes.dataIterable || [];
        console.log("AsistenciaTab: attendanceRecords extraídos:", attendanceRecords);

        if (!Array.isArray(attendanceRecords)) {
            console.error("AsistenciaTab: attendanceRecords NO es un array!", attendanceRecords);
            throw new Error("Los datos de asistencia recibidos no tienen el formato esperado (no es un array).");
        }

        if (attendanceRecords.length === 0) {
          setSuccessMessage(asistenciasApiRes.message || "No se encontraron registros de asistencia para el rango seleccionado.");
          setRangeViewData([]);
        } else {
          const summaryMap = new Map<number, StudentRangeSummary>();
          if (allStudentsInGrade.length === 0) {
            console.warn("AsistenciaTab: allStudentsInGrade está vacío al procesar asistencias. El resumen podría estar incompleto.");
          }
          allStudentsInGrade.forEach(student => {
            if (!student || typeof student.id === 'undefined') {
                console.error("AsistenciaTab: Estudiante inválido en allStudentsInGrade al crear summaryMap:", student);
                return; // Saltar este estudiante
            }
            summaryMap.set(student.id, {
              studentId: student.id,
              nombreCompleto: `${student.nombre || ''} ${student.apellido || ''}`.trim(),
              avatarUrl: student.avatarUrl,
              totalPresente: 0, totalAusente: 0, totalTarde: 0, totalJustificado: 0,
              totalDiasEnRangoConRegistro: 0,
            });
          });
          
          attendanceRecords.forEach((record, index) => {
            console.log(`AsistenciaTab: Procesando record [${index}]:`, record);
            if (!record) {
              console.error(`AsistenciaTab: Record en índice ${index} es undefined/null.`);
              return; // Saltar este record
            }
            // Usar 'estudiante' como viene del JSON (que es ApiAsistenciaDTO.estudiante)
            if (typeof record.estudiante === 'undefined' || record.estudiante === null) {
              console.error(`AsistenciaTab: Record en índice ${index} no tiene ID de estudiante (record.estudiante es undefined/null):`, record);
              return; // Saltar
            }
            if (typeof record.estado !== 'string') {
              console.error(`AsistenciaTab: Record en índice ${index} no tiene propiedad 'estado' o no es string:`, record);
              return; // Saltar
            }

            const summary = summaryMap.get(record.estudiante);
            if (summary) {
              summary.totalDiasEnRangoConRegistro++;
              switch (record.estado.toUpperCase() as TipoEstadoAsistencia) {
                case 'PRESENTE': summary.totalPresente++; break;
                case 'AUSENTE': summary.totalAusente++; break;
                case 'TARDE': summary.totalTarde++; break;
                case 'JUSTIFICADO_AUSENTE':
                case 'JUSTIFICADO_TARDE':
                  summary.totalJustificado++; break;
                default:
                  console.warn(`AsistenciaTab: Estado desconocido '${record.estado}' en record:`, record);
              }
            } else {
              console.warn(`AsistenciaTab: Estudiante con ID ${record.estudiante} de record de asistencia no encontrado en summaryMap (lista de estudiantes del grado). Record:`, record);
            }
          });
          setRangeViewData(Array.from(summaryMap.values()));
        }
      } else {
        throw new Error(asistenciasApiRes.message || 'Error al cargar asistencias para el rango (estado false).');
      }
    } catch (err: any) {
      console.error("AsistenciaTab: Error en handleFetchCustomRangeData catch:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const rangeViewColumns = [ /* ... (igual que antes) ... */
    { id: 'nombreCompleto', label: 'Nombre', render: (_v: any, r: StudentRangeSummary) => (<Box sx={{ display: 'flex', alignItems: 'center', minWidth: 180 }}><Avatar src={r.avatarUrl} sx={{ width: 32, height: 32, mr: 1.5 }}>{r.nombreCompleto?.[0]}</Avatar><Typography variant="body2">{r.nombreCompleto}</Typography></Box>), },
    { id: 'totalPresente', label: 'Presentes', align: 'center', render: (v:number) => v},
    { id: 'totalAusente', label: 'Ausentes', align: 'center', render: (v:number) => v },
    { id: 'totalTarde', label: 'Tardes', align: 'center', render: (v:number) => v },
    { id: 'totalJustificado', label: 'Justificadas', align: 'center', render: (v:number) => v },
    { id: 'totalDiasEnRangoConRegistro', label: 'Días c/Registro', align: 'center', render: (v:number) => v },
  ];

  const handleStudentStatusChange = (studentId: number, newStatus: TipoEstadoAsistencia) => { /* ... (igual) ... */
    setStudentsForInput(prev => prev.map(s => s.studentId === studentId ? { ...s, estado: newStatus } : s));
  };
  const handleStudentJustificativoChange = (studentId: number, newJustificativo: string) => {  /* ... (igual) ... */
    setStudentsForInput(prev => prev.map(s => s.studentId === studentId ? { ...s, justificativo: newJustificativo } : s));
  };
  const handleSubmitDailyAttendance = async () => { /* ... (igual que antes) ... */
    if (!gradeId || studentsForInput.length === 0) return;
    setLoading(true); setError(null); setSuccessMessage(null);
    const asistenciaPayload: Record<number, string> = {};
    studentsForInput.forEach(s => { asistenciaPayload[s.studentId] = s.estado; });
    const request: ApiAsistenciaRequest = { gradoId: gradeId, asistencia: asistenciaPayload };
    try {
      const response = await asistenciaService.addAsistencia(request);
      if (response.estado) {
        setSuccessMessage(response.message || "Asistencia guardada con éxito.");
      } else { throw new Error(response.message || "Error al guardar la asistencia."); }
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  // --- Renderizado Principal ---
  return (
    <Box>
      {/* ... (Botones de cambio de modo) ... */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button variant={viewMode === 'input' ? "contained" : "outlined"} startIcon={<EditNoteIcon />} onClick={() => setViewMode('input')}>
          Registrar Asistencia Diaria
        </Button>
        <Button variant={viewMode === 'rangeView' ? "contained" : "outlined"} startIcon={<ListAltIcon />} onClick={() => { setViewMode('rangeView'); setRangeViewData([]); /* Limpiar datos anteriores */ }}>
          Consultar por Rango
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
      {loading && <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress /></Box>}

      {/* --- VISTA MODO INPUT --- */}
      {!loading && viewMode === 'input' && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Registrar Asistencia para Hoy ({format(new Date(), "dd/MM/yyyy", { locale: es })})
          </Typography>
          <Grid container spacing={2} alignItems="center" sx={{mt: 1}}>
            {studentsForInput.map((student, studentIndex) => {
              // LOGGING: Verificar cada student antes de usarlo
              if (!student) {
                console.error(`AsistenciaTab: student en índice ${studentIndex} de studentsForInput es undefined.`);
                return <Grid item xs={12} key={`error-${studentIndex}`}><Alert severity="error">Error al cargar datos de un estudiante.</Alert></Grid>;
              }
              if (typeof student.estado !== 'string') {
                  console.error(`AsistenciaTab: student.estado NO es string para ${student.nombreCompleto} (ID: ${student.studentId}). Estado:`, student.estado);
                  // Podrías asignar un estado por defecto o manejarlo
              }
              // console.log(`AsistenciaTab: Renderizando input para ${student.nombreCompleto}, estado: ${student.estado}`);
              return (
              <React.Fragment key={student.studentId || `student-error-${studentIndex}`}>
                <Grid item xs={12} sm={1} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Avatar src={student.avatarUrl} alt={student.nombreCompleto} sx={{ width: 40, height: 40}}>
                        {student.nombreCompleto?.[0]}
                    </Avatar>
                </Grid>
                <Grid item xs={12} sm={4} md={3}> <Typography>{student.nombreCompleto}</Typography> </Grid>
                <Grid item xs={12} sm={3} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel id={`estado-label-${student.studentId}`}>Estado</InputLabel>
                    <Select
                      labelId={`estado-label-${student.studentId}`}
                      value={student.estado || 'NO_REGISTRADA'} // Fallback si student.estado fuera undefined
                      label="Estado"
                      onChange={(e) => handleStudentStatusChange(student.studentId, e.target.value as TipoEstadoAsistencia)}
                    >
                      {VALID_INPUT_ESTADOS.map(estadoOpt => (
                        <MenuItem key={estadoOpt} value={estadoOpt}>{estadoOpt.replace(/_/g, ' ').toLowerCase()}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4} md={5}>
                    {student.estado && (student.estado.includes('AUSENTE') || student.estado.includes('TARDE')) && (
                        <TextField fullWidth size="small" label="Justificativo (Opcional)" value={student.justificativo || ''} onChange={(e) => handleStudentJustificativoChange(student.studentId, e.target.value)} />
                    )}
                </Grid>
              </React.Fragment>
            );
           })}
          </Grid>
          <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSubmitDailyAttendance} disabled={loading || studentsForInput.length === 0} sx={{ mt: 3, float: 'right' }}>
            Guardar Asistencia del Día
          </Button>
        </Paper>
      )}

      {/* --- VISTA MODO RANGO --- */}
      {!loading && viewMode === 'rangeView' && (
        <Paper sx={{ p: 2 }}>
          {/* ... (Inputs de Fecha y Botón Buscar como antes) ... */}
          <Typography variant="h6" gutterBottom>Consultar Asistencia por Rango de Fechas</Typography>
          <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Grid item xs={12} sm={5}>
              <TextField fullWidth type="date" label="Fecha Inicio" value={rangeStartDate} onChange={(e) => setRangeStartDate(e.target.value)} InputLabelProps={{ shrink: true }} size="small"/>
            </Grid>
            <Grid item xs={12} sm={5}>
              <TextField fullWidth type="date" label="Fecha Fin" value={rangeEndDate} onChange={(e) => setRangeEndDate(e.target.value)} InputLabelProps={{ shrink: true }} size="small"/>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button fullWidth variant="contained" startIcon={<SearchIcon />} onClick={handleFetchCustomRangeData} disabled={loading}> Buscar </Button>
            </Grid>
          </Grid>
          {rangeViewData.length > 0 ? (
            <GenericTable columns={rangeViewColumns} data={rangeViewData} headerSx={{ backgroundColor: '#3A4F7F' }} />
          ) : (
            !error && !successMessage && studentsForInput.length > 0 && <Typography sx={{textAlign: 'center', mt: 2}}>Seleccione un rango y presione "Buscar", o si acaba de buscar y no hay resultados, se mostrará un mensaje.</Typography>
          )}
        </Paper>
      )}
    </Box>
  );
};

// No olvides exportar default AsistenciaTab si es un archivo separado.
// export default AsistenciaTab;