// src/components/CircleIconButton.tsx
import { Box, IconButton, IconButtonProps, Tooltip, TooltipProps, useTheme } from '@mui/material';
import React, { forwardRef } from 'react';

interface CircleIconButtonProps extends IconButtonProps {
    tooltipTitle: TooltipProps['title'];
    icon: React.ReactNode;
    totalSize?: number;
}

const CircleIconButton = forwardRef<HTMLButtonElement, CircleIconButtonProps>(
    ({ tooltipTitle, icon, sx: incomingSx, totalSize = 40, ...props }, ref) => {
        const theme = useTheme();

        return (
            <Tooltip title={tooltipTitle}>
                <Box
                    sx={{
                        width: totalSize,
                        height: totalSize,
                        borderRadius: '50%',
                        border: `1.5px solid ${theme.palette.grey[400]}`,
                        backgroundColor: theme.palette.background.paper,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxSizing: 'border-box',
                        '&:hover': {
                            backgroundColor: theme.palette.grey[100],
                        },
                        ...incomingSx,
                    }}
                >
                    <IconButton
                        ref={ref}
                        {...props}
                        sx={{
                            padding: 0,
                            '&:hover': {
                                backgroundColor: 'transparent',
                            },

                        }}
                    >

                        {icon}
                    </IconButton>
                </Box>
            </Tooltip>
        );
    }
);

export default CircleIconButton;
