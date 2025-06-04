// components/common/GenericTable.tsx
import React, { useCallback } from 'react';
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
  TableFooter,
} from '@mui/material';

export interface Column {
  id: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
}

interface GenericTableProps {
  columns: Column[];
  data: Record<string, unknown>[];
  pagination?: {
    count: number;
    rowsPerPage: number;
    page: number;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
    onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  };
  headerSx?: SxProps<Theme>;
  containerSx?: SxProps<Theme>;
  tableSx?: SxProps<Theme>;
}

const GenericTable: React.FC<GenericTableProps> = ({
                                                     columns,
                                                     data,
                                                     pagination,
                                                     headerSx,
                                                     containerSx,
                                                     tableSx,
                                                   }) => {
  const renderCell = useCallback((column: Column, row: Record<string, unknown>) => {
    return column.render
        ? column.render(row[column.id], row)
        : row[column.id];
  }, []);

  const handlePageChange = useCallback((
      event: React.MouseEvent<HTMLButtonElement> | null,
      page: number
  ) => {
    pagination?.onPageChange(event, page);
  }, [pagination]);

  const handleRowsPerPageChange = useCallback((
      event: React.ChangeEvent<HTMLInputElement>
  ) => {
    pagination?.onRowsPerPageChange(event);
  }, [pagination]);

  return (
      <TableContainer
          component={Paper}
          sx={{
            boxShadow: 'none',
            backgroundColor: 'transparent',
            ...containerSx
          }}
      >
        <Table sx={tableSx}>
          <TableHead sx={headerSx}>
            <TableRow>
              {columns.map((column) => (
                  <TableCell
                      key={column.id}
                      align={column.align || 'left'}
                      sx={{
                        color: 'white',
                        fontWeight: 600
                      }}
                  >
                    {column.label}
                  </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  No hay datos para mostrar
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => (
                <TableRow
                    key={(row.id as string) || `row-${index}`}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                >
                  {columns.map((column) => (
                      <TableCell
                          key={column.id}
                          align={column.align || 'left'}
                      >
                        {renderCell(column, row)}
                      </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
          {pagination && (
            <TableFooter>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                count={pagination.count}
                rowsPerPage={pagination.rowsPerPage}
                page={pagination.page}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                sx={{
                  borderTop: '1px solid',
                  borderColor: 'divider',
                }}
              />
            </TableFooter>
          )}
        </Table>
      </TableContainer>
  );
};

// Exportación corregida (memo + default/named en un solo paso)
const MemoizedGenericTable = React.memo(GenericTable);
export { MemoizedGenericTable as GenericTable };
export default MemoizedGenericTable;