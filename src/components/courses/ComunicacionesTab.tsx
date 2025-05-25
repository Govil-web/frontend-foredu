// src/components/grade/ComunicacionesTab.tsx
import React, { useState } from 'react';
import { Box, Typography, Grid, Card, TextField, Button, Checkbox } from '@mui/material';

// Define una interfaz para los posts y eventos si aún no la tienes
interface Post {
    id: number;
    title: string;
    content: string;
    author: string;
    date: string;
}

interface Event {
    id: number;
    title: string;
    date: string;
    time: string;
    completed: boolean;
}

// Podrías pasar el gradeId como prop si las comunicaciones son específicas del grado
// interface ComunicacionesTabProps {
//   gradeId: number | string;
// }

export const ComunicacionesTab: React.FC = () => {
    const [newPost, setNewPost] = useState('');
    const [posts, setPosts] = useState<Post[]>([
        {
            id: 1,
            title: 'Título de Ejemplo',
            content: 'Lorem ipsum dolor sit amet consectetur. Elit malesuada eget facilis i psi...',
            author: 'Usuario Ejemplo',
            date: '2023-09-20'
        }
    ]);

    const [events, setEvents] = useState<Event[]>([
        { id: 1, title: 'Reunion de padres', date: '21/09', time: '11:00 - 12:00', completed: false },
        { id: 2, title: 'Acto por San Martín', date: '21/09', time: '12:30 - 14:00', completed: true }
    ]);

    const handlePublish = () => {
        if (newPost.trim()) {
            const newPostObj: Post = {
                id: posts.length + 1,
                title: 'Nueva publicación',
                content: newPost,
                author: 'Usuario Actual', // Podrías obtener esto del contexto de autenticación
                date: new Date().toISOString().split('T')[0] // Formato YYYY-MM-DD
            };
            setPosts(prevPosts => [newPostObj, ...prevPosts]); // Añadir al inicio
            setNewPost('');
        }
    };

    const toggleEvent = (eventId: number) => {
        setEvents(events.map(event =>
            event.id === eventId ? { ...event, completed: !event.completed } : event
        ));
    };

    return (
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
                        placeholder="Escribe tu mensaje aquí..."
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
                            {post.author} - {new Date(post.date).toLocaleDateString()}
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
                                color="primary"
                            />
                            <Box>
                                <Typography variant="body1">
                                    {event.title} {event.date} - {event.time}
                                </Typography>
                                <Typography variant="caption" color={event.completed ? "textSecondary" : "error"}>
                                    {event.completed ? 'Completado' : 'Pendiente'}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                    <Button sx={{ mt: 2 }} fullWidth variant="outlined">Ver todos</Button>
                </Card>
            </Grid>
        </Grid>
    );
};