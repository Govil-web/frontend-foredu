// hooks/useAsistenciaPercentage.ts
import { useState, useCallback } from 'react';
import { estudianteService } from '../../../services/api/estudianteService';
import { Estudiante, AsistenciaResponse } from '../../../types';

export interface StudentAttendancePercentage {
  studentId: number;
  nombreCompleto: string;
  avatarUrl?: string;
  porcentajeAsistencia: number;
  totalRegistros: number;
  totalPresente: number;
  totalAusente: number;
}

interface UseAsistenciaPercentageReturn {
  percentageData: StudentAttendancePercentage[];
  loading: boolean;
  error: string | null;
  fetchPercentageData: (students: Estudiante[]) => Promise<void>;
}

export const useAsistenciaPercentage = (): UseAsistenciaPercentageReturn => {
  const [percentageData, setPercentageData] = useState<StudentAttendancePercentage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateAttendancePercentage = (asistencias: AsistenciaResponse[]): {
    porcentaje: number;
    totalRegistros: number;
    totalPresente: number;
    totalAusente: number;
  } => {
    if (asistencias.length === 0) {
      return { porcentaje: 0, totalRegistros: 0, totalPresente: 0, totalAusente: 0 };
    }

    const totalPresente = asistencias.filter(a => 
      a.estado === 'PRESENTE' || a.estado === 'TARDE'
    ).length;
    
    const totalAusente = asistencias.filter(a => 
      a.estado === 'AUSENTE'
    ).length;
    
    const totalRegistros = asistencias.length;
    const porcentaje = totalRegistros > 0 ? Math.round((totalPresente / totalRegistros) * 100) : 0;

    return {
      porcentaje,
      totalRegistros,
      totalPresente,
      totalAusente
    };
  };

  const fetchPercentageData = useCallback(async (students: Estudiante[]) => {
    if (students.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const attendancePromises = students.map(async (student) => {
        try {
          const response = await estudianteService.obtenerDetalleAsistencia(student.id);
          
          if (response.estado) {
            const stats = calculateAttendancePercentage(response.data);
            
            return {
              studentId: student.id,
              nombreCompleto: `${student.nombre || ''} ${student.apellido || ''}`.trim(),
              avatarUrl: student.avatarUrl,
              porcentajeAsistencia: stats.porcentaje,
              totalRegistros: stats.totalRegistros,
              totalPresente: stats.totalPresente,
              totalAusente: stats.totalAusente,
            };
          } else {
            // Si hay error en la respuesta del servicio, devolvemos datos vacíos
            return {
              studentId: student.id,
              nombreCompleto: `${student.nombre || ''} ${student.apellido || ''}`.trim(),
              avatarUrl: student.avatarUrl,
              porcentajeAsistencia: 0,
              totalRegistros: 0,
              totalPresente: 0,
              totalAusente: 0,
            };
          }
        } catch (studentError) {
          console.error(`Error fetching attendance for student ${student.id}:`, studentError);
          // En caso de error, devolvemos datos vacíos para este estudiante
          return {
            studentId: student.id,
            nombreCompleto: `${student.nombre || ''} ${student.apellido || ''}`.trim(),
            avatarUrl: student.avatarUrl,
            porcentajeAsistencia: 0,
            totalRegistros: 0,
            totalPresente: 0,
            totalAusente: 0,
          };
        }
      });

      const results = await Promise.all(attendancePromises);
      
      // Ordenar por porcentaje de asistencia (descendente)
      const sortedResults = results.sort((a, b) => b.porcentajeAsistencia - a.porcentajeAsistencia);
      
      setPercentageData(sortedResults);
    } catch (error) {
      console.error('Error fetching attendance percentages:', error);
      setError('Error al obtener los porcentajes de asistencia');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    percentageData,
    loading,
    error,
    fetchPercentageData,
  };
};