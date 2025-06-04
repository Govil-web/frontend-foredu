import { ApiAsistenciaDTO, TipoEstadoAsistencia, Estudiante } from '../../../types';
import { StudentRangeSummary } from '../AsistenciaTab';

export const createRangeSummary = (
  attendanceRecords: ApiAsistenciaDTO[],
  students: Estudiante[]
): StudentRangeSummary[] => {
  const summaryMap = new Map<number, StudentRangeSummary>();

  // Initialize summary for all students
  students.forEach(student => {
    if (student && typeof student.id !== 'undefined') {
      summaryMap.set(student.id, {
        studentId: student.id,
        nombreCompleto: `${student.nombre || ''} ${student.apellido || ''}`.trim(),
        avatarUrl: student.avatarUrl,
        totalPresente: 0,
        totalAusente: 0,
        totalTarde: 0,
        totalJustificado: 0,
        totalDiasEnRangoConRegistro: 0,
      });
    }
  });

  // Process attendance records
  attendanceRecords.forEach((record, index) => {
    if (!record) {
      console.error(`Record at index ${index} is undefined/null`);
      return;
    }

    if (typeof record.estudiante === 'undefined' || record.estudiante === null) {
      console.error(`Record at index ${index} has no student ID:`, record);
      return;
    }

    if (typeof record.estado !== 'string') {
      console.error(`Record at index ${index} has invalid estado:`, record);
      return;
    }

    const summary = summaryMap.get(record.estudiante);
    if (summary) {
      summary.totalDiasEnRangoConRegistro++;
      
      switch (record.estado.toUpperCase() as TipoEstadoAsistencia) {
        case 'PRESENTE':
          summary.totalPresente++;
          break;
        case 'AUSENTE':
          summary.totalAusente++;
          break;
        case 'TARDE':
          summary.totalTarde++;
          break;
        case 'JUSTIFICADO':
          summary.totalJustificado++;
          break;
        default:
          console.warn(`Unknown estado '${record.estado}' in record:`, record);
      }
    } else {
      console.warn(`Student with ID ${record.estudiante} from attendance record not found in students list. Record:`, record);
    }
  });

  return Array.from(summaryMap.values());
};