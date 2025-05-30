// pages/admin/GradeDetails.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';// Loading podría no ser necesario aquí si las pestañas manejan su propia carga
import { courseService } from '../../services/courses/courseService';
import { Course } from '../../types'; // Tu tipo Course
import { GenericTabs } from '../../components/common/GenericTabs';
import { ComunicacionesTab } from '../../components/courses/ComunicacionesTab';
import { AsistenciaTab } from '../../components/courses/AsistenciaTab';

const GradeDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [selectedTab, setSelectedTab] = useState('asistencia');
    const [gradeDetails, setGradeDetails] = useState<Course | null>(null); // Usar tu tipo Course
    const [loadingGrade, setLoadingGrade] = useState(true);
    const [errorGrade, setErrorGrade] = useState<string | null>(null);

    const numericGradeId = id ? Number(id) : null;

    useEffect(() => {
        const fetchGradeDetails = async () => {
            if (!numericGradeId) {
                setErrorGrade("ID de grado no válido.");
                setLoadingGrade(false);
                // Considera redirigir o mostrar un mensaje más prominente
                // navigate('/admin/courses'); 
                return;
            }
            setLoadingGrade(true);
            setErrorGrade(null);
            try {
                // Asumo que courseService.getById devuelve una estructura que tiene `data` como el objeto Course
                // y `estado` para indicar éxito/fallo
                const response = await courseService.getById(numericGradeId);
                if (response.estado && response.data) { // Ajusta según la estructura de tu ApiResponse<Course>
                    setGradeDetails(response.data);
                } else {
                    throw new Error(response.message || 'No se pudieron cargar los detalles del grado.');
                }
            } catch (error: any) {
                console.error('Error fetching grade details:', error);
                setErrorGrade(error.message || 'Error al buscar detalles del grado.');
            } finally {
                setLoadingGrade(false);
            }
        };

        fetchGradeDetails();
    }, [numericGradeId, navigate]); // Dependencia de numericGradeId

    const orderedTabs = [
        { value: 'asistencia', label: 'Asistencia' },
        { value: 'comunicaciones', label: 'Comunicaciones' },
        { value: 'calendario', label: 'Calendario' },
        { value: 'integrantes', label: 'Integrantes' },
        { value: 'boletines', label: 'Boletines' },
    ];

    if (loadingGrade) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <CircularProgress />
            <Typography sx={{ml: 2}}>Cargando detalles del grado...</Typography>
        </Box>
    );
    
    if (errorGrade) return <Alert severity="error" sx={{m:3}}>{errorGrade}</Alert>;
    if (!gradeDetails || !numericGradeId) return <Alert severity="warning" sx={{m:3}}>No se encontraron detalles para el grado especificado.</Alert>;


    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 1 }}>
                {/* Asumiendo que gradeDetails (Course) tiene una propiedad 'nombre' o 'name' */}
                Grado: {gradeDetails?.curso || `ID ${gradeDetails?.id}`} 
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, backgroundColor: '#f0f0f0', p: 1, borderRadius: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {/* Esto debería venir de gradeDetails o un contexto, ej. gradeDetails.profesorAsignado?.nombre */}
                    Profesora: {gradeDetails?.profesorNombre || 'No asignado'} 
                </Typography>
            </Box>

            <GenericTabs
                tabs={orderedTabs}
                selectedValue={selectedTab}
                onChange={setSelectedTab}
                sx={{ mb: 3 }}
            />

            {selectedTab === 'asistencia' && numericGradeId && (
                <AsistenciaTab gradeId={numericGradeId} />
            )}

            {selectedTab === 'comunicaciones' && numericGradeId && (
                 // Pasa el gradeId si ComunicacionesTab lo necesita para filtrar o guardar
                <ComunicacionesTab /* gradeId={numericGradeId} */ />
            )}

            {selectedTab === 'calendario' && (
                <Box><Typography variant="h6">Contenido de Calendario (Próximamente)</Typography></Box>
            )}
            {selectedTab === 'integrantes' && (
                <Box><Typography variant="h6">Contenido de Integrantes (Próximamente)</Typography></Box>
            )}
            {selectedTab === 'boletines' && (
                <Box><Typography variant="h6">Contenido de Boletines (Próximamente)</Typography></Box>
            )}
        </Box>
    );
};

export default GradeDetails;