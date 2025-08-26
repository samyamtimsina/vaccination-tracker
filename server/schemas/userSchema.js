import { z } from 'zod';

// Schema for the user registration request body
export const registerSchema = z.object({
  // 'name' must be a string and have at least 1 character
  name: z.string().min(1, { message: 'Name is required' }),

  // 'email' must be a string, a valid email format, and not be empty
  email: z.email(),
  phoneNumber: z.string().min(10, { message: 'Phone number must be at least 10 characters long' }),

  // 'password' must be a string and have a minimum length for security
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' }),

  // 'wardId' must be a number and is required
  wardId: z.string().transform((val, ctx) => {
    const parsed = parseInt(val, 10);
    if (isNaN(parsed)) {
      ctx.addIssue({
        message: 'Ward number must be a number',
      });
      return z.NEVER;
    }
    return parsed;
  }),
});

// Schema for the user login request body
export const loginSchema = z.object({
  // 'email' must be a string and a valid email format
  email: z.email(),

  // 'password' must be a string and is required
  password: z.string().min(1, { message: 'Password is required' }),
});
