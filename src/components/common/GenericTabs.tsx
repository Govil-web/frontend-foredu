// components/GenericTabs.tsx
import { Paper, Tab, Tabs, Box } from '@mui/material';
import React, { useCallback } from 'react';

export interface TabOption {
    value: string;
    label: string;
    disabled?: boolean;
}

interface GenericTabsProps {
    tabs: TabOption[];
    selectedValue: string;
    onChange: (newValue: string) => void;
    ariaLabel?: string;
    sx?: object;
    tabSx?: object;
}

const GenericTabsComponent: React.FC<GenericTabsProps> = ({
                                                     tabs,
                                                     selectedValue,
                                                     onChange,
                                                     ariaLabel = 'component tabs',
                                                     sx,
                                                     tabSx
                                                 }) => {
    const handleChange = useCallback((_event: React.SyntheticEvent, newValue: string) => {
        onChange(newValue);
    }, [onChange]);

    return (
        <Paper sx={{
            boxShadow: 'none',
            backgroundColor: 'transparent',
            position: 'relative',
            ...sx
        }}>
             {/* Línea divisora completa */}
            <Box sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                borderBottom: '1px solid',
                borderColor: 'grey.400',
                zIndex: 1, // Debajo del indicador
            }} />
            <Tabs
                value={selectedValue}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="inherit"
                variant="scrollable"
                scrollButtons="auto"
                aria-label={ariaLabel}
                sx={{
                    minHeight: 48,
                    position: 'relative',
                    zIndex: 2,
                    '& .MuiTabs-indicator': {
                        backgroundColor: 'grey.600',
                        height: '2px',
                        zIndex: 3
                    },
                    '& .MuiTab-root': {
                        textTransform: 'none',
                        minHeight: 48,
                        fontWeight: 600,
                        color: 'text.secondary',
                        '&.Mui-selected': {
                            color: 'grey.700'
                        }
                    }
                }}
            >
                {tabs.map((tab) => (
                    <Tab
                        key={tab.value}
                        label={tab.label}
                        value={tab.value}
                        disabled={tab.disabled}
                        sx={{
                            px: 2,
                            minWidth: 'auto',
                            ...tabSx
                        }}
                    />
                ))}
            </Tabs>
        </Paper>
    );
};

export const GenericTabs = React.memo(GenericTabsComponent);
export default GenericTabs;
