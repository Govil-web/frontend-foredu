import React, { useCallback, useState } from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Paper,
  SxProps,
  Theme,
  CircularProgress,
  Box,
  useTheme,
} from '@mui/material';

export interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: unknown) => string | number;
  render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
}

export interface PaginationProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface GenericTableProps {
  columns: Column[];
  data: Record<string, unknown>[];
  pagination?: PaginationProps;
  loading?: boolean;
  headerSx?: SxProps<Theme>;
  containerSx?: SxProps<Theme>;
  tableSx?: SxProps<Theme>;
  emptyMessage?: string;
}

const GenericTable: React.FC<GenericTableProps> = ({
                                                     columns,
                                                     data,
                                                     pagination,
                                                     loading = false,
                                                     headerSx,
                                                     containerSx,
                                                     tableSx,
                                                     emptyMessage = "No hay datos disponibles",
                                                   }) => {
  const theme = useTheme();
  const [internalPage, setInternalPage] = useState(0);
  const [internalRowsPerPage, setInternalRowsPerPage] = useState(5);

  const page = pagination?.page ?? internalPage;
  const rowsPerPage = pagination?.rowsPerPage ?? internalRowsPerPage;
  const count = pagination?.count ?? data.length;

  const handlePageChange = useCallback((
      event: React.MouseEvent<HTMLButtonElement> | null,
      newPage: number
  ) => {
    if (pagination?.onPageChange) {
      pagination.onPageChange(event, newPage);
    } else {
      setInternalPage(newPage);
    }
  }, [pagination]);

  const handleRowsPerPageChange = useCallback((
      event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    if (pagination?.onRowsPerPageChange) {
      pagination.onRowsPerPageChange(event);
    } else {
      setInternalRowsPerPage(newRowsPerPage);
      setInternalPage(0);
    }
  }, [pagination]);

  const displayData = pagination
      ? data
      : data.slice(internalPage * internalRowsPerPage, internalPage * internalRowsPerPage + internalRowsPerPage);

  const defaultHeaderSx: SxProps<Theme> = {
    backgroundColor: theme.palette.secondary.main,
    borderRadius: '14px',
    zIndex: 1200,
    '& .MuiTableCell-head': {
      color: 'white',
      backgroundColor: theme.palette.secondary.main,
    },
    ...headerSx
  };

  const renderCellContent = (column: Column, value: unknown, row: Record<string, unknown>): React.ReactNode => {
    if (column.render) {
      return column.render(value, row);
    }

    if (column.format) {
      return column.format(value);
    }

    if (value === null || value === undefined) {
      return '';
    }

    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    }

    return String(value);
  };

  const getRowKey = (row: Record<string, unknown>, index: number): string => {
    if (row.id !== undefined && row.id !== null) {
      return String(row.id);
    }

    return `row-${index}`;
  };

  return (
      <Paper sx={{ width: '100%', overflow: 'hidden', ...tableSx }}>
        <TableContainer sx={{ maxHeight: 440, ...containerSx }}>
          <Table aria-label="table">
            <TableHead sx={defaultHeaderSx}>
              <TableRow>
                {columns.map((column) => (
                    <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <CircularProgress />
                      </Box>
                    </TableCell>
                  </TableRow>
              ) : displayData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} align="center">
                      {emptyMessage}
                    </TableCell>
                  </TableRow>
              ) : (
                  displayData.map((row, index) => (
                      <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={getRowKey(row, index)}
                      >
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                              <TableCell key={column.id} align={column.align}>
                                {renderCellContent(column, value, row)}
                              </TableCell>
                          );
                        })}
                      </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {(data.length > 0 || pagination) && (
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={count}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                labelRowsPerPage="Filas por página"
                labelDisplayedRows={({ from, to, count: totalCount }) => `${from}-${to} de ${totalCount}`}
            />
        )}
      </Paper>
  );
};

const MemoizedGenericTable = React.memo(GenericTable);
export { MemoizedGenericTable as GenericTable };
export default MemoizedGenericTable;
