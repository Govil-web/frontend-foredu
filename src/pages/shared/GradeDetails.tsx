// pages/admin/GradeDetails.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Card, TextField, Button, Checkbox, IconButton } from '@mui/material';
import { GenericTabs, Loading } from '../../components/common';
import { courseService } from '../../services/courses/courseService';

const GradeDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [selectedTab, setSelectedTab] = useState('comunicaciones');
    const [newPost, setNewPost] = useState('');
    const [gradeDetails, setGradeDetails] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Datos de ejemplo para publicaciones y eventos
    const [posts, setPosts] = useState([
        {
            id: 1,
            title: 'Título',
            content: 'Lorem ipsum dolor sit amet consectetur. Elit malesuada eget facilis i psi...',
            author: 'Usuario',
            date: '2023-09-20'
        }
    ]);

    const [events, setEvents] = useState([
        { id: 1, title: 'Reunion de padres', date: '21/09', time: '11:00 - 12:00', completed: false },
        { id: 2, title: 'Acto por San Martín', date: '21/09', time: '12:30 - 14:00', completed: true }
    ]);

    useEffect(() => {
        const fetchGradeDetails = async () => {
            try {
                const response = await courseService.getById(Number(id));
                setGradeDetails(response.data);
            } catch (error) {
                console.error('Error fetching grade details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchGradeDetails();
    }, [id]);

    const handlePublish = () => {
        if (newPost.trim()) {
            const newPostObj = {
                id: posts.length + 1,
                title: 'Nueva publicación',
                content: newPost,
                author: 'Usuario',
                date: new Date().toISOString()
            };
            setPosts([...posts, newPostObj]);
            setNewPost('');
        }
    };

    const toggleEvent = (eventId: number) => {
        setEvents(events.map(event =>
            event.id === eventId ? { ...event, completed: !event.completed } : event
        ));
    };

    if (loading) return <Loading />;

    return (
        <Box sx={{ p: 3 }}>
            <GenericTabs
                tabs={[
                    { value: 'comunicaciones', label: 'Comunicaciones' },
                    { value: 'calendario', label: 'Calendario' },
                    { value: 'integrantes', label: 'Integrantes' },
                    { value: 'asistencia', label: 'Asistencia' },
                    { value: 'boletines', label: 'Boletines' }
                ]}
                selectedValue={selectedTab}
                onChange={setSelectedTab}
                sx={{ mb: 3 }}
            />

            {selectedTab === 'comunicaciones' && (
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <Card sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" gutterBottom>¿Qué querés contar hoy?</Typography>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                value={newPost}
                                onChange={(e) => setNewPost(e.target.value)}
                                sx={{ mb: 2 }}
                            />
                            <Button
                                variant="contained"
                                onClick={handlePublish}
                                sx={{ float: 'right' }}
                            >
                                Publicar
                            </Button>
                        </Card>

                        {posts.map(post => (
                            <Card key={post.id} sx={{ p: 3, mb: 3 }}>
                                <Typography variant="h6" gutterBottom>{post.title}</Typography>
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                    {post.author} - {post.date}
                                </Typography>
                                <Typography variant="body1">{post.content}</Typography>
                            </Card>
                        ))}
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Card sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>Próximos eventos</Typography>
                            {events.map(event => (
                                <Box key={event.id} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Checkbox
                                        checked={event.completed}
                                        onChange={() => toggleEvent(event.id)}
                                    />
                                    <Box>
                                        <Typography variant="body1">
                                            {event.title} {event.date} - {event.time}
                                        </Typography>
                                        <Typography variant="caption">
                                            {event.completed ? 'Completado' : 'Pendiente'}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                            <Button sx={{ mt: 2 }}>Ver todos</Button>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* Aquí puedes agregar el contenido para las otras pestañas */}
        </Box>
    );
};

export default GradeDetails;