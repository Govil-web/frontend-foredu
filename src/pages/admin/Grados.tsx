// pages/admin/Grados.tsx
import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Card, GenericTabs, Loading } from '../../components/common';
import { courseService } from '../../services/courses/courseService';
import { estudianteService } from '../../services/api/estudianteService';
import { ApiCourseData, CourseListApiResponse } from '../../types';
import {GradeCard} from "../../components/courses/GradeCard.tsx";



interface GradeDisplayModel {
  id: number;
  nombre: string;
  turno: string;
  profesor: string;
  estudiantesCount: number;
  padresCount: number;
  profesoresCount: number;
}

const Grados: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<string>('todos');
  const [grades, setGrades] = useState<GradeDisplayModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // courseService.getAll() returns CourseListApiResponse
        const coursesResponse: CourseListApiResponse = await courseService.getAll();

        if (!coursesResponse.estado || !Array.isArray(coursesResponse.dataIterable)) {
          throw new Error('Error en la estructura de respuesta de los grados o datos no presentes.');
        }

        // Process each course to get student counts
        const gradesWithCountsPromises = coursesResponse.dataIterable.map(
            async (apiCourse: ApiCourseData): Promise<GradeDisplayModel> => {
              try {
                const estudiantesResponse = await estudianteService.obtenerPorGrado(apiCourse.id);
                const estudiantesCount = estudiantesResponse.data?.length || 0;

                return {
                  id: apiCourse.id,
                  nombre: `${apiCourse.curso} ${apiCourse.aula}`,
                  turno: apiCourse.turno,
                  profesor: apiCourse.profesorNombre || 'Sin asignar',
                  estudiantesCount: estudiantesCount,
                  padresCount: Math.floor(estudiantesCount * 0.73),
                  profesoresCount: 1
                };
              } catch (fetchError: unknown) {
                console.error(`Error obteniendo estudiantes para grado ${apiCourse.id}:`, fetchError);
                return {
                  id: apiCourse.id,
                  nombre: `${apiCourse.curso} ${apiCourse.aula}`,
                  turno: apiCourse.turno,
                  profesor: apiCourse.profesorNombre || 'Sin asignar',
                  estudiantesCount: 0,
                  padresCount: 0,
                  profesoresCount: 1,
                };
              }
            }
        );

        const resolvedGrades = await Promise.all(gradesWithCountsPromises);
        setGrades(resolvedGrades);

      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar los datos de grados';
        setError(errorMessage);
        console.error('Error general en fetchData Grados:', err);
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, []);

  const filteredGrades = grades.filter(grade => {
    if (selectedTab === 'todos') return true;
    return grade.turno.toLowerCase() === selectedTab.toLowerCase();
  });

  if (loading) return <Loading />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
      <Box sx={{ p: 3 }}>
        <GenericTabs
            tabs={[
              { value: 'todos', label: 'Todos' },
              { value: 'mañana', label: 'Turno mañana' },
              { value: 'tarde', label: 'Turno tarde' }
            ]}
            selectedValue={selectedTab}
            onChange={setSelectedTab}
            sx={{ mb: 3 }}
        />
        <Grid container spacing={3}>
          {/* Tarjeta de Nuevo Grado */}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 300,
                  border: '2px dashed',
                  borderColor: 'divider',
                  '&:hover': { borderColor: 'primary.main', cursor: 'pointer' }
                }}
                onClick={() => navigate('/admin/grados/nuevo')}
            >
              <Typography variant="h6" color="textSecondary">Nuevo Grado</Typography>
            </Card>
          </Grid>

          {/* Listado de Grados */}
            {filteredGrades.map((grade) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={grade.id}>
                    <GradeCard
                        course={{
                            id: grade.id,
                            curso: grade.nombre.split(' ')[0],
                            aula: grade.nombre.split(' ')[1],
                            turno: grade.turno,
                            profesorNombre: grade.profesor,
                            contador: grade.estudiantesCount,
                            padresCount: grade.padresCount,
                            profesoresCount: grade.profesoresCount,
                        }}
                        onClick={() => navigate(`/admin/grados/${grade.id}`)}
                    />
                </Grid>
            ))}
        </Grid>
      </Box>
  );
};

export default Grados;