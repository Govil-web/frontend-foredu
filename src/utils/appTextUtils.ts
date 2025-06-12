// src/utils/appTextUtils.ts
import { UserRole } from '../types';

// Mapeo de rutas específicas a títulos (máxima prioridad)
const ROUTE_TITLE_MAPPING: Record<string, string> = {
    '/admin/grades': 'Grados',
    '/admin/grados': 'Grados',
    '/profesor/grados': 'Grados',
    '/admin/estudiantes': 'Estudiantes',
    '/profesor/asistencia': 'Control de Asistencia',
    '/admin/users': 'Usuarios',
    '/admin/grados/': 'Grados', // Para subrutas
    '/profesor/grados/': 'Grados' // Para subrutas
};

// Mapeo de rutas base a roles (prioridad media)
const ROUTE_ROLE_MAPPING: Record<string, UserRole> = {
    '/admin': UserRole.ADMIN,
    '/profesor': UserRole.PROFESOR,
    '/estudiante': UserRole.ESTUDIANTE,
    '/tutor': UserRole.TUTOR
};

// Títulos base por rol (prioridad baja)
const ROLE_TITLES = {
    [UserRole.ADMIN]: 'Panel Administrativo',
    [UserRole.PROFESOR]: 'Panel Docente',
    [UserRole.ESTUDIANTE]: 'Portal Estudiantil',
    [UserRole.TUTOR]: 'Portal de Tutores',
    default: 'Plataforma Educativa'
};

// Mapeo de rutas a nombres de grado
const GRADE_NAME_MAPPING: Record<string, string> = {
    '/admin/grados/': '',
    '/profesor/grados/': ''
};

// Función para normalizar rutas y mejorar coincidencias
const normalizePath = (path: string): string => {
    return path.endsWith('/') ? path.slice(0, -1) : path;
};

export const getAppTitle = (role?: UserRole): string => {
    const currentRawPath = window.location.pathname;
    const currentPath = normalizePath(currentRawPath);

    // 1. Buscar coincidencia exacta en rutas específicas (incluyendo subrutas)
    const exactMatch = Object.keys(ROUTE_TITLE_MAPPING)
        .map(route => normalizePath(route))
        .sort((a, b) => b.length - a.length) // Rutas más largas primero
        .find(route => currentPath.startsWith(route));

    if (exactMatch) {
        const originalKey = Object.keys(ROUTE_TITLE_MAPPING).find(key => 
            normalizePath(key) === exactMatch
        ) || exactMatch;
        return ROUTE_TITLE_MAPPING[originalKey];
    }

    // 2. Buscar coincidencia en rutas base para roles
    const roleMatch = Object.keys(ROUTE_ROLE_MAPPING)
        .map(route => normalizePath(route))
        .sort((a, b) => b.length - a.length)
        .find(route => currentPath.startsWith(route));

    if (roleMatch) {
        const originalKey = Object.keys(ROUTE_ROLE_MAPPING).find(key => 
            normalizePath(key) === roleMatch
        ) || roleMatch;
        return ROLE_TITLES[ROUTE_ROLE_MAPPING[originalKey]];
    }

    // 3. Usar el rol del usuario si no hay coincidencias en rutas
    return ROLE_TITLES[role || 'default'];
};

// Función para obtener el nombre del grado
export const getGradeName = (gradeDetails?: { gradoNombre?: string }): string | null => {
    const currentPath = window.location.pathname;

    // Si tenemos detalles del grado, usamos el nombre real
    if (gradeDetails?.gradoNombre) {
        return gradeDetails.gradoNombre;
    }

    // Buscar coincidencia en rutas de grado
    const gradeMatch = Object.keys(GRADE_NAME_MAPPING)
        .find(route => currentPath.includes(route));

    if (gradeMatch) {
        const gradeId = currentPath.split('/').pop();
        return `${GRADE_NAME_MAPPING[gradeMatch]}${gradeId}`;
    }

    return null;
};



export const menuText = {
    profile: 'Perfil',
    logout: 'Cerrar sesión',
    notifications: 'Notificaciones',
    help: 'Ayuda',
    profileSettings: 'Perfil y Configuración'
};
