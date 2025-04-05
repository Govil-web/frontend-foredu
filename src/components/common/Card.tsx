// src/components/common/Card.tsx (Componente reutilizable)
import React from 'react';
import { Card as MuiCard, CardProps, useTheme } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';

interface CustomCardProps extends CardProps {
  withDecoration?: boolean;
  decorationPosition?: 'top-right' | 'bottom-left';
  decorationColor?: string;
  decorationSize?: number;
  customElevation?: 'low' | 'medium' | 'high';
}

export const Card: React.FC<CustomCardProps> = ({ 
  children, 
  withDecoration = false,
  decorationPosition = 'top-right',
  decorationColor,
  decorationSize = 120,
  customElevation = 'low',
  sx,
  ...rest 
}) => {
  const theme = useTheme();

  const getCardStyles = (): SxProps<Theme> => {
    const shadowLevels = {
      low: `0 4px 12px ${theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.05)'}`,
      medium: `0 8px 20px ${theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'}`,
      high: `0 12px 28px ${theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.15)'}`
    };

    const baseStyles: SxProps<Theme> = {
      borderRadius: theme.shape.borderRadius / 8 + 'rem',
      boxShadow: shadowLevels[customElevation as 'low' | 'medium' | 'high'],
      overflow: 'hidden',
      position: 'relative',
      transition: theme.transitions.create(['transform', 'box-shadow']),
      '&:hover': {
        boxShadow: shadowLevels.medium,
      },
      ...sx
    };

    if (withDecoration) {
      const color = decorationColor || theme.palette.primary.main;
      const positionStyles = decorationPosition === 'top-right' 
        ? { top: -20, right: -20 }
        : { bottom: -50, left: -50 };

      return {
        ...baseStyles,
        '&::before': {
          content: '""',
          position: 'absolute',
          ...positionStyles,
          width: `${decorationSize}px`,
          height: `${decorationSize}px`,
          borderRadius: '50%',
          background: `${color}20`,
          zIndex: 0,
        }
      };
    }

    return baseStyles;
  };

  return (
    <MuiCard 
      sx={getCardStyles()}
      {...rest}
    >
      {children}
    </MuiCard>
  );
};

export default Card;