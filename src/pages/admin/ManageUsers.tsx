// src/pages/admin/ManageUsers.tsx
import React, { useState } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { UserRole } from '../../types/auth';

// Datos de ejemplo
const users = [
  { id: 1, name: 'Juan Pérez', email: 'juan.perez@example.com', role: UserRole.ESTUDIANTE, status: 'Activo' },
  { id: 2, name: 'María García', email: 'maria.garcia@example.com', role: UserRole.PROFESOR, status: 'Activo' },
  { id: 3, name: 'Carlos López', email: 'carlos.lopez@example.com', role: UserRole.TUTOR, status: 'Inactivo' },
  { id: 4, name: 'Sofía Martínez', email: 'sofia.martinez@example.com', role: UserRole.ESTUDIANTE, status: 'Activo' },
  { id: 5, name: 'Luis Rodríguez', email: 'luis.rodriguez@example.com', role: UserRole.ADMIN, status: 'Activo' },
  { id: 6, name: 'Ana Sánchez', email: 'ana.sanchez@example.com', role: UserRole.ESTUDIANTE, status: 'Inactivo' },
  { id: 7, name: 'Pablo González', email: 'pablo.gonzalez@example.com', role: UserRole.PROFESOR, status: 'Activo' },
  { id: 8, name: 'Laura Fernández', email: 'laura.fernandez@example.com', role: UserRole.ESTUDIANTE, status: 'Activo' },
  { id: 9, name: 'Daniel Torres', email: 'daniel.torres@example.com', role: UserRole.TUTOR, status: 'Activo' },
  { id: 10, name: 'Elena Díaz', email: 'elena.diaz@example.com', role: UserRole.ESTUDIANTE, status: 'Inactivo' },
];

// Función para obtener el color del chip según el rol
const getRoleColor = (role: UserRole) => {
  switch (role) {
    case UserRole.ADMIN:
      return 'error';
    case UserRole.PROFESOR:
      return 'primary';
    case UserRole.TUTOR:
      return 'success';
    case UserRole.ESTUDIANTE:
      return 'info';
    default:
      return 'default';
  }
};

const ManageUsers: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  
  // Estado para el formulario
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: UserRole.ESTUDIANTE,
    status: 'Activo'
  });
  
  // Filtrar usuarios según el término de búsqueda
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChangePage = (event: unknown, newPage: number) => {
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
      setFormData({
        name: userToEdit.name,
        email: userToEdit.email,
        role: userToEdit.role,
        status: userToEdit.status
      });
      setDialogMode('edit');
      setOpenDialog(true);
    }
    handleCloseMenu();
  };

  const handleDelete = () => {
    setDeleteConfirmOpen(true);
    handleCloseMenu();
  };

  const confirmDelete = () => {
    console.log('Usuario eliminado:', selectedUserId);
    setDeleteConfirmOpen(false);
    setSelectedUserId(null);
    // Aquí iría la lógica para eliminar el usuario de la base de datos
  };

  const handleAddUser = () => {
    setFormData({
      name: '',
      email: '',
      role: UserRole.ESTUDIANTE,
      status: 'Activo'
    });
    setDialogMode('add');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleRoleChange = (e: SelectChangeEvent) => {
    setFormData({
      ...formData,
      role: e.target.value as UserRole
    });
  };

  const handleStatusChange = (e: SelectChangeEvent) => {
    setFormData({
      ...formData,
      status: e.target.value
    });
  };

  const handleSubmit = () => {
    if (dialogMode === 'add') {
      console.log('Nuevo usuario a añadir:', formData);
      // Aquí iría la lógica para añadir el usuario a la base de datos
    } else {
      console.log('Usuario a actualizar:', selectedUserId, formData);
      // Aquí iría la lógica para actualizar el usuario en la base de datos
    }
    setOpenDialog(false);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Gestión de Usuarios
        </Typography>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddUser}
        >
          Nuevo Usuario
        </Button>
      </Box>
      
      <Paper sx={{ mb: 3, p: 2 }}>
        <TextField
          fullWidth
          placeholder="Buscar usuarios por nombre o email"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

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
                    {user.name}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.role}
                      color={getRoleColor(user.role)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.status}
                      color={user.status === 'Activo' ? 'success' : 'default'}
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

      {/* Diálogo para añadir/editar usuario */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogMode === 'add' ? 'Añadir Nuevo Usuario' : 'Editar Usuario'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Nombre Completo"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Correo Electrónico"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="role-label">Rol</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                value={formData.role}
                label="Rol"
                onChange={handleRoleChange}
              >
                <MenuItem value={UserRole.ADMIN}>Admin</MenuItem>
                <MenuItem value={UserRole.PROFESOR}>Teacher</MenuItem>
                <MenuItem value={UserRole.TUTOR}>Tutor</MenuItem>
                <MenuItem value={UserRole.ESTUDIANTE}>Student</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel id="status-label">Estado</InputLabel>
              <Select
                labelId="status-label"
                id="status"
                value={formData.status}
                label="Estado"
                onChange={handleStatusChange}
              >
                <MenuItem value="Activo">Activo</MenuItem>
                <MenuItem value="Inactivo">Inactivo</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            {dialogMode === 'add' ? 'Añadir' : 'Guardar Cambios'}
          </Button>
        </DialogActions>
      </Dialog>

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
    </Box>
  );
};

export default ManageUsers;