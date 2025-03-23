import React from 'react';
import { Box, Typography, Paper, useTheme } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { styleUtils } from '../../utils/styleUtils';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  trend?: number;
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  color, 
  trend, 
  subtitle 
}) => {
  const theme = useTheme();
  
  const trendIsPositive = trend && trend > 0;
  const trendColor = trendIsPositive 
    ? theme.palette.success.main 
    : theme.palette.error.main;
  
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        ...styleUtils.borderRadius('medium'),
        ...styleUtils.boxShadow(theme),
        ...styleUtils.hoverEffect(theme),
      }}
    >
      <Box
        sx={{
          ...styleUtils.backgroundDecoration(theme, { 
            color, 
            size: 120, 
            position: 'top-right' 
          })
        }}
      />
      
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            justifyContent: 'space-between',
            mb: 2
          }}
        >
          <Box>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ mb: 0.5, fontWeight: 500 }}
            >
              {title}
            </Typography>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 'bold',
                color: theme.palette.text.primary 
              }}
            >
              {value.toLocaleString()}
            </Typography>
            {subtitle && (
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ display: 'block', mt: 0.5 }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
          
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              backgroundColor: theme.palette.augmentColor({ color: { main: color } }).light,
              color: color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
        </Box>
        
        {trend !== undefined && (
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              color: trendColor,
              mt: 1
            }}
          >
            {trendIsPositive ? (
              <TrendingUpIcon fontSize="small" sx={{ mr: 0.5 }} />
            ) : (
              <TrendingDownIcon fontSize="small" sx={{ mr: 0.5 }} />
            )}
            <Typography 
              variant="body2" 
              sx={{ fontWeight: 'medium' }}
            >
              {Math.abs(trend).toFixed(1)}% {trendIsPositive ? 'aumento' : 'disminución'}
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default StatCard;