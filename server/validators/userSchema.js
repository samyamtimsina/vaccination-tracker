import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().min(1, { message: 'Email is required' }).and(z.email()),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
  wardId: z.coerce
    .number()
    .int()
    .positive({ message: 'Ward ID must be a positive number' }),
});

// Login schema
export const loginSchema = z.object({
  email: z.string().min(1, { message: 'Email is required' }).and(z.email()),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
