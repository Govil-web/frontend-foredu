import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  MenuItem,
} from '@mui/material';
import { StudentRequestDTO, Student } from '../types';

interface StudentFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (studentData: StudentRequestDTO) => Promise<void>;
  isEdit: boolean;
  student: Student | null;
}

const initialState: StudentRequestDTO = {
  nombre: '',
  apellido: '',
  dni: '',
  activo: true,
  genero: '',
  gradoId: undefined,
  gradoNombre: '',
  avatarUrl: '',
};

const genderOptions = [
  { value: 'M', label: 'Masculino' },
  { value: 'F', label: 'Femenino' },
  { value: 'O', label: 'Otro' },
];

const StudentForm: React.FC<StudentFormProps> = ({ open, onClose, onSave, isEdit, student }) => {
  const [formData, setFormData] = useState<StudentRequestDTO>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof StudentRequestDTO, string>>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (student && isEdit) {
      setFormData({
        id: student.id,
        nombre: student.nombre,
        apellido: student.apellido,
        dni: student.dni,
        activo: student.activo,
        genero: student.genero,
        gradoId: student.gradoId,
        gradoNombre: student.gradoNombre,
        avatarUrl: student.avatarUrl,
      });
    } else {
      setFormData(initialState);
    }
    setErrors({});
    setError(null);
  }, [student, isEdit, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof StudentRequestDTO]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof StudentRequestDTO, string>> = {};
    if (!formData.nombre?.trim()) newErrors.nombre = 'El nombre es obligatorio';
    if (!formData.apellido?.trim()) newErrors.apellido = 'El apellido es obligatorio';
    if (!formData.dni?.trim()) newErrors.dni = 'El DNI es obligatorio';
    if (!formData.genero) newErrors.genero = 'El género es obligatorio';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    setError(null);
    try {
      await onSave(formData);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Ha ocurrido un error al guardar los datos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEdit ? 'Editar Estudiante' : 'Nuevo Estudiante'}</DialogTitle>
      <DialogContent dividers>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              error={!!errors.nombre}
              helperText={errors.nombre}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              error={!!errors.apellido}
              helperText={errors.apellido}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="DNI"
              name="dni"
              value={formData.dni}
              onChange={handleChange}
              error={!!errors.dni}
              helperText={errors.dni}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Género"
              name="genero"
              value={formData.genero || ''}
              onChange={handleChange}
              error={!!errors.genero}
              helperText={errors.genero}
              margin="normal"
            >
              {genderOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Grado"
              name="gradoNombre"
              value={formData.gradoNombre || ''}
              onChange={handleChange}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Avatar URL"
              name="avatarUrl"
              value={formData.avatarUrl || ''}
              onChange={handleChange}
              margin="normal"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" disabled={loading}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : isEdit ? 'Guardar Cambios' : 'Crear Estudiante'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StudentForm; 