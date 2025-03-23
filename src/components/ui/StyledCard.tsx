// src/components/ui/StyledCard.tsx
import React from 'react';
import { Card, CardProps, styled } from '@mui/material';

interface StyledCardProps extends CardProps {
  withDecoration?: boolean;
}

const StyledCardRoot = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'withDecoration',
})<StyledCardProps>(({ theme, withDecoration }) => ({
  borderRadius: '16px',
  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
  overflow: 'hidden',
  position: 'relative',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
  },
  ...(withDecoration && {
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '-30px',
      right: '-30px',
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      background: `${theme.palette.primary.main}20`,
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
      background: `${theme.palette.secondary.main}10`,
      zIndex: 0,
    }
  })
}));

const StyledCard: React.FC<StyledCardProps> = ({ children, withDecoration = false, ...rest }) => {
  return (
    <StyledCardRoot withDecoration={withDecoration} {...rest}>
      {children}
    </StyledCardRoot>
  );
};

export default StyledCard;