import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  CircularProgress,
  FormHelperText,
  IconButton,
  InputAdornment,
  SelectChangeEvent,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { UserRequestDTO, UserResponseDTO } from '../../types/auth';

interface UserFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (userData: UserRequestDTO) => Promise<void>;
  isEdit: boolean;
  user: UserResponseDTO | null;
}

// Tipos de documento aceptados
const documentTypes = [
  { value: 'DNI', label: 'DNI' },
  { value: 'NIE', label: 'NIE' },
  { value: 'PASAPORTE', label: 'Pasaporte' },
];

// Roles disponibles
const roles = [
  { value: 'ROLE_ADMINISTRADOR', label: 'Administrador' },
  { value: 'ROLE_PROFESOR', label: 'Profesor' },
  { value: 'ROLE_ESTUDIANTE', label: 'Estudiante' },
  { value: 'ROLE_TUTOR', label: 'Tutor' },
];

const initialState: UserRequestDTO = {
  nombre: '',
  apellido: '',
  email: '',
  dni: '',
  tipoDocumento: 'DNI',
  telefono: '',
  contrasena: '',
  institucion: '',
};

const UserForm: React.FC<UserFormProps> = ({ open, onClose, onSave, isEdit, user }) => {
  const [formData, setFormData] = useState<UserRequestDTO>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof UserRequestDTO | 'role', string>>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('');

  // Inicializar el formulario cuando se abre o cambia el usuario
  useEffect(() => {
    if (user && isEdit) {
      setFormData({
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido || '',
        email: user.email,
        dni: user.dni || '',
        tipoDocumento: user.tipoDocumento || 'DNI',
        telefono: user.telefono || '',
        institucion: user.institucion || '',
        // No establecemos la contraseña en el modo de edición
      });
      // Establecer el rol si está disponible
      setSelectedRole(user.rol || '');
    } else {
      setFormData(initialState);
      setSelectedRole('');
    }
    setErrors({});
    setError(null);
  }, [user, isEdit, open]);

  // Manejar cambios en los campos del formulario
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    if (name) {
      if (name === 'role') {
        setSelectedRole(value as string);
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
      
      // Limpiar error del campo específico
      if (errors[name as keyof UserRequestDTO]) {
        setErrors(prev => ({
          ...prev,
          [name]: undefined
        }));
      }
    }
  };

  // Validar el formulario
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UserRequestDTO | 'role', string>> = {};
    
    // Validaciones básicas
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
    if (!formData.apellido.trim()) newErrors.apellido = 'El apellido es obligatorio';
    
    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El formato del email no es válido';
    }
    
    if (!formData.dni.trim()) newErrors.dni = 'El documento es obligatorio';
    if (!formData.telefono.trim()) newErrors.telefono = 'El teléfono es obligatorio';
    if (!formData.institucion.trim()) newErrors.institucion = 'La institución es obligatoria';
    
    // Validar el rol
    if (!selectedRole) {
      newErrors.role = 'El rol es obligatorio';
    }
    
    // Validar contraseña solo en creación
    if (!isEdit && !formData.contrasena) {
      newErrors.contrasena = 'La contraseña es obligatoria';
    } else if (!isEdit && formData.contrasena && formData.contrasena.length < 6) {
      newErrors.contrasena = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar el envío del formulario
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const userData = {
        ...formData,
        rol: selectedRole
      };
      
      await onSave(userData);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Ha ocurrido un error al guardar los datos');
    } finally {
      setLoading(false);
    }
  };

  // Alternar la visibilidad de la contraseña
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>
        {isEdit ? 'Editar Usuario' : 'Nuevo Usuario'}
      </DialogTitle>
      
      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              margin="normal"
              error={!!errors.nombre}
              helperText={errors.nombre}
              required
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              margin="normal"
              error={!!errors.apellido}
              helperText={errors.apellido}
              required
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              error={!!errors.email}
              helperText={errors.email}
              required
              disabled={isEdit} // No permitir cambiar el email en modo edición
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Teléfono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              margin="normal"
              error={!!errors.telefono}
              helperText={errors.telefono}
              required
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth margin="normal" error={!!errors.tipoDocumento}>
              <InputLabel id="document-type-label">Tipo Documento</InputLabel>
              <Select
                labelId="document-type-label"
                name="tipoDocumento"
                value={formData.tipoDocumento}
                onChange={handleChange}
                label="Tipo Documento"
              >
                {documentTypes.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.tipoDocumento && <FormHelperText>{errors.tipoDocumento}</FormHelperText>}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Número de Documento"
              name="dni"
              value={formData.dni}
              onChange={handleChange}
              margin="normal"
              error={!!errors.dni}
              helperText={errors.dni}
              required
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Institución"
              name="institucion"
              value={formData.institucion}
              onChange={handleChange}
              margin="normal"
              error={!!errors.institucion}
              helperText={errors.institucion}
              required
            />
          </Grid>
          
          {!isEdit && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contraseña"
                name="contrasena"
                type={showPassword ? 'text' : 'password'}
                value={formData.contrasena}
                onChange={handleChange}
                margin="normal"
                error={!!errors.contrasena}
                helperText={errors.contrasena || 'Mínimo 6 caracteres'}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          )}
          
          <Grid item xs={12}>
            <FormControl fullWidth margin="normal" error={!!errors.role}>
              <InputLabel id="role-label">Rol</InputLabel>
              <Select
                labelId="role-label"
                name="role"
                value={selectedRole}
                onChange={handleChange}
                label="Rol"
                required
              >
                {roles.map(role => (
                  <MenuItem key={role.value} value={role.value}>
                    {role.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit" disabled={loading}>
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={24} /> : null}
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserForm;