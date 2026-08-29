import { z } from 'zod';

export const registerPayloadSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  password: z.string().min(6),
  role: z.enum(['ADMIN', 'USER']).optional()
});

export const loginPayloadSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(6)
});

export const registerSchema = z.object({
  body: registerPayloadSchema
});

export const loginSchema = z.object({
  body: loginPayloadSchema
});

export type RegisterPayload = z.infer<typeof registerPayloadSchema>;
export type LoginPayload = z.infer<typeof loginPayloadSchema>;

