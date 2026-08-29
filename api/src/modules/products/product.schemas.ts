import { z } from 'zod';

export const productPayloadSchema = z.object({
  name: z.string().trim().min(2),
  description: z.string().trim().optional(),
  code: z.string().trim().min(2),
  price: z.coerce.number().nonnegative(),
  quantity: z.coerce.number().int().nonnegative(),
  minimumStock: z.coerce.number().int().nonnegative().default(0),
  categoryId: z.string().uuid()
});

export const productUpdatePayloadSchema = productPayloadSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'Informe pelo menos um campo para atualizar.' }
);

export const createProductSchema = z.object({
  body: productPayloadSchema
});

export const updateProductSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: productUpdatePayloadSchema
});

export const productIdParamSchema = z.object({
  params: z.object({ id: z.string().uuid() })
});

export type ProductPayload = z.infer<typeof productPayloadSchema>;
export type ProductUpdatePayload = z.infer<typeof productUpdatePayloadSchema>;

