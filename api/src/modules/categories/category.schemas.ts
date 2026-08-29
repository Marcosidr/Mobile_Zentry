import { z } from 'zod';

export const categoryPayloadSchema = z.object({
  name: z.string().trim().min(2)
});

export const createCategorySchema = z.object({
  body: categoryPayloadSchema
});

export const updateCategorySchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: categoryPayloadSchema
});

export const categoryIdParamSchema = z.object({
  params: z.object({ id: z.string().uuid() })
});

export type CategoryPayload = z.infer<typeof categoryPayloadSchema>;

