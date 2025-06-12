import React, { useState } from 'react';
import {
  Box,
  Typography,
  Alert,
  Snackbar,
  CardContent,
  Card,
} from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import { UserTable } from '../../features/user/ui/UserTable';
import { useUsers } from "../../features/user/model/useUsers.ts";
import { useStudents } from "../../features/student/model/useStudents.ts";
import { GenericTabs } from "../../components/common";
import { User } from '../../features/user/types';

const ManageUsers: React.FC = () => {
  const { data: userList = [] } = useUsers();
  const { data: studentList = [] } = useStudents();
  const { user } = useAuth();

  // Estado para el tab de roles
  const [selectedRole, setSelectedRole] = useState('all');

  // Estados para paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Estado para snackbar
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error'
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Handlers para paginación
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Handlers para CRUD de usuarios
  const handleEditUser = (user: User) => {
    // Implementar lógica de edición
    console.log('Editar usuario:', user);
  };

  const handleDeleteUser = (user: User) => {
    // Implementar lógica de eliminación
    console.log('Eliminar usuario:', user);
  };

  const handleAddUser = () => {
    // Implementar lógica para agregar usuario
    console.log('Agregar nuevo usuario');
  };

  // Filtrar usuarios por roles
  const profesores = userList.filter(u => u.rol === 'ROLE_PROFESOR');
  const tutores = userList.filter(u => u.rol === 'ROLE_TUTOR');

  // Configuración de las tabs de roles
  const roleTabs = [
    { value: 'all', label: 'Todos' },
    { value: 'ROLE_ADMINISTRADOR', label: 'Admin' },
    { value: 'ROLE_PROFESOR', label: 'Profesor' },
    { value: 'ROLE_ESTUDIANTE', label: 'Estudiante' },
    { value: 'ROLE_TUTOR', label: 'Tutor' },
  ];

  // Si no es administrador, no tiene acceso a esta página
  if (user?.role !== 'ROLE_ADMINISTRADOR') {
    return (
        <Box sx={{ p: 3 }}>
          <Alert severity="error">
            No tienes permisos para acceder a esta página
          </Alert>
        </Box>
    );
  }

  return (
      <Box>
        {/* Cards de estadísticas */}
        <Box display="flex" gap={3} mb={3}>
          <Card sx={{
            background: '#68CB6A',
            color: '#383838',
            width: '265px',
            height: '112px',
            flexShrink: 0
          }}>
            <CardContent>
              <Typography variant="body2" color="rgba(255,255,255,0.8)">
                Cantidad de alumnos
              </Typography>
              <Typography variant="h4" mt={2}>
                {studentList.length}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{
            background: '#FFC340',
            color: '#fff',
            width: '265px',
            height: '112px',
            flexShrink: 0
          }}>
            <CardContent>
              <Typography variant="body2" color="rgba(255,255,255,0.8)">
                Profesores vinculados
              </Typography>
              <Typography variant="h4" mt={2}>
                {profesores.length}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{
            background: '#6FAAF1',
            color: '#fff',
            width: '265px',
            height: '112px',
            flexShrink: 0
          }}>
            <CardContent>
              <Typography variant="body2" color="rgba(255,255,255,0.8)">
                Padres registrados
              </Typography>
              <Typography variant="h4" mt={2}>
                {tutores.length}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Tabs de filtro por roles - MOVIDO AQUÍ DESDE UserTable */}
        <Box mb={2}>
          <GenericTabs
              tabs={roleTabs}
              selectedValue={selectedRole}
              onChange={setSelectedRole}
              ariaLabel="filtro de roles"
          />
        </Box>

        {/* Tabla de usuarios - SIN TABS INTERNAS */}
        <UserTable
            selectedRole={selectedRole}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            onAdd={handleAddUser}
        />

        {/* Snackbar para notificaciones */}
        <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
        >
          <Alert
              onClose={handleCloseSnackbar}
              severity={snackbar.severity}
              sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
  );
};

export default ManageUsers;