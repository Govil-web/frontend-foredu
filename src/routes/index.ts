// src/routes/index.ts
// Punto de entrada centralizado para todas las rutas de la aplicación
// Esto facilita las importaciones en otras partes del código

export { default as AppRoutes } from './AppRoutes';
export { default as ProtectedRoute } from './ProtectedRoute';

// Exportamos tanto los componentes como las funciones de obtención de rutas
export { default as AdminRoutes, getAdminRoutes } from './adminRoutes';
export { default as TeacherRoutes, getTeacherRoutes } from './teacherRoutes';
export { default as StudentRoutes, getStudentRoutes } from './studentRoutes';
export { default as TutorRoutes, getTutorRoutes } from './tutorRoutes';
export { default as SharedRoutes, getSharedRoutes } from './sharedRoutes';