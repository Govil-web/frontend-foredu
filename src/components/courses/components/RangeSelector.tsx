import React from 'react';
import { Grid, TextField, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface RangeSelectorProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onSearch: () => void;
  loading: boolean;
}

export const RangeSelector: React.FC<RangeSelectorProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onSearch,
  loading
}) => {
  return (
    <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
      <Grid item xs={12} sm={5}>
        <TextField
          fullWidth
          type="date"
          label="Fecha Inicio"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          InputLabelProps={{ shrink: true }}
          size="small"
        />
      </Grid>
      <Grid item xs={12} sm={5}>
        <TextField
          fullWidth
          type="date"
          label="Fecha Fin"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          InputLabelProps={{ shrink: true }}
          size="small"
        />
      </Grid>
      <Grid item xs={12} sm={2}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<SearchIcon />}
          onClick={onSearch}
          disabled={loading}
        >
          Buscar
        </Button>
      </Grid>
    </Grid>
  );
};