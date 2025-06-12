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
    // Nuevas props para contenido adicional
    rightContent?: React.ReactNode; // Contenido en el extremo derecho
    leftContent?: React.ReactNode;  // Contenido en el extremo izquierdo
    // Contenido adyacente a las pestañas
    tabsRightContent?: React.ReactNode; // Contenido inmediatamente a la derecha de las pestañas
    tabsLeftContent?: React.ReactNode;  // Contenido inmediatamente a la izquierda de las pestañas
}

const GenericTabsComponent: React.FC<GenericTabsProps> = ({
                                                              tabs,
                                                              selectedValue,
                                                              onChange,
                                                              ariaLabel = 'component tabs',
                                                              sx,
                                                              tabSx,
                                                              rightContent,
                                                              leftContent,
                                                              tabsRightContent,
                                                              tabsLeftContent
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
            {/* Contenedor principal con flexbox */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'relative',
                minHeight: 48
            }}>
                {/* Contenido izquierdo */}
                {leftContent && (
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        paddingRight: 2,
                        zIndex: 3
                    }}>
                        {leftContent}
                    </Box>
                )}

                {/* Contenedor central: pestañas + contenido adyacente */}
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flex: leftContent || rightContent ? 1 : 'none',
                    justifyContent: leftContent || rightContent ? 'flex-start' : 'center'
                }}>
                    {/* Contenido a la izquierda de las pestañas */}
                    {tabsLeftContent && (
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            marginRight: 1,
                            zIndex: 3
                        }}>
                            {tabsLeftContent}
                        </Box>
                    )}

                    {/* Pestañas */}
                    <Box sx={{ position: 'relative' }}>
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
                    </Box>

                    {/* Contenido a la derecha de las pestañas */}
                    {tabsRightContent && (
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            marginLeft: 1,
                            zIndex: 3
                        }}>
                            {tabsRightContent}
                        </Box>
                    )}
                </Box>

                {/* Contenido derecho */}
                {rightContent && (
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        paddingLeft: 2,
                        zIndex: 3
                    }}>
                        {rightContent}
                    </Box>
                )}
            </Box>

            {/* Línea divisora completa que se extiende por todo el ancho */}
            <Box sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                borderBottom: '1px solid',
                borderColor: 'grey.400',
                zIndex: 1, // Debajo del indicador y contenido
            }} />
        </Paper>
    );
};

export const GenericTabs = React.memo(GenericTabsComponent);
export default GenericTabs;