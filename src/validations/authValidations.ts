// src/validations/authValidations.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Por favor, ingrese un email válido'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
  rememberMe: z.boolean().optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email('Por favor, ingrese un email válido'),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const registerSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  apellido: z.string().min(1, 'El apellido es obligatorio'),
  email: z.string().email('Por favor, ingrese un email válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string().min(1, 'Debe confirmar su contraseña'),
  terms: z.boolean().refine(val => val === true, {
    message: 'Debe aceptar los términos y condiciones',
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

export type RegisterFormValues = z.infer<typeof registerSchema>;