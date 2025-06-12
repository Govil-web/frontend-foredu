import React from 'react';
import {
  Box,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  Alert,
  Chip,
  //useTheme,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useUsers } from '../model/useUsers';
import { User } from '../types';
import { GenericTable } from '../../../components/common/GenericTable';
import { useLayout } from '../../../contexts/LayoutContext';
import { studentApi } from '../../student/api/studentApi';
import { studentMapper } from '../../student/api/studentMapper';
import { Student } from '../../student/types';

interface UserTableProps {
  selectedRole: string; // NUEVA PROP - recibida desde ManageUsers
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onAdd: () => void;
}

// Mapeador para convertir Student a User
const mapStudentToUser = (student: Student): User => ({
  id: student.id,
  nombre: student.nombre,
  apellido: student.apellido,
  email: student.dni ? `${student.dni}@estudiante.edu` : '',
  rol: 'ROLE_ESTUDIANTE',
  activo: student.activo || false,
  dni: student.dni || '',
  tipoDocumento: 'DNI',
  telefono: '',
  institucion: '',
});

export const UserTable: React.FC<UserTableProps> = ({
                                                      selectedRole, // RECIBIDO COMO PROP
                                                      page,
                                                      rowsPerPage,
                                                      onPageChange,
                                                      onRowsPerPageChange,
                                                      onEdit,
                                                      onDelete,
                                                    }) => {
  //const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedUserId, setSelectedUserId] = React.useState<number | null>(null);
  const [students, setStudents] = React.useState<User[]>([]);
  const [loadingStudents, setLoadingStudents] = React.useState(false);

  const { data: users = [], isLoading, error } = useUsers();
  const { searchTerm } = useLayout();

  // Cargar estudiantes cuando se selecciona la pestaña de estudiantes
  React.useEffect(() => {
    const loadStudents = async () => {
      if (selectedRole === 'ROLE_ESTUDIANTE') {
        setLoadingStudents(true);
        try {
          const response = await studentApi.getAll();
          const mappedStudents = response.data.map(studentMapper.fromApi).map(mapStudentToUser);
          setStudents(mappedStudents);
        } catch (error) {
          console.error('Error loading students:', error);
        } finally {
          setLoadingStudents(false);
        }
      }
    };

    loadStudents();
  }, [selectedRole]);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, userId: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedUserId(userId);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedUserId(null);
  };

  const handleEdit = (user: User) => {
    handleCloseMenu();
    onEdit(user);
  };

  const handleDelete = (user: User) => {
    handleCloseMenu();
    onDelete(user);
  };

  // Filtrado por rol y búsqueda
  const filteredUsers = React.useMemo(() => {
    if (selectedRole === 'ROLE_ESTUDIANTE') {
      return students.filter(user =>
          user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return users.filter(user => {
      const matchesRole = selectedRole === 'all' || user.rol === selectedRole;
      const matchesSearch = user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesRole && matchesSearch;
    });
  }, [users, students, selectedRole, searchTerm]);

  const paginatedUsers = filteredUsers.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
  );

  const columns = [
    {
      id: 'nombre',
      label: 'Nombre',
      render: (_: unknown, row: Record<string, unknown>) => {
        const user = row as unknown as User;
        return `${user.nombre} ${user.apellido}`;
      }
    },
    {
      id: 'email',
      label: 'Email',
      render: (_: unknown, row: Record<string, unknown>) => {
        const user = row as unknown as User;
        return user.email || '-';
      }
    },
    {
      id: 'rol',
      label: 'Rol',
      render: (_: unknown, row: Record<string, unknown>) => {
        const user = row as unknown as User;
        return user.rol || '-';
      }
    },
    {
      id: 'activo',
      label: 'Estado',
      render: (_: unknown, row: Record<string, unknown>) => {
        const user = row as unknown as User;
        return (
            <Chip
                label={user.activo ? 'Activo' : 'Inactivo'}
                color={user.activo ? 'success' : 'default'}
                size="small"
            />
        );
      }
    },
    {
      id: 'actions',
      label: 'Acciones',
      align: 'right' as const,
      render: (_: unknown, row: Record<string, unknown>) => {
        const user = row as unknown as User;
        return (
            <Box>
              <IconButton
                  size="small"
                  onClick={(e) => handleOpenMenu(e, user.id)}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl) && selectedUserId === user.id}
                  onClose={handleCloseMenu}
              >
                <MenuItem onClick={() => handleEdit(user)}>
                  <EditIcon fontSize="small" sx={{ mr: 1 }} />
                  Editar
                </MenuItem>
                <MenuItem onClick={() => handleDelete(user)}>
                  <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                  Eliminar
                </MenuItem>
              </Menu>
            </Box>
        );
      }
    }
  ];

  return (
      <Paper sx={{ p: 2 }}>

        {(isLoading || loadingStudents) && (
            <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />
        )}

        {error && (
            <Alert severity="error">Error al cargar usuarios</Alert>
        )}

        <GenericTable
            columns={columns}
            data={paginatedUsers as unknown as Record<string, unknown>[]}
            pagination={{
              page,
              rowsPerPage,
              onPageChange,
              onRowsPerPageChange,
              count: filteredUsers.length
            }}
            loading={isLoading || loadingStudents}
            headerSx={{
              borderRadius: '14px',
            }}
        />
      </Paper>
  );
};