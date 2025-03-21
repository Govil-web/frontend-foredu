// src/components/design-system/Logo/Logo.tsx
import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';

interface LogoProps {
  variant?: 'horizontal' | 'vertical' | 'isotype';
  size?: 'small' | 'medium' | 'large';
  color?: 'color' | 'white' | 'dark';
}

// Componente para los puntos sobre la "U"
const LogoDots = styled('span')(({ theme }) => ({
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    backgroundColor: theme.palette.primary.main,
    top: '-8px',
    right: '3px',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    backgroundColor: theme.palette.primary.main,
    top: '-8px',
    right: '13px',
  },
}));

const Logo: React.FC<LogoProps> = ({
  variant = 'horizontal',
  size = 'medium',
  color = 'color'
}) => {
  const theme = useTheme();
  
  // Colores según la variante
  const primaryColor = color === 'color' ? theme.palette.primary.main : 
                      color === 'white' ? '#FFFFFF' : theme.palette.secondary.main;
  const secondaryColor = color === 'color' ? theme.palette.secondary.main : 
                        color === 'white' ? '#FFFFFF' : theme.palette.secondary.main;
  const textColor = color === 'white' ? '#FFFFFF' : theme.palette.secondary.main;
  
  // Definir dimensiones según el tamaño
  let logoHeight, fontSize, bookWidth;
  switch (size) {
    case 'small':
      logoHeight = 32;
      fontSize = '1rem';
      bookWidth = 30;
      break;
    case 'large':
      logoHeight = 64;
      fontSize = '1.5rem';
      bookWidth = 60;
      break;
    default: // medium
      logoHeight = 48;
      fontSize = '1.25rem';
      bookWidth = 45;
  }
  
  // SVG del logotipo optimizado para renderizado correcto
  const LogoSvg = () => (
    <Box 
      component="svg" 
      viewBox="0 0 32 32" 
      width={bookWidth} 
      height={logoHeight}
      sx={{ display: 'block' }}
      aria-label="Foredu logo"
    >
      {/* Azul oscuro - F */}
      <path 
        d="M2 6 C2 5 3 4 4 4 L12 2 C13 2 14 3 14 4 V26 C14 27 13 28 12 28 L4 30 C3 30 2 29 2 28 Z" 
        fill={secondaryColor} 
      />
      {/* Naranja - E */}
      <path 
        d="M18 4 C18 3 19 2 20 2 L28 4 C29 4 30 5 30 6 V28 C30 29 29 30 28 30 L20 28 C19 28 18 27 18 26 Z" 
        fill={primaryColor} 
      />
    </Box>
  );
  
  // Isotype - Solo el símbolo del libro
  if (variant === 'isotype') {
    return <LogoSvg />;
  }
  
  // Horizontal - Logo con texto a la derecha
  if (variant === 'horizontal') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <LogoSvg />
        <Typography
          className="logo-text"
          variant="h6"
          sx={{
            ml: 1.5,
            fontFamily: '"Candal", sans-serif',
            fontWeight: 'bold',
            color: textColor,
            fontSize,
            letterSpacing: '0.02em',
            position: 'relative'
          }}
        >
          Foredu
          <LogoDots />
        </Typography>
      </Box>
    );
  }
  
  // Vertical - Logo con texto debajo
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <LogoSvg />
      </Box>
      <Typography
        className="logo-text"
        variant="h6"
        sx={{
          mt: 1.5,
          fontFamily: '"Candal", sans-serif',
          fontWeight: 'bold',
          color: textColor,
          fontSize,
          letterSpacing: '0.02em',
          position: 'relative'
        }}
      >
        Foredu
        <LogoDots />
      </Typography>
    </Box>
  );
};

export default Logo;