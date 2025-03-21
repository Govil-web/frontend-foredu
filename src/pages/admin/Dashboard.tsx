// src/pages/admin/Dashboard.tsx
import React from 'react';
import { 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Button, 
  Avatar, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  Divider,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  useTheme,
  Chip,
  Badge,
  alpha,
} from '@mui/material';
import { 
  Add as AddIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Book as BookIcon,
  MoreVert as MoreVertIcon,
  TrendingUp as TrendingUpIcon,
  EventNote as EventNoteIcon,
  Notifications as NotificationsIcon,
  ArrowForward as ArrowForwardIcon,
  CalendarMonth as CalendarIcon,
  TextSnippet as TextSnippetIcon,
} from '@mui/icons-material';
import { UserRole } from '../../types/auth';
import { useAuth } from '../../hooks/useAuth';
import { styled } from '@mui/material/styles';

// Componente para las formas decorativas
const DecorativeShape = styled(Box)(({ theme }) => ({
  position: 'absolute',
  borderRadius: '50%',
  opacity: 0.8,
  zIndex: 0,
}));

// Colores de seguridad para usar como fallback
const safeColors = {
  primary: {
    main: '#E9511D',
    light: '#FF7A47',
    dark: '#C43C00',
  },
  secondary: {
    main: '#262853',
    light: '#3E4178',
    dark: '#1A1C3F',
  },
  info: {
    main: '#2196F3',
    light: '#64B5F6',
    dark: '#1976D2',
  },
  success: {
    main: '#4CAF50',
    light: '#81C784',
    dark: '#388E3C',
  },
  error: {
    main: '#F44336',
    light: '#E57373',
    dark: '#D32F2F',
  },
  warning: {
    main: '#FF9800',
    light: '#FFB74D',
    dark: '#F57C00',
  },
};

// Función para acceder de forma segura a colores del tema
const getThemeColor = (
  theme: any, 
  colorType: keyof typeof safeColors, 
  variant: keyof typeof safeColors['primary'] = 'main'
) => {
  try {
    return theme.palette[colorType]?.[variant] || safeColors[colorType][variant];
  } catch (e) {
    // Fallback a colores seguros si hay algún error
    return safeColors[colorType][variant];
  }
};

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
  trend?: number;
  subtitle?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon, 
  color = 'primary.main', 
  trend, 
  subtitle 
}) => {
  const theme = useTheme();
  
  return (
    <Paper 
      elevation={1} 
      sx={{ 
        p: 3, 
        borderRadius: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '6px',
          height: '100%',
          backgroundColor: color,
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', zIndex: 1 }}>
        <Avatar sx={{ 
          bgcolor: theme.palette.background.default, 
          color: color, 
          mr: 2,
          width: 48,
          height: 48,
          boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)'
        }}>
          {icon}
        </Avatar>
        <Box>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h4" fontWeight="bold">
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>
      
      {trend !== undefined && (
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <TrendingUpIcon 
            sx={{ 
              color: trend >= 0 ? getThemeColor(theme, 'success') : getThemeColor(theme, 'error'),
              fontSize: '1rem',
              mr: 0.5
            }} 
          />
          <Typography 
            variant="caption" 
            sx={{ 
              color: trend >= 0 ? getThemeColor(theme, 'success') : getThemeColor(theme, 'error'),
              fontWeight: 'medium'
            }}
          >
            {trend >= 0 ? '+' : ''}{trend}% desde el mes pasado
          </Typography>
        </Box>
      )}

      {/* Elemento decorativo */}
      <Box
        sx={{
          position: 'absolute',
          bottom: '-20px',
          right: '-20px',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: `${color}20`,
          zIndex: 0,
        }}
      />
    </Paper>
  );
};

const SectionHeading = styled(Typography)(({ theme }) => ({
  position: 'relative',
  display: 'inline-block',
  marginBottom: theme.spacing(3),
  fontWeight: 'bold',
  color: getThemeColor(theme, 'secondary'),
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-8px',
    left: '0',
    width: '40px',
    height: '4px',
    backgroundColor: getThemeColor(theme, 'primary'),
    borderRadius: '2px',
  },
}));

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const theme = useTheme();
  
  // Datos de ejemplo para el dashboard
  const stats = [
    { 
      title: 'Total Estudiantes', 
      value: 1254, 
      icon: <PersonIcon />, 
      color: getThemeColor(theme, 'primary'),
      trend: 4.2,
      subtitle: '28 nuevos este mes'
    },
    { 
      title: 'Total Profesores', 
      value: 48, 
      icon: <PersonIcon />, 
      color: getThemeColor(theme, 'secondary'),
      trend: 1.5,
      subtitle: '3 nuevos este mes'
    },
    { 
      title: 'Cursos Activos', 
      value: 36, 
      icon: <SchoolIcon />, 
      color: getThemeColor(theme, 'success'),
      trend: 2.8,
      subtitle: '5 cursos nuevos'
    },
  ];
  
  const recentUsers = [
    { id: '1', name: 'Juan Pérez', role: UserRole.ESTUDIANTE, avatar: undefined },
    { id: '2', name: 'María García', role: UserRole.PROFESOR, avatar: undefined },
    { id: '3', name: 'Carlos López', role: UserRole.TUTOR, avatar: undefined },
    { id: '4', name: 'Ana Martínez', role: UserRole.ESTUDIANTE, avatar: undefined },
  ];
  
  const notifications = [
    { id: '1', title: 'Nueva solicitud', message: 'Juan Pérez solicitó acceso a la plataforma', time: '10 min' },
    { id: '2', title: 'Evento programado', message: 'Reunión de padres el viernes', time: '1 hora' },
    { id: '3', title: 'Sistema actualizado', message: 'Se implementaron nuevas funciones', time: '3 horas' },
  ];

  const upcomingEvents = [
    { id: '1', title: 'Reunión de profesores', date: '28 Mar', time: '10:00 AM', type: 'meeting' },
    { id: '2', title: 'Entrega de calificaciones', date: '30 Mar', time: '09:00 AM', type: 'deadline' },
    { id: '3', title: 'Junta directiva', date: '2 Abr', time: '14:30 PM', type: 'meeting' },
  ];

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'meeting':
        return <CalendarIcon color="primary" />;
      case 'deadline':
        return <TextSnippetIcon color="error" />;
      default:
        return <EventNoteIcon color="primary" />;
    }
  };

  // Función para obtener color de fondo seguro según rol
  const getRoleBgColor = (role: UserRole) => {
    if (role === UserRole.ESTUDIANTE) {
      return alpha(getThemeColor(theme, 'info'), 0.2);
    } else if (role === UserRole.PROFESOR) {
      return alpha(getThemeColor(theme, 'primary'), 0.2);
    } else {
      return alpha(getThemeColor(theme, 'success'), 0.2);
    }
  };

  // Función para obtener color de texto seguro según rol
  const getRoleTextColor = (role: UserRole) => {
    if (role === UserRole.ESTUDIANTE) {
      return getThemeColor(theme, 'info');
    } else if (role === UserRole.PROFESOR) {
      return getThemeColor(theme, 'primary');
    } else {
      return getThemeColor(theme, 'success');
    }
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap',
        mb: 4
      }}>
        <SectionHeading variant="h4" as="h1">
          Panel de Administración
        </SectionHeading>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          color="primary"
          sx={{ 
            boxShadow: '0 4px 10px rgba(233, 81, 29, 0.2)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 15px rgba(233, 81, 29, 0.3)',
            }
          }}
        >
          Nuevo Usuario
        </Button>
      </Box>
      
      {/* Mensaje de bienvenida */}
      <Card 
        sx={{ 
          mb: 4, 
          position: 'relative',
          overflow: 'hidden',
          background: `linear-gradient(135deg, ${getThemeColor(theme, 'secondary')} 0%, ${getThemeColor(theme, 'secondary', 'dark')} 100%)`,
          color: 'white',
          boxShadow: '0 8px 20px rgba(38, 40, 83, 0.2)'
        }}
      >
        <CardContent sx={{ position: 'relative', zIndex: 1, py: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                ¡Bienvenido de vuelta, {user?.nombre}!
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
                Tienes 3 notificaciones pendientes y 2 tareas por completar hoy.
              </Typography>
              <Button 
                variant="contained" 
                color="primary"
                size="small"
                endIcon={<ArrowForwardIcon />}
                sx={{ 
                  mt: 1,
                  boxShadow: '0 4px 10px rgba(233, 81, 29, 0.3)'
                }}
              >
                Ver resumen
              </Button>
            </Grid>
            <Grid item xs={12} md={4} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box sx={{ textAlign: 'right' }}>
                <img 
                  src="/assets/welcome-illustration.svg" 
                  alt="Welcome" 
                  width="150" 
                  style={{ opacity: 0.9 }}
                />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
        
        {/* Elementos decorativos */}
        <Box
          sx={{
            position: 'absolute',
            top: '-30px',
            right: '-30px',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '-40px',
            left: '30%',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.05)',
          }}
        />
      </Card>
      
      {/* Tarjetas de estadísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} md={4} key={index}>
            <StatsCard
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              trend={stat.trend}
              subtitle={stat.subtitle}
            />
          </Grid>
        ))}
      </Grid>
      
      <Grid container spacing={3}>
        {/* Usuarios recientes */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
            <CardHeader 
              title="Usuarios Recientes" 
              titleTypographyProps={{ 
                variant: 'h6', 
                color: 'secondary.main',
                fontWeight: 'bold'
              }}
              action={
                <Box>
                  <IconButton aria-label="settings">
                    <MoreVertIcon />
                  </IconButton>
                  <Button 
                    variant="text" 
                    color="primary" 
                    endIcon={<ArrowForwardIcon />}
                    size="small"
                    sx={{ ml: 1 }}
                  >
                    Ver todos
                  </Button>
                </Box>
              }
            />
            <Divider />
            <CardContent sx={{ p: 0 }}>
              <List sx={{ p: 0 }}>
                {recentUsers.map((user, index) => (
                  <React.Fragment key={user.id}>
                    {index > 0 && <Divider component="li" />}
                    <ListItem
                      sx={{ 
                        py: 1.5, 
                        px: 3,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: theme.palette.sidebar?.light || "#F0F4FA",
                        }
                      }}
                      secondaryAction={
                        <Button 
                          variant="outlined" 
                          size="small" 
                          color="primary"
                          sx={{ 
                            borderRadius: '20px',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              backgroundColor: getThemeColor(theme, 'primary'),
                              color: 'white'
                            }
                          }}
                        >
                          Ver perfil
                        </Button>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar 
                          alt={user.name} 
                          src={user.avatar}
                          sx={{ 
                            bgcolor: getRoleTextColor(user.role),
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                          }}
                        >
                          {user.name.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
  primary={user.name} 
  // El problema está aquí - el Chip se renderiza como un div dentro de un p
  secondary={
    // Envuelve el Chip en un span en lugar de dejarlo directamente bajo el p
    <Box component="span" sx={{ display: 'block', mt: 0.5 }}>
      <Chip
        label={
          user.role === UserRole.ESTUDIANTE ? 'Estudiante' : 
          user.role === UserRole.PROFESOR ? 'Profesor' :
          user.role === UserRole.TUTOR ? 'Tutor' : 'Administrador'
        }
        size="small"
        sx={{ 
          fontSize: '0.7rem',
          height: '20px',
          bgcolor: getRoleBgColor(user.role),
          color: getRoleTextColor(user.role),
          border: 'none'
        }}
      />
    </Box>
  }
  primaryTypographyProps={{ fontWeight: 'medium' }}
/>
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
            
            {/* Elemento decorativo */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '150px',
                height: '150px',
                borderBottomLeftRadius: '100%',
                background: alpha(getThemeColor(theme, 'primary'), 0.08),
                zIndex: 0,
              }}
            />
          </Card>
        </Grid>
        
        {/* Columna derecha */}
        <Grid item xs={12} lg={4}>
          <Grid container spacing={3} direction="column">
            {/* Notificaciones */}
            <Grid item xs={12}>
              <Card sx={{ position: 'relative', overflow: 'hidden' }}>
                <CardHeader 
                  title="Notificaciones Recientes" 
                  titleTypographyProps={{ 
                    variant: 'h6', 
                    color: 'secondary.main',
                    fontWeight: 'bold'
                  }}
                  avatar={
                    <Badge badgeContent={notifications.length} color="error">
                      <NotificationsIcon color="primary" />
                    </Badge>
                  }
                  action={
                    <IconButton aria-label="settings">
                      <MoreVertIcon />
                    </IconButton>
                  }
                />
                <Divider />
                <CardContent sx={{ p: 0, maxHeight: '300px', overflow: 'auto' }}>
                  <List sx={{ p: 0 }}>
                    {notifications.map((notif, index) => (
                      <React.Fragment key={notif.id}>
                        {index > 0 && <Divider component="li" />}
                        <ListItem 
                          alignItems="flex-start" 
                          sx={{ 
                            py: 1.5, 
                            px: 2, 
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              backgroundColor: theme.palette.sidebar?.light || "#F0F4FA",
                            }
                          }}
                        >
                          <ListItemText 
                            primary={
                              <Typography variant="subtitle2" color="text.primary" fontWeight="medium">
                                {notif.title}
                              </Typography>
                            }
                            secondary={
                              <>
                                <Typography
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                  sx={{ display: 'block', mt: 0.5 }}
                                >
                                  {notif.message}
                                </Typography>
                                <Typography
                                  component="span"
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{ 
                                    display: 'inline-block',
                                    mt: 1,
                                    bgcolor: 'rgba(0, 0, 0, 0.05)',
                                    px: 1,
                                    py: 0.25,
                                    borderRadius: '4px'
                                  }}
                                >
                                  Hace {notif.time}
                                </Typography>
                              </>
                            }
                          />
                        </ListItem>
                      </React.Fragment>
                    ))}
                  </List>
                </CardContent>
                
                {/* Elemento decorativo */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100px',
                    height: '100px',
                    borderTopRightRadius: '100%',
                    background: alpha(getThemeColor(theme, 'primary'), 0.08),
                    zIndex: 0,
                  }}
                />
              </Card>
            </Grid>

            {/* Próximos eventos */}
            <Grid item xs={12}>
              <Card sx={{ position: 'relative', overflow: 'hidden' }}>
                <CardHeader 
                  title="Próximos Eventos" 
                  titleTypographyProps={{ 
                    variant: 'h6', 
                    color: 'secondary.main',
                    fontWeight: 'bold'
                  }}
                  avatar={<EventNoteIcon color="primary" />}
                  action={
                    <Button 
                      variant="text" 
                      color="primary" 
                      endIcon={<ArrowForwardIcon />}
                      size="small"
                    >
                      Ver todos
                    </Button>
                  }
                />
                <Divider />
                <CardContent sx={{ p: 0 }}>
                  <List>
                    {upcomingEvents.map((event, index) => (
                      <React.Fragment key={event.id}>
                        {index > 0 && <Divider component="li" />}
                        <ListItem 
                          sx={{ 
                            py: 1.5, 
                            px: 2,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              backgroundColor: theme.palette.sidebar?.light || "#F0F4FA",
                            }
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar
                              sx={{
                                bgcolor: event.type === 'deadline' 
                                  ? alpha(getThemeColor(theme, 'error'), 0.2)
                                  : alpha(getThemeColor(theme, 'primary'), 0.2),
                                color: event.type === 'deadline'
                                  ? getThemeColor(theme, 'error')
                                  : getThemeColor(theme, 'primary'),
                                boxShadow: 'none'
                              }}
                            >
                              {getEventIcon(event.type)}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText 
                            primary={
                              <Typography variant="subtitle2" fontWeight="medium">
                                {event.title}
                              </Typography>
                            } 
                            secondary={
                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                <Chip 
                                  label={event.date} 
                                  size="small"
                                  sx={{ 
                                    mr: 1, 
                                    bgcolor: theme.palette.sidebar?.main || "#E7EAF5",
                                    fontSize: '0.7rem',
                                    height: '20px'
                                  }}
                                />
                                <Typography variant="caption" color="text.secondary">
                                  {event.time}
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                      </React.Fragment>
                    ))}
                  </List>
                </CardContent>
                
                {/* Elemento decorativo */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '120px',
                    height: '120px',
                    borderBottomLeftRadius: '100%',
                    background: alpha(getThemeColor(theme, 'secondary'), 0.08),
                    zIndex: 0,
                  }}
                />
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;