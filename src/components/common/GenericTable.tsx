// components/common/GenericTable.tsx
import React from 'react';
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
} from '@mui/material';

interface Column {
  id: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: any) => React.ReactNode;
}

interface GenericTableProps {
  columns: Column[];
  data: any[];
  pagination?: {
    count: number;
    rowsPerPage: number;
    page: number;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
    onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  };
  headerSx?: SxProps<Theme>;
}

export const GenericTable: React.FC<GenericTableProps> = ({
  columns,
  data,
  pagination,
  headerSx,
}) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead sx={headerSx}>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align || 'left'}
                sx={{ color: 'white' }} // Letras blancas
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align}>
                  {column.render 
                    ? column.render(row[column.id], row) 
                    : row[column.id]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {pagination && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          count={pagination.count}
          rowsPerPage={pagination.rowsPerPage}
          page={pagination.page}
          onPageChange={pagination.onPageChange}
          onRowsPerPageChange={pagination.onRowsPerPageChange}
        />
      )}
    </TableContainer>
  );
};