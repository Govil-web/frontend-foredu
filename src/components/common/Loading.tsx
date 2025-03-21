// src/components/common/Loading.tsx
import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingProps {
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({ message = 'Cargando...' }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <CircularProgress size={60} color="primary" />
      <Typography
        variant="h6"
        sx={{ mt: 2, color: 'text.secondary' }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default Loading;