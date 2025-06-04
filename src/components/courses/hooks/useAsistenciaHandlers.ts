import { useCallback } from 'react';
import { parseISO } from 'date-fns';
import { estudianteService } from '../../../services/api/estudianteService';
import { asistenciaService } from '../../../services/asistencia/asistenciaService';
import { Estudiante, ApiAsistenciaDTO, ApiAsistenciaRequest, BackendApiResponse } from '../../../types';
import { StudentDailyInput, StudentRangeSummary } from '../AsistenciaTab';
import { createRangeSummary } from '../utils/asistenciaUtils';

interface UseAsistenciaHandlersProps {
  gradeId: number;
  rangeStartDate: string;
  rangeEndDate: string;
  studentsForInput: StudentDailyInput[];
  setAllStudentsInGrade: (students: Estudiante[]) => void;
  setRangeViewData: (data: StudentRangeSummary[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSuccessMessage: (message: string | null) => void;
}

export const useAsistenciaHandlers = ({
  gradeId,
  rangeStartDate,
  rangeEndDate,
  studentsForInput,
  setAllStudentsInGrade,
  setRangeViewData,
  setLoading,
  setError,
  setSuccessMessage
}: UseAsistenciaHandlersProps) => {

  const handleFetchStudents = useCallback(async () => {
    if (!gradeId) return;
    
    console.log("Fetching students for grade:", gradeId);
    setLoading(true);
    setError(null);
    
    try {
      const response = await estudianteService.obtenerPorGrado(gradeId);
      console.log("Students response:", response);
      
      if (response.estado && response.data) {
        const validStudents = response.data.filter(student => 
          student && typeof student.id !== 'undefined'
        );
        setAllStudentsInGrade(validStudents);
      } else {
        throw new Error(response.message || "No se pudieron cargar los estudiantes del grado.");
      }
    } catch (err: any) {
      console.error("Error fetching students:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [gradeId, setAllStudentsInGrade, setLoading, setError]);

  const handleFetchCustomRangeData = useCallback(async () => {
    if (!gradeId || !rangeStartDate || !rangeEndDate) {
      setError("Por favor, seleccione una fecha de inicio y fin.");
      return;
    }
    
    if (parseISO(rangeEndDate) < parseISO(rangeStartDate)) {
      setError("La fecha de fin no puede ser anterior a la fecha de inicio.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    setRangeViewData([]);
    
    console.log(`Fetching attendance data for grade ${gradeId}, ${rangeStartDate} to ${rangeEndDate}`);
    
    try {
      const asistenciasApiRes: BackendApiResponse<ApiAsistenciaDTO> = 
        await asistenciaService.getAsistenciasByDateAndGrado(gradeId, rangeStartDate, rangeEndDate);
      
      console.log("Attendance response:", asistenciasApiRes);

      if (asistenciasApiRes.estado) {
        const attendanceRecords: ApiAsistenciaDTO[] = asistenciasApiRes.dataIterable || [];
        
        if (!Array.isArray(attendanceRecords)) {
          console.error("Attendance records is not an array:", attendanceRecords);
          throw new Error("Los datos de asistencia recibidos no tienen el formato esperado.");
        }

        if (attendanceRecords.length === 0) {
          setSuccessMessage(asistenciasApiRes.message || "No se encontraron registros de asistencia para el rango seleccionado.");
          setRangeViewData([]);
        } else {
          // Get current students from the state or fetch them
          const currentStudents = await estudianteService.obtenerPorGrado(gradeId);
          if (currentStudents.estado && currentStudents.data) {
            const summaryData = createRangeSummary(attendanceRecords, currentStudents.data);
            setRangeViewData(summaryData);
          } else {
            throw new Error("No se pudieron cargar los estudiantes para el resumen.");
          }
        }
      } else {
        throw new Error(asistenciasApiRes.message || 'Error al cargar asistencias para el rango.');
      }
    } catch (err: any) {
      console.error("Error fetching range data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [gradeId, rangeStartDate, rangeEndDate, setLoading, setError, setSuccessMessage, setRangeViewData]);

  const handleSubmitDailyAttendance = useCallback(async () => {
    if (!gradeId || studentsForInput.length === 0) return;
    
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const asistenciaPayload: Record<number, string> = {};
      
      studentsForInput.forEach(student => {
        if (student.isPresent) {
          asistenciaPayload[student.studentId] = 'PRESENTE';
        } else {
          // If there's a justification, mark as justified, otherwise absent
          asistenciaPayload[student.studentId] = student.justificativo.trim() ? 'JUSTIFICADO' : 'AUSENTE';
        }
      });

      const request: ApiAsistenciaRequest = {
        gradoId: gradeId,
        asistencia: asistenciaPayload
      };

      console.log("Submitting attendance:", request);
      
      const response = await asistenciaService.addAsistencia(request);
      
      if (response.estado) {
        setSuccessMessage(response.message || "Asistencia guardada con éxito.");
      } else {
        throw new Error(response.message || "Error al guardar la asistencia.");
      }
    } catch (err: any) {
      console.error("Error submitting attendance:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [gradeId, studentsForInput, setLoading, setError, setSuccessMessage]);

  return {
    handleFetchStudents,
    handleFetchCustomRangeData,
    handleSubmitDailyAttendance
  };
};
