// hooks/useAsistenciaState.ts
import { useState } from 'react';
import { Estudiante } from '../../../types';
import { StudentDailyInput, StudentRangeSummary } from '../AsistenciaTab';

type ViewMode = 'input' | 'rangeView' ;

export const useAsistenciaState = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('input');
  const [rangeStartDate, setRangeStartDate] = useState<Date | null>(null);
  const [rangeEndDate, setRangeEndDate] = useState<Date | null>(null);
  const [rangeViewData, setRangeViewData] = useState<StudentRangeSummary[]>([]);
  const [studentsForInput, setStudentsForInput] = useState<StudentDailyInput[]>([]);
  const [allStudentsInGrade, setAllStudentsInGrade] = useState<Estudiante[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  return {
    viewMode,
    setViewMode,
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
  };
};