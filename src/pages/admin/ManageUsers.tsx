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
  Tabs,
  Tab,
} from '@mui/material';
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import GenericTabs from '../../components/common/GenericTabs.tsx';
import { GenericTable } from '../../components/common/GenericTable';
import { UserTable } from '../../features/user/ui/UserTable';
import UserForm from '../../features/user/ui/UserForm';
import { useCreateUser } from '../../features/user/model/useCreateUser';
import { useUpdateUser } from '../../features/user/model/useUpdateUser';
import { useDeleteUser } from '../../features/user/model/useDeleteUser';
import { User, UserRequestDTO, UserResponseDTO } from '../../features/user/types';
import { StudentTable } from '../../features/student/ui/StudentTable';
import StudentForm from '../../features/student/ui/StudentForm';
import { useCreateStudent } from '../../features/student/model/useCreateStudent';
import { useUpdateStudent } from '../../features/student/model/useUpdateStudent';
import { useDeleteStudent } from '../../features/student/model/useDeleteStudent';
import { Student, StudentRequestDTO } from '../../features/student/types';

const ManageUsers: React.FC = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const [selectedUser, setSelectedUser] = useState<UserResponseDTO | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [openStudentForm, setOpenStudentForm] = useState(false);
  const [isEditStudent, setIsEditStudent] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [deleteStudentDialogOpen, setDeleteStudentDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  // Hooks de React Query
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const createStudent = useCreateStudent();
  const updateStudent = useUpdateStudent();
  const deleteStudent = useDeleteStudent();

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
    setTab(parseInt(newValue, 10));
    setPage(0);
  };

  const handleEdit = (user: User) => {
    setIsEdit(true);
    setSelectedUser(user as UserResponseDTO);
    setOpenForm(true);
  };

  const handleDelete = (user: User) => {
    setUserToDelete(user);
    setDeleteConfirmOpen(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSaveUser = async (userData: UserRequestDTO) => {
    if (isEdit && selectedUser) {
      await updateUser.mutateAsync({ ...selectedUser, ...userData } as User, {
        onSuccess: () => {
          setSnackbar({
            open: true,
            message: 'Usuario actualizado correctamente',
            severity: 'success',
          });
          setOpenForm(false);
        },
        onError: () => {
          setSnackbar({
            open: true,
            message: 'Error al actualizar usuario',
            severity: 'error',
          });
        },
      });
    } else {
      await createUser.mutateAsync(userData as User, {
        onSuccess: () => {
          setSnackbar({
            open: true,
            message: 'Usuario creado correctamente',
            severity: 'success',
          });
          setOpenForm(false);
        },
        onError: () => {
          setSnackbar({
            open: true,
            message: 'Error al crear usuario',
            severity: 'error',
          });
        },
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      await deleteUser.mutateAsync(userToDelete.id, {
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
          setUserToDelete(null);
        },
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleAdd = () => {
    setIsEdit(false);
    setSelectedUser(null);
    setOpenForm(true);
  };

  const handleAddStudent = () => {
    setIsEditStudent(false);
    setSelectedStudent(null);
    setOpenStudentForm(true);
  };

  const handleEditStudent = (student: Student) => {
    setIsEditStudent(true);
    setSelectedStudent(student);
    setOpenStudentForm(true);
  };

  const handleDeleteStudent = (student: Student) => {
    setStudentToDelete(student);
    setDeleteStudentDialogOpen(true);
  };

  const handleSaveStudent = async (studentData: StudentRequestDTO) => {
    if (isEditStudent && selectedStudent) {
      await updateStudent.mutateAsync({ ...selectedStudent, ...studentData }, {
        onSuccess: () => {
          setSnackbar({
            open: true,
            message: 'Estudiante actualizado correctamente',
            severity: 'success',
          });
          setOpenStudentForm(false);
        },
        onError: () => {
          setSnackbar({
            open: true,
            message: 'Error al actualizar estudiante',
            severity: 'error',
          });
        },
      });
    } else {
      await createStudent.mutateAsync(studentData, {
        onSuccess: () => {
          setSnackbar({
            open: true,
            message: 'Estudiante creado correctamente',
            severity: 'success',
          });
          setOpenStudentForm(false);
        },
        onError: () => {
          setSnackbar({
            open: true,
            message: 'Error al crear estudiante',
            severity: 'error',
          });
        },
      });
    }
  };

  const handleConfirmDeleteStudent = async () => {
    if (studentToDelete) {
      await deleteStudent.mutateAsync(studentToDelete.id, {
        onSuccess: () => {
          setSnackbar({
            open: true,
            message: 'Estudiante eliminado correctamente',
            severity: 'success',
          });
        },
        onError: () => {
          setSnackbar({
            open: true,
            message: 'Error al eliminar estudiante',
            severity: 'error',
          });
        },
        onSettled: () => {
          setDeleteStudentDialogOpen(false);
          setStudentToDelete(null);
        },
      });
    }
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
            onClick={() => {
              setIsEdit(false);
              setSelectedUser(null);
              setOpenForm(true);
            }}
          >
            Nuevo Usuario
          </Button>
        </Box>
      </Paper>

      {/* Barra de Pestañas */}
      <Tabs value={tab} onChange={(_, v) => setTab(v)}>
        <Tab label="Usuarios" />
        <Tab label="Estudiantes" />
      </Tabs>

      {/* Tablas y formularios FSD */}
      {tab === 0 && (
        <>
          <UserTable onEdit={handleEdit} onDelete={handleDelete} onAdd={handleAdd} />
          <UserForm open={openForm} onClose={() => { setOpenForm(false); setSelectedUser(null); }} onSave={handleSaveUser} isEdit={isEdit} user={selectedUser} />
          <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogContent>¿Estás seguro de que deseas eliminar este usuario?</DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteConfirmOpen(false)} color="secondary">Cancelar</Button>
              <Button onClick={handleConfirmDelete} color="error" variant="contained">Eliminar</Button>
            </DialogActions>
          </Dialog>
        </>
      )}
      {tab === 1 && (
        <>
          <StudentTable onEdit={handleEditStudent} onDelete={handleDeleteStudent} onAdd={handleAddStudent} />
          <StudentForm open={openStudentForm} onClose={() => { setOpenStudentForm(false); setSelectedStudent(null); }} onSave={handleSaveStudent} isEdit={isEditStudent} student={selectedStudent} />
          <Dialog open={deleteStudentDialogOpen} onClose={() => setDeleteStudentDialogOpen(false)}>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogContent>¿Estás seguro de que deseas eliminar este estudiante?</DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteStudentDialogOpen(false)} color="secondary">Cancelar</Button>
              <Button onClick={handleConfirmDeleteStudent} color="error" variant="contained">Eliminar</Button>
            </DialogActions>
          </Dialog>
        </>
      )}

      {/* Snackbar para mensajes */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ManageUsers;