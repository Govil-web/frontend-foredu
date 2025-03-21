// src/components/design-system/Logo/Logo.tsx
import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

interface LogoProps {
  variant?: 'horizontal' | 'vertical' | 'isotype';
  size?: 'small' | 'medium' | 'large';
}

const Logo: React.FC<LogoProps> = ({ 
  variant = 'horizontal', 
  size = 'medium' 
}) => {
  const theme = useTheme();
  
  // Definir dimensiones según el tamaño
  let width, height, fontSize;
  switch (size) {
    case 'small':
      width = variant === 'horizontal' ? 120 : 40;
      height = variant === 'horizontal' ? 32 : 40;
      fontSize = '1rem';
      break;
    case 'large':
      width = variant === 'horizontal' ? 200 : 60;
      height = variant === 'horizontal' ? 52 : 60;
      fontSize = '1.5rem';
      break;
    default: // medium
      width = variant === 'horizontal' ? 160 : 50;
      height = variant === 'horizontal' ? 42 : 50;
      fontSize = '1.25rem';
  }

  // Simulación del logotipo con colores de Foredú
  if (variant === 'horizontal') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box 
          sx={{ 
            width: height * 0.8, 
            height: height, 
            backgroundColor: theme.palette.secondary.main,
            borderRadius: '4px 0 0 4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        />
        <Box 
          sx={{ 
            width: height * 0.8, 
            height: height, 
            backgroundColor: theme.palette.primary.main,
            borderRadius: '0 4px 4px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        />
        <Typography 
          variant="h6" 
          sx={{ 
            ml: 1.5,
            fontWeight: 'bold',
            color: theme.palette.secondary.main,
            fontSize
          }}
        >
          Foredü
        </Typography>
      </Box>
    );
  }

  if (variant === 'vertical') {
    return (
      <Box sx={{ textAlign: 'center' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box 
            sx={{ 
              width: width / 2, 
              height: height, 
              backgroundColor: theme.palette.secondary.main,
              borderRadius: '4px 0 0 4px'
            }}
          />
          <Box 
            sx={{ 
              width: width / 2, 
              height: height, 
              backgroundColor: theme.palette.primary.main,
              borderRadius: '0 4px 4px 0'
            }}
          />
        </Box>
        <Typography 
          variant="h6" 
          sx={{ 
            mt: 1, 
            fontWeight: 'bold',
            color: theme.palette.secondary.main,
            fontSize
          }}
        >
          Foredü
        </Typography>
      </Box>
    );
  }

  // Isotype (solo símbolo)
  return (
    <Box sx={{ display: 'flex' }}>
      <Box 
        sx={{ 
          width: width / 2, 
          height: height, 
          backgroundColor: theme.palette.secondary.main,
          borderRadius: '4px 0 0 4px'
        }}
      />
      <Box 
        sx={{ 
          width: width / 2, 
          height: height, 
          backgroundColor: theme.palette.primary.main,
          borderRadius: '0 4px 4px 0'
        }}
      />
    </Box>
  );
};

export default Logo;