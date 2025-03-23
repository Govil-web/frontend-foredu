// src/pages/admin/ManageUsers.tsx (actualizada)

import React, { useState, useEffect } from 'react';
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
  Snackbar
} from '@mui/material';
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { userService } from '../../services/api/userService';
import { UserResponseDTO, UserRequestDTO } from '../../types/auth';
import UserForm from '../../components/admin/UserForm';
import { useAuth } from '../../hooks/useAuth';

const ManageUsers: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserResponseDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [selectedUser, setSelectedUser] = useState<UserResponseDTO | null>(null);

  // Función para cargar usuarios
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userService.getAll();
      if (response.estado) {
        setUsers(response.dataIterable || []);
      } else {
        setError(response.message ?? null);
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar usuarios al montar el componente
  useEffect(() => {
    fetchUsers();
  }, []);

  // Filtrar usuarios según el término de búsqueda
  const filteredUsers = users.filter(user => 
    user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleEdit = () => {
    // Buscar el usuario seleccionado
    const userToEdit = users.find(user => user.id === selectedUserId);
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
        const response = await userService.delete(selectedUserId);
        if (response.estado) {
          fetchUsers();
          setSnackbar({
            open: true,
            message: 'Usuario eliminado correctamente',
            severity: 'success'
          });
        } else {
          setSnackbar({
            open: true,
            message: response.message || 'Error al eliminar usuario',
            severity: 'error'
          });
        }
      } catch (err) {
        setSnackbar({
          open: true,
          message: 'Error al conectar con el servidor',
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
      let response;
      if (dialogMode === 'add') {
        response = await userService.create(userData);
      } else {
        response = await userService.update(userData);
      }

      if (response.estado) {
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
          message: response.message || 'Error al guardar usuario',
          severity: 'error'
        });
      }
    } catch (err) {
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

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Gestión de Usuarios
      </Typography>
      
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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => (
                <TableRow key={user.id}>
                  <TableCell component="th" scope="row">
                    {`${user.nombre} ${user.apellido || ''}`}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={
                        user.rol === 'ROLE_ADMINISTRADOR' ? 'Administrador' : 
                        user.rol === 'ROLE_PROFESOR' ? 'Profesor' :
                        user.rol === 'ROLE_TUTOR' ? 'Tutor' : 'Estudiante'
                      }
                      color={
                        user.rol === 'ROLE_ADMINISTRADOR' ? 'error' :
                        user.rol === 'ROLE_PROFESOR' ? 'primary' :
                        user.rol === 'ROLE_TUTOR' ? 'success' : 'info'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.activo ? 'Activo' : 'Inactivo'}
                      color={user.activo ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={(e) => handleOpenMenu(e, user.id)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No se encontraron usuarios
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      </TableContainer>

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
        user={selectedUser}
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