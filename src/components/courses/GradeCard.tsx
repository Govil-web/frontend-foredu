import React, { useCallback } from 'react';
import { Box, Typography, useTheme, IconButton } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import SettingsIcon from '@mui/icons-material/Settings';
import { Card } from '../common/Card.tsx';
import { Course } from '../../types';
import { useNavigate } from 'react-router-dom';

// Los colores de los cursos ahora se obtienen del tema

const GradeCardComponent: React.FC<{ course: Course; onClick: () => void }> = ({ course, onClick }) => {
    const theme = useTheme();
    const navigate = useNavigate();

    // Obtener los colores del tema o usar colores por defecto
    const courseInfo = theme.palette.courseIcons?.[course.curso] || {
        color: theme.palette.primary.main,
        bgColor: `${theme.palette.primary.light}20`,
    };

    const handleClick = useCallback(() => {
        navigate(`/grade/${course.id}`); // Cambia según tu ruta
        onClick();
    }, [navigate, course.id, onClick]);
    const mapTextToNumber = {
        "primero": "1",
        "segundo": "2",
        "tercero": "3",
        "cuarto": "4",
        "quinto": "5",
        "sexto": "6",
        "septimo": "7",
        "octavo": "8",
        "noveno": "9",
        "decimo": "10",
        "undecimo": "11",
        "duodecimo": "12"
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
                borderRadius: '12px',
                position: 'relative',
                overflow: 'hidden',
                border: '1.5px solid #C0C3C8',
            }}
        >
            {/* Botón de configuración */}
            <IconButton 
                size="small" 
                aria-label="Configurar curso"
                sx={{ position: 'absolute', top: 8, right: 8 }}
            >
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
                    {`${mapTextToNumber[course.curso.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")] || course.curso}° ${course.aula}`}
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

export const GradeCard = React.memo(GradeCardComponent);
