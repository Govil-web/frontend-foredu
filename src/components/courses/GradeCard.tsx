import React from 'react';
import { Box, Typography, useTheme, IconButton } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import SettingsIcon from '@mui/icons-material/Settings';
import { Card } from '../common/Card.tsx';
import { Course } from '../../types';
import { useNavigate } from 'react-router-dom';

const courseIcons: Record<string, { color: string; bgColor: string }> = {
    PRIMERO: { color: '#F8D449', bgColor: '#FFF8E1' },
    SEGUNDO: { color: '#4E97F3', bgColor: '#E3F2FD' },
    TERCERO: { color: '#66BB6A', bgColor: '#E8F5E9' },
    CUARTO: { color: '#7E57C2', bgColor: '#EDE7F6' },
    QUINTO: { color: '#FF5722', bgColor: '#FBE9E7' },
    SEXTO: { color: '#26A69A', bgColor: '#E0F2F1' },
    SEPTIMO: { color: '#FF7043', bgColor: '#FFEBEE' },
    OCTAVO: { color: '#AB47BC', bgColor: '#F3E5F5' },
    NOVENO: { color: '#FFCA28', bgColor: '#FFFDE7' },
    DECIMO: { color: '#FF7043', bgColor: '#FFEBEE' },
};

export const GradeCard: React.FC<{ course: Course; onClick: () => void }> = ({ course, onClick }) => {
    const theme = useTheme();
    const navigate = useNavigate();

    const courseInfo = courseIcons[course.curso] || {
        color: theme.palette.primary.main,
        bgColor: `${theme.palette.primary.light}20`,
    };

    const handleClick = () => {
        navigate(`/grade/${course.id}`); // Cambia según tu ruta
        onClick();
    };

    return (
        <Card
            onClick={handleClick}
            sx={{
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                    boxShadow: 4,
                },
                borderRadius: 2,
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Botón de configuración */}
            <IconButton size="small" sx={{ position: 'absolute', top: 8, right: 8 }}>
                <SettingsIcon fontSize="small" />
            </IconButton>

            {/* Icono del curso */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
                <Box
                    sx={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        bgcolor: courseInfo.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 1,
                    }}
                >
                    <SchoolIcon sx={{ fontSize: 36, color: '#fff' }} />
                </Box>

                {/* Curso y aula */}
                <Typography variant="h6" fontWeight="bold">
                    {`${course.curso[0]}° ${course.aula}`}
                </Typography>

                {/* Nombre del profesor principal */}
                <Typography variant="body2" color="text.secondary">
                    {course.profesorNombre || 'No asignado'}
                </Typography>
            </Box>

            {/* Línea divisoria */}
            <Box sx={{ borderTop: '1px solid #ddd', my: 1 }} />

            {/* Info inferior */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Box>
                    <Typography variant="body2" color="text.secondary">
                        {course.contador || 0} Alumnos
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {course.padresCount || 0} Padres
                    </Typography>
                </Box>
                <Box textAlign="right">
                    <Typography variant="body2" color="text.secondary">
                        {course.profesoresCount || 0} Profesores
                    </Typography>
                </Box>
            </Box>
        </Card>
    );
};
