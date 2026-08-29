import { prisma } from '../../lib/prisma';
import { AppError } from '../../utils/AppError';
import type { StockMovementPayload } from './stockMovement.schemas';

export const StockMovementService = {
  list() {
    return prisma.stockMovement.findMany({
      include: {
        product: { include: { category: true } },
        user: { select: { id: true, name: true, email: true, role: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 100
    });
  },

  create(data: StockMovementPayload, userId: string) {
    return prisma.$transaction(async (transaction) => {
      const product = await transaction.product.findUnique({
        where: { id: data.productId }
      });

      if (!product) {
        throw new AppError('Produto nao encontrado.', 404);
      }

      if (data.type === 'SAIDA' && product.quantity < data.quantity) {
        throw new AppError('Estoque insuficiente para registrar a saida.', 400);
      }

      const nextQuantity =
        data.type === 'ENTRADA'
          ? product.quantity + data.quantity
          : product.quantity - data.quantity;

      const movement = await transaction.stockMovement.create({
        data: {
          productId: data.productId,
          type: data.type,
          quantity: data.quantity,
          note: data.note,
          userId
        },
        include: {
          product: true,
          user: { select: { id: true, name: true, email: true, role: true } }
        }
      });

      const updatedProduct = await transaction.product.update({
        where: { id: data.productId },
        data: { quantity: nextQuantity },
        include: { category: true }
      });

      return {
        movement,
        product: {
          ...updatedProduct,
          stockStatus:
            updatedProduct.quantity <= updatedProduct.minimumStock ? 'LOW' : 'OK'
        }
      };
    });
  }
};

