import React from 'react';
import { Card, CardProps, useTheme } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';

interface StyledCardProps extends CardProps {
  withDecoration?: boolean;
}

const StyledCard: React.FC<StyledCardProps> = ({ 
  children, 
  withDecoration = false, 
  sx,
  ...rest 
}) => {
  const theme = useTheme();

  // Crear una función que devuelva SxProps
  const getCardStyles = (): SxProps<Theme> => {
    const baseStyles: SxProps<Theme> = {
      borderRadius: theme.shape.borderRadius / 8 + 'rem',
      boxShadow: theme.shadows[1],
      overflow: 'hidden',
      position: 'relative',
      transition: theme.transitions.create(['transform', 'box-shadow']),
      '&:hover': {
        boxShadow: theme.shadows[4],
      },
      ...sx // Merge with any custom styles passed in
    };

    if (withDecoration) {
      return {
        ...baseStyles,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-30px',
          right: '-30px',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: theme.palette.primary.main + '20',
          zIndex: 0,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '-50px',
          left: '-50px',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: theme.palette.secondary.main + '10',
          zIndex: 0,
        }
      };
    }

    return baseStyles;
  };

  return (
    <Card 
      sx={getCardStyles()}
      {...rest}
    >
      {children}
    </Card>
  );
};

export default StyledCard;