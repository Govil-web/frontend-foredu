import { Theme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';
import { SxProps } from '@mui/system';

export const styleUtils = {
  hoverEffect: (theme: Theme) => ({
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.1)}`,
    }
  }),

  // Decoración de fondo circular
  backgroundDecoration: (theme: Theme, options?: {
    color?: string, 
    size?: number, 
    position?: 'top-right' | 'bottom-left'
  }): SxProps<Theme> => {
    const { 
      color = theme.palette.primary.main, 
      size = 120,
      position = 'top-right'
    } = options || {};

    const positionStyles = position === 'top-right' 
      ? { top: -20, right: -20 }
      : { bottom: -50, left: -50 };

    return {
      position: 'absolute',
      ...positionStyles,
      width: size,
      height: size,
      borderRadius: '50%',
      backgroundColor: alpha(color, 0.08),
      zIndex: 0,
    };
  },

  // Generador de sombras
  boxShadow: (theme: Theme, elevation: 'low' | 'medium' | 'high' = 'low') => {
    const shadows = {
      low: `0 4px 12px ${alpha(theme.palette.secondary.main, 0.05)}`,
      medium: `0 8px 20px ${alpha(theme.palette.secondary.main, 0.1)}`,
      high: `0 12px 30px ${alpha(theme.palette.secondary.main, 0.15)}`
    };
    return {
      boxShadow: shadows[elevation],
    };
  },

  // Texto con degradado
  gradientText: (theme: Theme, startColor?: string, endColor?: string) => ({
    background: `linear-gradient(135deg, ${startColor || theme.palette.primary.main} 0%, ${endColor || theme.palette.secondary.main} 100%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  }),

  // Bordes redondeados consistentes
  borderRadius: (size: 'small' | 'medium' | 'large' = 'medium') => {
    const sizes = {
      small: 8,
      medium: 12,
      large: 16
    };
    return {
      borderRadius: `${sizes[size]}px`
    };
  }
};

// Utilidad de tone para ajustar el tono de un color
export const adjustColorTone = (color: string, amount: number) => {
  const hexToRGB = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  };

  const RGBToHex = (r: number, g: number, b: number) => {
    return `#${[r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('')}`;
  };

  const [r, g, b] = hexToRGB(color);
  return RGBToHex(
    Math.min(255, Math.max(0, r + amount)),
    Math.min(255, Math.max(0, g + amount)),
    Math.min(255, Math.max(0, b + amount))
  );
};