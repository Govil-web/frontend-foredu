// components/GenericTabs.tsx
import { Paper, Tab, Tabs } from '@mui/material';
import React from 'react';

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

export const GenericTabs: React.FC<GenericTabsProps> = ({
                                                     tabs,
                                                     selectedValue,
                                                     onChange,
                                                     ariaLabel = 'component tabs',
                                                     sx,
                                                     tabSx
                                                 }) => {
    const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
        onChange(newValue);
    };

    return (
        <Paper sx={{
            boxShadow: 'none',
            borderBottom: '1px solid',
            borderColor: 'grey.400',
            backgroundColor: 'transparent',
            ...sx
        }}>
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
                    '& .MuiTabs-indicator': {
                        backgroundColor: 'grey.600',
                        height: '2px'
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

export default GenericTabs;