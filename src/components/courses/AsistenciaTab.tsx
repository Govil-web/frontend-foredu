import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Button, CircularProgress, Alert, Paper, Checkbox, TextField, FormControlLabel
} from '@mui/material';
import { GenericTable } from '../common/GenericTable';
import { estudianteService } from '../../services/api/estudianteService';
import { asistenciaService } from '../../services/asistencia/asistenciaService';
import { Estudiante } from '../../types';
import { ApiAsistenciaDTO, TipoEstadoAsistencia, ApiAsistenciaRequest, BackendApiResponse } from '../../types';

import ListAltIcon from '@mui/icons-material/ListAlt';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

// Components
import { DailyAttendanceInput } from './components/DailyAttendanceInput';
import { RangeSelector } from './components/RangeSelector';
import { useAsistenciaState } from './hooks/useAsistenciaState';
import { useAsistenciaHandlers } from './hooks/useAsistenciaHandlers';
import { useAsistenciaPercentage, StudentAttendancePercentage } from './hooks/useAsistenciaPercentage';
import { createRangeSummary } from './utils/asistenciaUtils';

// Types
export interface StudentDailyInput {
  studentId: number;
  nombreCompleto: string;
  avatarUrl?: string;
  isPresent: boolean;
  justificativo: string;
}

export interface StudentRangeSummary {
  studentId: number;
  nombreCompleto: string;
  avatarUrl?: string;
  totalPresente: number;
  totalAusente: number;
  totalTarde: number;
  totalJustificado: number;
  totalDiasEnRangoConRegistro: number;
}

// Nueva interfaz unificada que combina porcentajes y datos de entrada
export interface StudentUnifiedData {
  studentId: number;
  nombreCompleto: string;
  avatarUrl?: string;
  porcentajeAsistencia?: number;
  totalPresente: number;
  totalAusente: number;
  totalTarde?: number;
  totalJustificado?: number;
  totalRegistros: number;
  isPresent: boolean;
  justificativo: string;
}

type ViewMode = 'input' | 'rangeView';

interface AsistenciaTabProps {
  gradeId: number;
}

export const AsistenciaTab: React.FC<AsistenciaTabProps> = ({ gradeId }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('input');
  
  const {
    rangeStartDate,
    setRangeStartDate,
    rangeEndDate,
    setRangeEndDate,
    rangeViewData,
    setRangeViewData,
    studentsForInput,
    setStudentsForInput,
    allStudentsInGrade,
    setAllStudentsInGrade,
    loading,
    setLoading,
    error,
    setError,
    successMessage,
    setSuccessMessage
  } = useAsistenciaState();

  const {
    percentageData,
    loading: percentageLoading,
    error: percentageError,
    fetchPercentageData
  } = useAsistenciaPercentage();

  const {
    handleFetchStudents,
    handleFetchCustomRangeData,
    handleSubmitDailyAttendance
  } = useAsistenciaHandlers({
    gradeId,
    rangeStartDate: rangeStartDate ? rangeStartDate.toISOString() : '',
    rangeEndDate: rangeEndDate ? rangeEndDate.toISOString() : '',
    studentsForInput,
    setAllStudentsInGrade,
    setRangeViewData,
    setLoading,
    setError,
    setSuccessMessage
  });

  // Función para combinar datos de porcentajes con datos de entrada
  const createUnifiedData = useCallback((): StudentUnifiedData[] => {
    const unifiedData: StudentUnifiedData[] = [];

    studentsForInput.forEach(student => {
      // Buscar datos de porcentaje correspondientes
      const percentageRecord = percentageData.find(p => p.studentId === student.studentId);
      
      unifiedData.push({
        studentId: student.studentId,
        nombreCompleto: student.nombreCompleto,
        avatarUrl: student.avatarUrl,
        porcentajeAsistencia: percentageRecord?.porcentajeAsistencia || 0,
        totalPresente: percentageRecord?.totalPresente || 0,
        totalAusente: percentageRecord?.totalAusente || 0,
        totalTarde: 0,
        //totalJustificado: percentageRecord?.totalJustificado || 0,
        totalRegistros: percentageRecord?.totalRegistros || 0,
        isPresent: student.isPresent,
        justificativo: student.justificativo
      });
    });

    return unifiedData;
  }, [studentsForInput, percentageData]);

  // Initialize students data when component mounts or gradeId changes
  useEffect(() => {
    if (gradeId) {
      handleFetchStudents();
    }
  }, [gradeId, handleFetchStudents]);

  // Update students for input when switching to input mode
  useEffect(() => {
    if (viewMode === 'input' && allStudentsInGrade.length > 0) {
      const inputStudents: StudentDailyInput[] = allStudentsInGrade
        .filter(student => student && typeof student.id !== 'undefined')
        .map(student => ({
          studentId: student.id,
          nombreCompleto: `${student.nombre || ''} ${student.apellido || ''}`.trim(),
          avatarUrl: student.avatarUrl,
          isPresent: true,
          justificativo: ''
        }));
      setStudentsForInput(inputStudents);
    }
  }, [viewMode, allStudentsInGrade, setStudentsForInput]);

  // Fetch percentage data when switching to input view (to show historical data)
  useEffect(() => {
    if (viewMode === 'input' && allStudentsInGrade.length > 0) {
      fetchPercentageData(allStudentsInGrade);
    }
  }, [viewMode, allStudentsInGrade, fetchPercentageData]);

  // Columnas para la vista de rango (sin cambios)
  const rangeViewColumns = [
    {
      id: 'nombreCompleto',
      label: 'Nombre',
      render: (_v: any, r: StudentRangeSummary) => (
        <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 180 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: r.avatarUrl ? 'transparent' : '#1976d2',
              backgroundImage: r.avatarUrl ? `url(${r.avatarUrl})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '14px',
              fontWeight: 'bold',
              mr: 1.5
            }}
          >
            {!r.avatarUrl && r.nombreCompleto?.[0]}
          </Box>
          <Typography variant="body2">{r.nombreCompleto}</Typography>
        </Box>
      )
    },
    { id: 'totalPresente', label: 'Presentes', align: 'center' as const, render: (v: number) => v },
    { id: 'totalAusente', label: 'Ausentes', align: 'center' as const, render: (v: number) => v },
    { id: 'totalTarde', label: 'Tardes', align: 'center' as const, render: (v: number) => v },
    { id: 'totalJustificado', label: 'Justificadas', align: 'center' as const, render: (v: number) => v },
    { id: 'totalDiasEnRangoConRegistro', label: 'Días c/Registro', align: 'center' as const, render: (v: number) => v }
  ];

  // Nueva columna unificada que combina porcentajes y entrada diaria
  const unifiedInputColumns = [
    {
      id: 'nombreCompleto',
      label: 'Nombre',
      render: (_v: any, r: StudentUnifiedData) => (
        <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 180 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: r.avatarUrl ? 'transparent' : '#1976d2',
              backgroundImage: r.avatarUrl ? `url(${r.avatarUrl})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '14px',
              fontWeight: 'bold',
              mr: 1.5
            }}
          >
            {!r.avatarUrl && r.nombreCompleto?.[0]}
          </Box>
          <Typography variant="body2">{r.nombreCompleto}</Typography>
        </Box>
      )
    },
    {
      id: 'porcentajeAsistencia',
      label: 'Asistencia %',
      align: 'center' as const,
      render: (percentage: number = 0) => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 'bold',
              color: percentage >= 90 ? '#4caf50' : percentage >= 70 ? '#ff9800' : '#f44336'
            }}
          >
            {percentage}%
          </Typography>
        </Box>
      )
    },
    {
      id: 'totalPresente',
      label: 'Presentes',
      align: 'center' as const,
      render: (v: number = 0) => (
        <Typography variant="body2" sx={{ color: '#4caf50' }}>
          {v}
        </Typography>
      )
    },
    {
      id: 'totalAusente',
      label: 'Ausentes',
      align: 'center' as const,
      render: (v: number = 0) => (
        <Typography variant="body2" sx={{ color: '#f44336' }}>
          {v}
        </Typography>
      )
    },
    {
      id: 'totalRegistros',
      label: 'Total',
      align: 'center' as const,
      render: (v: number = 0) => (
        <Typography variant="body2">
          {v}
        </Typography>
      )
    },
    {
      id: 'isPresent',
      label: 'Presente',
      align: 'center' as const,
      render: (isPresent: boolean, r: StudentUnifiedData) => {
        const hasJustification = r.justificativo && r.justificativo.trim() !== '';
        return (
          <Box sx={{ position: 'relative', display: 'inline-block' }}>
            <Checkbox
              checked={isPresent && !hasJustification}
              onChange={(e) => {
                const updatedStudents = studentsForInput.map(s =>
                  s.studentId === r.studentId 
                    ? { ...s, isPresent: e.target.checked, justificativo: e.target.checked ? '' : s.justificativo }
                    : s
                );
                setStudentsForInput(updatedStudents);
              }}
              sx={{
                color: hasJustification ? '#f44336' : '#1976d2',
                '&.Mui-checked': {
                  color: hasJustification ? '#f44336' : '#4caf50',
                }
              }}
            />
            {hasJustification && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: '#f44336',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  pointerEvents: 'none',
                  zIndex: 1
                }}
              >
                ✗
              </Box>
            )}
          </Box>
        );
      }
    },
    {
      id: 'justificativo',
      label: 'Justificación',
      align: 'left' as const,
      render: (justificativo: string, r: StudentUnifiedData) => (
        <TextField
          size="small"
          value={justificativo || ''}
          onChange={(e) => {
            const newValue = e.target.value;
            const updatedStudents = studentsForInput.map(s =>
              s.studentId === r.studentId 
                ? { 
                    ...s, 
                    justificativo: newValue,
                    isPresent: newValue.trim() === '' ? s.isPresent : false
                  }
                : s
            );
            setStudentsForInput(updatedStudents);
          }}
          placeholder="Ingrese justificación si está ausente"
          sx={{ 
            minWidth: 200,
            '& .MuiInputBase-input': {
              fontSize: '13px'
            }
          }}
        />
      )
    }
  ];

  const isLoading = loading || percentageLoading;
  const currentError = error || percentageError;

  return (
    <Box>
      {/* Mode Toggle Buttons */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button
          variant={viewMode === 'input' ? "contained" : "outlined"}
          startIcon={<EditNoteIcon />}
          onClick={() => setViewMode('input')}
        >
          Registrar Asistencia Diaria
        </Button>
        <Button
          variant={viewMode === 'rangeView' ? "contained" : "outlined"}
          startIcon={<ListAltIcon />}
          onClick={() => {
            setViewMode('rangeView');
            setRangeViewData([]);
          }}
        >
          Consultar por Rango
        </Button>
      </Box>

      {/* Messages */}
      {currentError && <Alert severity="error" sx={{ mb: 2 }}>{currentError}</Alert>}
      {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
       {/* {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      )} */}
     

      {/* Daily Input View con tabla unificada */}
      {!loading && viewMode === 'input' && (
        <Paper sx={{ p: 2 }}>
      
          {/* Loading para porcentajes mientras se cargan */}
          {percentageLoading && (
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Cargando datos de asistencia...
              </Typography>
              <CircularProgress size={20} sx={{ ml: 1 }} />
            </Box>
          )}

          {/* Tabla unificada que combina porcentajes históricos y entrada diaria */}
          {studentsForInput.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                  Registro de Asistencia - Histórico y Actual ({format(new Date(), "dd/MM/yyyy", { locale: es })})
                </Typography>
                
                {/* Controles de selección masiva */}
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Button
                    size="small"
                    variant="outlined"
                    color="success"
                    onClick={() => {
                      const updatedStudents = studentsForInput.map(s => ({
                        ...s,
                        isPresent: true,
                        justificativo: ''
                      }));
                      setStudentsForInput(updatedStudents);
                    }}
                    sx={{ fontSize: '12px', minWidth: 100 }}
                  >
                    Todos Presentes
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      const updatedStudents = studentsForInput.map(s => ({
                        ...s,
                        isPresent: false,
                        justificativo: s.justificativo || ''
                      }));
                      setStudentsForInput(updatedStudents);
                    }}
                    sx={{ fontSize: '12px', minWidth: 100 }}
                  >
                    Todos Ausentes
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      const updatedStudents = studentsForInput.map(s => ({
                        ...s,
                        isPresent: true,
                        justificativo: ''
                      }));
                      setStudentsForInput(updatedStudents);
                    }}
                    sx={{ fontSize: '12px', minWidth: 80 }}
                  >
                    Limpiar Todo
                  </Button>
                </Box>
              </Box>
              
              <GenericTable
                columns={unifiedInputColumns}
                data={createUnifiedData()}
                headerSx={{ backgroundColor: '#3A4F7F' }}
              />
              
              {/* Botón para enviar la asistencia diaria */}
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => handleSubmitDailyAttendance()}
                  disabled={loading}
                  sx={{ minWidth: 200 }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Guardar Asistencia del Día'}
                </Button>
              </Box>
            </Box>
          )}

          {/* Mantener el componente original como respaldo */}
          <Box sx={{ display: 'none' }}>
            <DailyAttendanceInput
              students={studentsForInput}
              onStudentsChange={setStudentsForInput}
              onSubmit={handleSubmitDailyAttendance}
              loading={loading}
            />
          </Box>
        </Paper>
      )}

      {/* Range View (sin cambios) */}
      {!isLoading && viewMode === 'rangeView' && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Consultar Asistencia por Rango de Fechas
          </Typography>
          <RangeSelector
            startDate={rangeStartDate ? rangeStartDate.toISOString() : ''}
            endDate={rangeEndDate ? rangeEndDate.toISOString() : ''}
            onStartDateChange={(dateStr: string) => setRangeStartDate(dateStr ? new Date(dateStr) : null)}
            onEndDateChange={(dateStr: string) => setRangeEndDate(dateStr ? new Date(dateStr) : null)}
            onSearch={handleFetchCustomRangeData}
            loading={loading}
          />
          {rangeViewData.length > 0 ? (
            <GenericTable
              columns={rangeViewColumns}
              data={rangeViewData}
              headerSx={{ backgroundColor: '#3A4F7F' }}
            />
          ) : (
            !error && !successMessage && (
              <Typography sx={{ textAlign: 'center', mt: 2 }}>
                Seleccione un rango y presione "Buscar"
              </Typography>
            )
          )}
        </Paper>
      )}
    </Box>
  );
};

export default AsistenciaTab;