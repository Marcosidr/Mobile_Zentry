import { z } from 'zod';

export const userPayloadSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(6),
  role: z.enum(['ADMIN', 'USER']).default('USER')
});

export const updateUserPayloadSchema = z
  .object({
    name: z.string().trim().min(2).optional(),
    email: z.string().trim().toLowerCase().email().optional(),
    password: z.string().min(6).optional(),
    role: z.enum(['ADMIN', 'USER']).optional()
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Informe pelo menos um campo para atualizar.'
  });

export const userIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  })
});

export const createUserSchema = z.object({
  body: userPayloadSchema
});

export const updateUserSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  }),
  body: updateUserPayloadSchema
});

export const updateUserRoleSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  }),
  body: z.object({
    role: z.enum(['ADMIN', 'USER'])
  })
});

export type CreateUserPayload = z.infer<typeof userPayloadSchema>;
export type UpdateUserPayload = z.infer<typeof updateUserPayloadSchema>;