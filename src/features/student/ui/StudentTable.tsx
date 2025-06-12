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
import { useStudents } from '../model/useStudents';
import { Student } from '../../../types';
import { GenericTable, Column } from '../../../components/common/GenericTable';
import { useLayout } from '../../../contexts/LayoutContext';

interface StudentTableProps {
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
  onAdd: () => void;
}

export const StudentTable: React.FC<StudentTableProps> = ({ onEdit, onDelete }) => {
  //const theme = useTheme();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedStudentId, setSelectedStudentId] = React.useState<number | null>(null);

  const { data: students = [], isLoading, error } = useStudents();
  const { searchTerm } = useLayout();

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, studentId: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedStudentId(studentId);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedStudentId(null);
  };

  const handleEdit = (student: Student) => {
    handleCloseMenu();
    onEdit(student);
  };

  const handleDelete = (student: Student) => {
    handleCloseMenu();
    onDelete(student);
  };

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredStudents = students.filter(student => 
    student.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedStudents = filteredStudents.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const columns: Column[] = [
    {
      id: 'nombre',
      label: 'Nombre',
      render: (_: unknown, row: Record<string, unknown>) => {
        const student = row as unknown as Student;
        return `${student.nombre} ${student.apellido}`;
      }
    },
    {
      id: 'dni',
      label: 'DNI',
      render: (_: unknown, row: Record<string, unknown>) => {
        const student = row as unknown as Student;
        return student.dni || '-';
      }
    },
    {
      id: 'email',
      label: 'Email',
      render: (_: unknown, row: Record<string, unknown>) => {
        const student = row as unknown as Student;
        return student.email || '-';
      }
    },
    {
      id: 'gradoNombre',
      label: 'Grado',
      render: (_: unknown, row: Record<string, unknown>) => {
        const student = row as unknown as Student;
        return student.gradoNombre || '-';
      }
    },
    {
      id: 'activo',
      label: 'Estado',
      render: (_: unknown, row: Record<string, unknown>) => {
        const student = row as unknown as Student;
        return (
          <Chip
            label={student.activo ? 'Activo' : 'Inactivo'}
            color={student.activo ? 'success' : 'default'}
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
        const student = row as unknown as Student;
        return (
          <Box>
            <IconButton 
              size="small" 
              onClick={(e) => handleOpenMenu(e, student.id)}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl) && selectedStudentId === student.id}
              onClose={handleCloseMenu}
            >
              <MenuItem onClick={() => handleEdit(student)}>
                <EditIcon fontSize="small" sx={{ mr: 1 }} />
                Editar
              </MenuItem>
              <MenuItem onClick={() => handleDelete(student)}>
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

      {isLoading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />}
      {error && <Alert severity="error">Error al cargar estudiantes</Alert>}

      <GenericTable
        columns={columns}
        data={paginatedStudents as unknown as Record<string, unknown>[]}
        pagination={{
          count: filteredStudents.length,
          page,
          rowsPerPage,
          onPageChange: handleChangePage,
          onRowsPerPageChange: handleChangeRowsPerPage,
        }}
        headerSx={{
          borderRadius: '14px',
        }}
      />
    </Paper>
  );
}; 
