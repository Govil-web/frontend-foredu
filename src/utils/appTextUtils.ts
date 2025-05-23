// src/utils/appTextUtils.ts
import { UserRole } from '../types';

export const getAppTitle = (role?: UserRole) => {
    const titles = {
        [UserRole.ADMIN]: 'Panel Administrativo',
        [UserRole.PROFESOR]: 'Panel Docente',
        [UserRole.ESTUDIANTE]: 'Portal Estudiantil',
        [UserRole.TUTOR]: 'Portal de Tutores',
        default: 'Plataforma Educativa'
    };

    return titles[role || 'default'];
};

export const menuText = {
    profile: 'Perfil',
    logout: 'Cerrar sesión',
    notifications: 'Notificaciones',
    help: 'Ayuda',
    profileSettings: 'Perfil y Configuración'
};