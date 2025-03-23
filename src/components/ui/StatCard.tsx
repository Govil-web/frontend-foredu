// src/components/ui/StatCard.tsx
import React from 'react';
import { Box, Typography, Paper, useTheme, alpha } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

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
  const trendColor = trendIsPositive ? theme.palette.success.main : theme.palette.error.main;
  
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      {/* Decoration */}
      <Box
        sx={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 120,
          height: 120,
          borderRadius: '50%',
          backgroundColor: alpha(color, 0.08),
          zIndex: 0,
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
              backgroundColor: alpha(color, 0.12),
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