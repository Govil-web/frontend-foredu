import React, { useState } from 'react';
import {
  Box, Typography, Button, Grid, Checkbox, TextField, FormControlLabel
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { StudentDailyInput } from '../AsistenciaTab';

interface DailyAttendanceInputProps {
  students: StudentDailyInput[];
  onStudentsChange: (students: StudentDailyInput[]) => void;
  onSubmit: () => void;
  loading: boolean;
}

export const DailyAttendanceInput: React.FC<DailyAttendanceInputProps> = ({
  students,
  onStudentsChange,
  onSubmit,
  loading
}) => {
  const [checkAll, setCheckAll] = useState(true);

  const handleCheckAllChange = (checked: boolean) => {
    setCheckAll(checked);
    const updatedStudents = students.map(student => ({
      ...student,
      isPresent: checked,
      justificativo: checked ? '' : student.justificativo
    }));
    onStudentsChange(updatedStudents);
  };

  const handleStudentCheckChange = (studentId: number, checked: boolean) => {
    const updatedStudents = students.map(student =>
      student.studentId === studentId
        ? { ...student, isPresent: checked, justificativo: checked ? '' : student.justificativo }
        : student
    );
    onStudentsChange(updatedStudents);
    
    // Update check all state
    const allPresent = updatedStudents.every(s => s.isPresent);
    setCheckAll(allPresent);
  };

  const handleJustificativoChange = (studentId: number, justificativo: string) => {
    const updatedStudents = students.map(student =>
      student.studentId === studentId
        ? { ...student, justificativo }
        : student
    );
    onStudentsChange(updatedStudents);
  };

  const getCheckboxIcon = (student: StudentDailyInput) => {
    if (student.isPresent) {
      return <CheckIcon sx={{ color: 'success.main' }} />;
    }
    if (student.justificativo.trim()) {
      return <CloseIcon sx={{ color: 'error.main' }} />;
    }
    return <CheckIcon sx={{ color: 'grey.400' }} />;
  };

  return (
    <Box>
      {/* Check All */}
      <Box sx={{ mb: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={checkAll}
              onChange={(e) => handleCheckAllChange(e.target.checked)}
              sx={{
                color: checkAll ? 'success.main' : 'grey.400',
                '&.Mui-checked': {
                  color: 'success.main',
                }
              }}
            />
          }
          label={
            <Typography variant="subtitle1" fontWeight="bold">
              Marcar todos como presentes
            </Typography>
          }
        />
      </Box>

      {/* Students List */}
      <Grid container spacing={2}>
        {students.map((student) => (
          <Grid item xs={12} key={student.studentId}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 2,
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 1,
                backgroundColor: student.isPresent ? 'success.50' : 'grey.50'
              }}
            >
              {/* Avatar */}
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  backgroundColor: student.avatarUrl ? 'transparent' : '#1976d2',
                  backgroundImage: student.avatarUrl ? `url(${student.avatarUrl})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  mr: 2,
                  flexShrink: 0
                }}
              >
                {!student.avatarUrl && student.nombreCompleto?.[0]}
              </Box>

              {/* Student Name */}
              <Box sx={{ flex: 1, mr: 2 }}>
                <Typography variant="body1" fontWeight="medium">
                  {student.nombreCompleto}
                </Typography>
              </Box>

              {/* Attendance Checkbox */}
              <Box sx={{ mr: 2 }}>
                <Checkbox
                  checked={student.isPresent}
                  onChange={(e) => handleStudentCheckChange(student.studentId, e.target.checked)}
                  icon={<CheckIcon sx={{ color: 'grey.400' }} />}
                  checkedIcon={getCheckboxIcon(student)}
                  sx={{
                    color: student.isPresent ? 'success.main' : 'grey.400',
                    '&.Mui-checked': {
                      color: student.justificativo.trim() ? 'error.main' : 'success.main',
                    }
                  }}
                />
              </Box>

              {/* Justification Input */}
              {!student.isPresent && (
                <Box sx={{ flex: 1, maxWidth: 300 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Justificación de inasistencia"
                    value={student.justificativo}
                    onChange={(e) => handleJustificativoChange(student.studentId, e.target.value)}
                    variant="outlined"
                  />
                </Box>
              )}
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Submit Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={onSubmit}
          disabled={loading || students.length === 0}
          size="large"
        >
          Guardar Asistencia del Día
        </Button>
      </Box>
    </Box>
  );
};