// src/utils/appTextUtils.ts
import { UserRole } from '../types';

// Mapeo de rutas específicas a títulos (máxima prioridad)
const ROUTE_TITLE_MAPPING: Record<string, string> = {
    '/admin/grades': 'Grados',
    '/profesor/grades': 'Grados',
    '/admin/students': 'Estudiantes',
    '/profesor/attendance': 'Control de Asistencia'
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

export const getAppTitle = (role?: UserRole): string => {
    const currentPath = window.location.pathname;

    // 1. Buscar coincidencia exacta en rutas específicas
    const exactMatch = Object.keys(ROUTE_TITLE_MAPPING)
        .sort((a, b) => b.length - a.length) // Orden descendente por longitud
        .find(route => currentPath.startsWith(route));

    if (exactMatch) return ROUTE_TITLE_MAPPING[exactMatch];

    // 2. Buscar coincidencia en rutas base para roles
    const roleMatch = Object.keys(ROUTE_ROLE_MAPPING)
        .sort((a, b) => b.length - a.length)
        .find(route => currentPath.startsWith(route));

    if (roleMatch) return ROLE_TITLES[ROUTE_ROLE_MAPPING[roleMatch]];

    // 3. Usar el rol del usuario si no hay coincidencias en rutas
    return ROLE_TITLES[role || 'default'];
};

export const menuText = {
    profile: 'Perfil',
    logout: 'Cerrar sesión',
    notifications: 'Notificaciones',
    help: 'Ayuda',
    profileSettings: 'Perfil y Configuración'
};