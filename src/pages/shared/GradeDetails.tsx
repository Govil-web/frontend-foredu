// pages/admin/GradeDetails.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Alert 
} from '@mui/material';
import { courseService } from '../../services/courses/courseService';
import { Course } from '../../types';
import { GenericTabs } from '../../components/common/GenericTabs';
import { ComunicacionesTab } from '../../components/courses/ComunicacionesTab';
import { AsistenciaTab } from '../../components/courses/AsistenciaTab';
import { useLayout } from '../../contexts/LayoutContext';

const GradeDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [selectedTab, setSelectedTab] = useState('asistencia');
    const [gradeDetails, setGradeDetails] = useState<Course | null>(null);
    const [loadingGrade, setLoadingGrade] = useState(true);
    const [errorGrade, setErrorGrade] = useState<string | null>(null);
    
    // Usa el contexto de layout para actualizar el encabezado
    const { setHeaderGrade } = useLayout();

    const numericGradeId = id ? Number(id) : null;

    useEffect(() => {
        const fetchGradeDetails = async () => {
            if (!numericGradeId) {
                setErrorGrade("ID de grado no válido.");
                setLoadingGrade(false);
                return;
            }
            setLoadingGrade(true);
            setErrorGrade(null);
            try {
                const response = await courseService.getById(numericGradeId);
                if (response.estado && response.data) {
                    setGradeDetails(response.data);
                    // Actualiza el encabezado con los detalles del grado
                    setHeaderGrade({
                        gradoNombre: response.data.curso || 'No asignado',
                        aula: response.data.aula || 'No asignada',
                    });
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
        
        // Limpiar al desmontar
        return () => {
            setHeaderGrade(null);
        };
    }, [numericGradeId, navigate, setHeaderGrade]);

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
        <Box sx={{ p: 1 , marginTop:-5}}>
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                mb: 3, 
                overflow: 'hidden',
            }}>
                <Box sx={{ 
                    position: 'relative', 
                    borderBottom: '1px solid', 
                    borderColor: 'grey.400',
                    mb: 1,
                }}>
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        position: 'relative',
                        zIndex: 2,
                    }}>
                        <GenericTabs
                            tabs={orderedTabs}
                            selectedValue={selectedTab}
                            onChange={setSelectedTab}
                            sx={{ 
                                mb: 0,
                                '& .MuiTabs-indicator': {
                                    zIndex: 3,
                                }
                            }}
                        />
                        
                        <Typography 
                            variant="body1" 
                            sx={{ 
                                fontWeight: 'medium',
                                ml: 2,
                                backgroundColor: 'transparent',
                                position: 'relative',
                                zIndex: 2,
                                fontSize:'15px',
                                color: '#383838',
                            }}
                        >
                            Profesor: {gradeDetails?.profesorNombre || 'No asignado'} 
                        </Typography>
                    </Box>
                </Box>
            </Box>
            
            {selectedTab === 'asistencia' && numericGradeId && (
                <AsistenciaTab gradeId={numericGradeId} />
            )}

            {selectedTab === 'comunicaciones' && numericGradeId && (
                <ComunicacionesTab />
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