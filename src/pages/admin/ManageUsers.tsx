import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
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
import { userService } from '../../services';
import { estudianteService } from '../../services/api/estudianteService';
import { UserResponseDTO, UserRequestDTO } from '../../types';
import UserForm from '../../components/admin/UserForm';
import { useAuth } from '../../hooks/useAuth';
import GenericTabs from '../../components/common/GenericTabs.tsx';
import { GenericTable } from '../../components/common/GenericTable';


// Tipo unificado para manejar ambos tipos de usuarios en el estado y la tabla
// Incluye email como opcional ya que los estudiantes no lo tienen
type CombinedUserResponseDTO = Omit<UserResponseDTO, 'email'> & { email?: string };

const ManageUsers: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalElements, setTotalElements] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [selectedUser, setSelectedUser] = useState<CombinedUserResponseDTO | null>(null);
  const [allCombinedUsers, setAllCombinedUsers] = useState<CombinedUserResponseDTO[]>([]);

  interface Column<T> {
    id: string;
    label: string;
    align?: 'right' | 'left' | 'center';
    render: (value: any, row: T) => React.ReactNode;
  }

  const columns: Column<CombinedUserResponseDTO>[] = [
    {
      id: 'nombre',
      label: 'Nombre',
      render: (_: unknown, row: CombinedUserResponseDTO) => `${row.nombre} ${row.apellido || ''}`,
    },
    { 
      id: 'email', 
      label: 'Email',
      render: (value: string) => value || 'N/A'
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
      )
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
      )
    },
    {
      id: 'acciones',
      label: 'Acciones',
      align: 'right',
      render: (_: unknown, row: CombinedUserResponseDTO) => (
        <IconButton
          size="small"
          onClick={(e) => handleOpenMenu(e, row.id)}
        >
          <MoreVertIcon />
        </IconButton>
      )
    }
  ];


  // Función para cargar usuarios
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let combinedUsers: CombinedUserResponseDTO[] = [];

      if (selectedTab === 'ROLE_ESTUDIANTE') {
        const { estudiantes, totalElements: estTotalElements } = 
          await estudianteService.getAll(0, 10000); // Traer todos los estudiantes para paginar en frontend
        setTotalElements(estTotalElements);
        combinedUsers = estudiantes.map(est => ({
          id: est.id,
          nombre: est.nombre,
          apellido: est.apellido,
          dni: est.dni || '',
          activo: est.activo,
          rol: 'ROLE_ESTUDIANTE',
          email: undefined,
          tipoDocumento: '',
          telefono: '',
          institucionId: 0,
          institucion: ''
        }));
        setAllCombinedUsers(combinedUsers);
      } else if (selectedTab === 'all') {
        const [fetchedUsers, estudiantesResult] = await Promise.all([
          userService.getAll(),
          estudianteService.getAll(0, 10000)
        ]);
        const otherUsers = Array.isArray(fetchedUsers) ? fetchedUsers : [];
        const estudiantes = estudiantesResult.estudiantes;
        const mappedEstudiantes = estudiantes.map(est => ({
          id: est.id,
          nombre: est.nombre,
          apellido: est.apellido,
          dni: est.dni || '',
          activo: est.activo,
          rol: 'ROLE_ESTUDIANTE',
          email: undefined,
          tipoDocumento: '',
          telefono: '',
          institucionId: 0,
          institucion: ''
        }));
        combinedUsers = [...otherUsers, ...mappedEstudiantes];
        setAllCombinedUsers(combinedUsers);
        setTotalElements(combinedUsers.length);
      } else {
        const fetchedUsers = await userService.getAll();
        combinedUsers = Array.isArray(fetchedUsers) ? fetchedUsers : [];
        setTotalElements(combinedUsers.length);
        setAllCombinedUsers(combinedUsers);
      }
    } catch (err) {
      const tabName = selectedTab === 'all' ? 'todos' 
                      : selectedTab === 'ROLE_ESTUDIANTE' ? 'estudiantes' 
                      : 'usuarios';
      console.error(`Error detallado al obtener ${tabName}:`, err);
      setError(`Error al obtener la lista de ${tabName}`);
      setAllCombinedUsers([]);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  }, [selectedTab]);

  // Filtrar usuarios
  const filteredUsers = (allCombinedUsers || [])
    .filter(user => {
      if (selectedTab !== 'all' && selectedTab !== 'ROLE_ESTUDIANTE') {
        return user.rol === selectedTab;
      }
      return true;
    })
    .filter(user =>
      user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  // Actualizar el total de elementos sobre el array filtrado
  useEffect(() => {
    setTotalElements(filteredUsers.length);
  }, [filteredUsers]);

  // Obtener los usuarios a mostrar en la página actual
  //const paginatedUsers = filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
   const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );


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
    // Buscar el usuario seleccionado
    const userToEdit = paginatedUsers.find(user => user.id === selectedUserId);
    if (userToEdit) {
      setSelectedUser(userToEdit);
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
      setLoading(true);
      try {
        await userService.delete(selectedUserId);
        fetchUsers();
        setSnackbar({
          open: true,
          message: 'Usuario eliminado correctamente',
          severity: 'success'
        });
      } catch (err) {
        console.error('Error al eliminar usuario:', err);
        setSnackbar({
          open: true,
          message: 'Error al eliminar usuario',
          severity: 'error'
        });
      } finally {
        setLoading(false);
        setDeleteConfirmOpen(false);
        setSelectedUserId(null);
      }
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

  const handleSaveUser = async (userData: UserRequestDTO) => {
    setLoading(true);
    try {
      let updatedUser;
      if (dialogMode === 'add') {
        updatedUser = await userService.create(userData);
      } else {
        updatedUser = await userService.update(userData);
      }

      if (updatedUser) {
        fetchUsers();
        setOpenDialog(false);
        setSnackbar({
          open: true,
          message: dialogMode === 'add' ? 'Usuario creado correctamente' : 'Usuario actualizado correctamente',
          severity: 'success'
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Error al guardar usuario',
          severity: 'error'
        });
      }
    } catch (err) {
      console.error('Error al conectar con el servidor:', err);
      setSnackbar({
        open: true,
        message: 'Error al conectar con el servidor',
        severity: 'error'
      });
    } finally {
      setLoading(false);
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

  // Cargar usuarios al montar el componente y cuando cambie la pestaña
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    fetchUsers().then(r => r );
    setPage(0);
     
  }, [fetchUsers, selectedTab]);

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

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Mostrar la tabla solo cuando no está cargando */}
  {!loading && (
        <GenericTable
          columns={columns}
          data={paginatedUsers} // Usar datos paginados
          pagination={{
            count: totalElements,
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