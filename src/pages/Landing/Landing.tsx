// src/pages/Landing/Landing.tsx
import React from 'react';
import { 
  Box, 
  Button, 
  Container, 
  Grid, 
  Typography, 
  Paper, 
  Card, 
  CardContent,
  useTheme,
  styled
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/foredulogo.png';
import SchoolIcon from '@mui/icons-material/School';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import GroupsIcon from '@mui/icons-material/Groups';
import SecurityIcon from '@mui/icons-material/Security';

// Elementos decorativos estilizados
const HeroDecoration = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  right: 0,
  width: '50%',
  height: '100%',
  clipPath: 'polygon(25% 0%, 100% 0%, 100% 100%, 0% 100%)',
  background: theme.palette.primary.main,
  opacity: 0.05,
  zIndex: 0,
}));

const CircleDecoration = styled(Box)(({ theme }) => ({
  position: 'absolute',
  borderRadius: '50%',
  background: theme.palette.secondary.main,
  opacity: 0.05,
  zIndex: 0,
}));

// Componente para las tarjetas de características
const FeatureCard = ({ icon, title, description }: { 
  icon: React.ReactNode, 
  title: string, 
  description: string 
}) => {
  const theme = useTheme();

  return (
    <Card sx={{ 
      height: '100%', 
      transition: 'transform 0.3s', 
      '&:hover': { 
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
      },
      position: 'relative',
      overflow: 'hidden'
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 2,
          color: theme.palette.primary.main
        }}>
          {icon}
          <Typography variant="h6" component="h3" sx={{ ml: 1, fontWeight: 'bold' }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      <Box 
        sx={{ 
          position: 'absolute', 
          bottom: -20, 
          right: -20, 
          width: 100, 
          height: 100, 
          borderRadius: '50%', 
          background: `${theme.palette.primary.main}10` 
        }} 
      />
    </Card>
  );
};

const Landing: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Barra de navegación */}
      <Box 
        component="header" 
        sx={{ 
          p: 2,
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          position: 'relative',
          zIndex: 10
        }}
      >
        <img src={Logo} alt="Foredu Logo" style={{ height: '40px' }} />
        
        <Box>
          <Button 
            variant="outlined" 
            color="primary" 
            sx={{ mr: 2 }}
            onClick={() => navigate('/register')}
          >
            Registrarse
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleLoginClick}
            sx={{ 
              boxShadow: '0 4px 10px rgba(233, 81, 29, 0.25)',
              '&:hover': {
                boxShadow: '0 6px 15px rgba(233, 81, 29, 0.35)',
              }
            }}
          >
            Iniciar sesión
          </Button>
        </Box>
      </Box>

      {/* Sección Hero */}
      <Box 
        sx={{ 
          py: { xs: 6, md: 12 }, 
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <HeroDecoration />
        <CircleDecoration 
          sx={{ 
            width: 300, 
            height: 300, 
            left: -100, 
            top: '40%',
          }} 
        />
        
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6} sx={{ position: 'relative', zIndex: 1 }}>
              <Typography 
                variant="h2" 
                component="h1" 
                sx={{ 
                  fontWeight: 700,
                  color: theme.palette.secondary.main,
                  mb: 2
                }}
              >
                Transformando la Educación
              </Typography>
              <Typography 
                variant="h5" 
                component="h2" 
                color="primary" 
                sx={{ fontWeight: 600, mb: 3 }}
              >
                Plataforma integral de gestión educativa
              </Typography>
              <Typography variant="body1" paragraph sx={{ mb: 4, maxWidth: '90%' }}>
                Foredu combina tecnología e innovación para ofrecer herramientas que transforman la enseñanza.
                Diseñado para hacer la educación más accesible, personalizada y efectiva para todos.
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                onClick={handleLoginClick}
                sx={{ 
                  py: 1.5, 
                  px: 4, 
                  borderRadius: 2,
                  boxShadow: '0 6px 15px rgba(233, 81, 29, 0.25)',
                  '&:hover': {
                    boxShadow: '0 8px 20px rgba(233, 81, 29, 0.4)',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s'
                }}
              >
                Comenzar ahora
              </Button>
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: 'center' }}>
              <Box 
                component="img"
                src="src\assets\education-hero.jpg" 
                alt="Plataforma educativa"
                sx={{ 
                  maxWidth: '100%', 
                  height: 'auto',
                  maxHeight: 400,
                  filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.15))'
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Sección de características */}
      <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h3" 
              component="h2" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                color: theme.palette.secondary.main
              }}
            >
              Soluciones Completas para la Educación
            </Typography>
            <Typography variant="subtitle1" sx={{ maxWidth: 700, mx: 'auto' }}>
              Herramientas intuitivas diseñadas para facilitar la gestión educativa y mejorar la experiencia de aprendizaje.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={3}>
              <FeatureCard 
                icon={<SchoolIcon fontSize="large" />}
                title="Gestión académica"
                description="Administra cursos, calificaciones y asistencia de manera eficiente y centralizada."
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FeatureCard 
                icon={<AutoStoriesIcon fontSize="large" />}
                title="Recursos didácticos"
                description="Accede a materiales educativos y herramientas para enriquecer el proceso de enseñanza."
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FeatureCard 
                icon={<GroupsIcon fontSize="large" />}
                title="Comunicación efectiva"
                description="Mantén una comunicación fluida entre docentes, estudiantes y familias."
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FeatureCard 
                icon={<SecurityIcon fontSize="large" />}
                title="Seguridad garantizada"
                description="Protección de datos y privacidad con los más altos estándares de seguridad."
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Sección CTA */}
      <Box sx={{ py: 10, position: 'relative', overflow: 'hidden' }}>
        <CircleDecoration 
          sx={{ 
            width: 400, 
            height: 400, 
            right: -150, 
            bottom: -150,
            background: theme.palette.primary.main,
          }} 
        />
        
        <Container maxWidth="md">
          <Paper 
            elevation={0} 
            sx={{ 
              p: { xs: 3, md: 6 }, 
              textAlign: 'center',
              borderRadius: 4,
              position: 'relative',
              zIndex: 1,
              background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
              color: 'white',
              boxShadow: '0 10px 30px rgba(38, 40, 83, 0.3)'
            }}
          >
            <Typography variant="h4" component="h2" gutterBottom fontWeight="bold">
              ¿Listo para transformar la educación?
            </Typography>
            <Typography variant="body1" paragraph sx={{ mb: 4, maxWidth: '80%', mx: 'auto' }}>
              Únete a la comunidad de instituciones educativas que ya están innovando con nuestras soluciones.
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              onClick={handleLoginClick}
              sx={{ 
                bgcolor: theme.palette.primary.main,
                color: 'white',
                py: 1.5, 
                px: 5, 
                borderRadius: 2,
                '&:hover': {
                  bgcolor: theme.palette.primary.dark,
                  transform: 'scale(1.05)'
                },
                transition: 'all 0.3s'
              }}
            >
              Comenzar ahora
            </Button>
          </Paper>
        </Container>
      </Box>

      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          py: 4, 
          bgcolor: theme.palette.secondary.dark,
          color: 'white'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <img src={Logo} alt="Foredu Logo" style={{ height: '40px' }} />
              <Typography variant="body2" sx={{ mt: 2, opacity: 0.8 }}>
                Transformando la educación con tecnología e innovación.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>Contacto</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                info@foredu.com
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                +1 (123) 456-7890
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>Enlaces</Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  opacity: 0.8, 
                  cursor: 'pointer',
                  '&:hover': { opacity: 1 },
                  mb: 1
                }}
                onClick={() => navigate('/login')}
              >
                Iniciar sesión
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  opacity: 0.8,
                  cursor: 'pointer',
                  '&:hover': { opacity: 1 } 
                }}
                onClick={() => navigate('/register')}
              >
                Registrarse
              </Typography>
            </Grid>
          </Grid>
          <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              © {new Date().getFullYear()} Foredu. Todos los derechos reservados.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing;