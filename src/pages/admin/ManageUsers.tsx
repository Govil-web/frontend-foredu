import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  IconButton,
  InputAdornment,
  Chip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useUsers } from '../../hooks/useUsers';
import { useCreateUser } from '../../hooks/useCreateUser';
import { useUpdateUser } from '../../hooks/useUpdateUser';
import { useDeleteUser } from '../../hooks/useDeleteUser';
import { User } from '../../mappers/userMapper';
import UserForm from '../../components/admin/UserForm';
import { useAuth } from '../../hooks/useAuth';
import GenericTabs from '../../components/common/GenericTabs.tsx';
import { GenericTable } from '../../components/common/GenericTable';

// Adaptar User a Record<string, unknown> para la tabla
type UserRow = Record<string, unknown>;

const ManageUsers: React.FC = () => {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState<string>('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Hooks de React Query
  const { users, isLoading, error, refetch } = useUsers();
  const { mutate: createUser, isLoading: isCreating } = useCreateUser();
  const { mutate: updateUser, isLoading: isUpdating } = useUpdateUser();
  const { mutate: deleteUser, isLoading: isDeleting } = useDeleteUser();

  // Columnas de la tabla (ajustar render para aceptar Record<string, unknown>)
  const columns = [
    {
      id: 'nombre',
      label: 'Nombre',
      render: (_: unknown, row: UserRow) => `${row.nombre} ${row.apellido || ''}`,
    },
    {
      id: 'email',
      label: 'Email',
      render: (value: string) => value || 'N/A',
    },
    {
      id: 'rol',
      label: 'Rol',
      render: (value: string) => (
        <Chip
          label={
            value === 'ROLE_ADMINISTRADOR' ? 'Administrador' :
            value === 'ROLE_PROFESOR' ? 'Profesor' :
            value === 'ROLE_TUTOR' ? 'Tutor' :
            value === 'ROLE_ESTUDIANTE' ? 'Estudiante' : 'Desconocido'
          }
          color={
            value === 'ROLE_ADMINISTRADOR' ? 'error' :
            value === 'ROLE_PROFESOR' ? 'primary' :
            value === 'ROLE_TUTOR' ? 'success' :
            value === 'ROLE_ESTUDIANTE' ? 'info' : 'default'
          }
          size="small"
        />
      ),
    },
    {
      id: 'activo',
      label: 'Estado',
      render: (value: boolean) => (
        <Chip
          label={value ? 'Activo' : 'Inactivo'}
          color={value ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    {
      id: 'acciones',
      label: 'Acciones',
      align: 'right',
      render: (_: unknown, row: UserRow) => (
        <IconButton size="small" onClick={(e) => handleOpenMenu(e, row.id as number)}>
          <MoreVertIcon />
        </IconButton>
      ),
    },
  ];

  // Adaptar users a UserRow[] para la tabla
  const filteredUsers = (users || [])
    .filter((user) => {
      if (selectedTab !== 'all' && selectedTab !== 'ROLE_ESTUDIANTE') {
        return user.rol === selectedTab;
      }
      return true;
    })
    .filter((user) =>
      user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .map((user) => ({ ...user } as UserRow));

  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Handlers
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, userId: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedUserId(userId);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedUserId(null);
  };

  const handleTabChange = (newValue: string) => {
    setSelectedTab(newValue);
    setPage(0);
  };

  const handleEdit = () => {
    const userToEdit = paginatedUsers.find((user) => user.id === selectedUserId);
    if (userToEdit) {
      setSelectedUser(userToEdit as User);
      setDialogMode('edit');
      setOpenDialog(true);
    }
    handleCloseMenu();
  };

  const handleDelete = () => {
    setDeleteConfirmOpen(true);
    handleCloseMenu();
  };

  const confirmDelete = async () => {
    if (selectedUserId) {
      deleteUser(selectedUserId, {
        onSuccess: () => {
          setSnackbar({
            open: true,
            message: 'Usuario eliminado correctamente',
            severity: 'success',
          });
        },
        onError: () => {
          setSnackbar({
            open: true,
            message: 'Error al eliminar usuario',
            severity: 'error',
          });
        },
        onSettled: () => {
          setDeleteConfirmOpen(false);
          setSelectedUserId(null);
        },
      });
    }
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setDialogMode('add');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Adaptar handleSaveUser para aceptar UserRequestDTO y convertir a User
  const handleSaveUser = async (userData: import('../../types/auth').UserRequestDTO) => {
    // Convertir UserRequestDTO a User (puedes ajustar según tus reglas de negocio)
    const user: User = {
      ...userData,
      id: userData.id ?? 0,
      rol: selectedUser?.rol || 'ROLE_ESTUDIANTE', // O usa el rol seleccionado en el formulario
      activo: true, // O ajusta según lógica
    };
    if (dialogMode === 'add') {
      createUser(user, {
        onSuccess: () => {
          setSnackbar({
            open: true,
            message: 'Usuario creado correctamente',
            severity: 'success',
          });
          setOpenDialog(false);
        },
        onError: () => {
          setSnackbar({
            open: true,
            message: 'Error al crear usuario',
            severity: 'error',
          });
        },
      });
    } else if (dialogMode === 'edit') {
      updateUser(user, {
        onSuccess: () => {
          setSnackbar({
            open: true,
            message: 'Usuario actualizado correctamente',
            severity: 'success',
          });
          setOpenDialog(false);
        },
        onError: () => {
          setSnackbar({
            open: true,
            message: 'Error al actualizar usuario',
            severity: 'error',
          });
        },
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

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
      <Paper sx={{ mb: 3, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <TextField
            placeholder="Buscar usuarios por nombre o email"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: '70%' }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddUser}
          >
            Nuevo Usuario
          </Button>
        </Box>
      </Paper>

      {/* Barra de Pestañas */}
      <GenericTabs
          tabs={[
            { value: 'all', label: 'Todos' },
            { value: 'ROLE_ESTUDIANTE', label: 'Alumnos' },
            { value: 'ROLE_PROFESOR', label: 'Profesores' },
            { value: 'ROLE_TUTOR', label: 'Tutores' },
            { value: 'ROLE_ADMINISTRADOR', label: 'Administradores' }
          ]}
          selectedValue={selectedTab}
          onChange={handleTabChange}
          ariaLabel="filtrar usuarios por rol"
          sx={{ mb: 3 }}
      />

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.message}
        </Alert>
      )}

      {/* Mostrar la tabla solo cuando no está cargando */}
  {!isLoading && (
        <GenericTable
          columns={columns}
          data={paginatedUsers}
          pagination={{
            count: filteredUsers.length,
            rowsPerPage,
            page,
            onPageChange: handleChangePage,
            onRowsPerPageChange: handleChangeRowsPerPage,
          }}
          headerSx={{ 
            backgroundColor: 'secondary.main', 
            '& th': { color: 'white' } 
          }}
        />
      )}

      {/* Menú de acciones */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleEdit}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Editar
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Eliminar
        </MenuItem>
      </Menu>

      {/* Formulario para añadir/editar usuario */}
      <UserForm 
        open={openDialog} 
        onClose={handleCloseDialog} 
        onSave={handleSaveUser}
        isEdit={dialogMode === 'edit'}
        user={selectedUser ? { ...selectedUser, email: selectedUser.email || '' } : null}
      />

      {/* Diálogo de confirmación para eliminar */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancelar</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para mensajes */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ManageUsers;