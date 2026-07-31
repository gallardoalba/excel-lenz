import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Ungültige E-Mail-Adresse'),
  password: z.string()
    .min(8, 'Passwort muss mindestens 8 Zeichen haben')
    .regex(/[a-zA-Z]/, 'Passwort muss Buchstaben enthalten')
    .regex(/[0-9]/, 'Passwort muss Zahlen enthalten'),
  name: z.string().min(1, 'Name ist erforderlich').max(100),
});

export const loginSchema = z.object({
  email: z.string().email('Ungültige E-Mail-Adresse'),
  password: z.string().min(1, 'Passwort ist erforderlich'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
