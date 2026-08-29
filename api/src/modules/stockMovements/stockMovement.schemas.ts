import { z } from 'zod';

export const stockMovementPayloadSchema = z.object({
  productId: z.string().uuid(),
  type: z.enum(['ENTRADA', 'SAIDA']),
  quantity: z.coerce.number().int().positive(),
  note: z.string().trim().optional()
});

export const createStockMovementSchema = z.object({
  body: stockMovementPayloadSchema
});

export type StockMovementPayload = z.infer<typeof stockMovementPayloadSchema>;

