import { prisma } from '../../lib/prisma';
import { AppError } from '../../utils/AppError';
import type { CategoryPayload } from './category.schemas';

export const CategoryService = {
  list() {
    return prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { products: true } } }
    });
  },

  create(data: CategoryPayload) {
    return prisma.category.create({ data });
  },

  async update(id: string, data: CategoryPayload) {
    const category = await prisma.category.findUnique({ where: { id } });

    if (!category) {
      throw new AppError('Categoria nao encontrada.', 404);
    }

    return prisma.category.update({ where: { id }, data });
  },

  async remove(id: string) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } }
    });

    if (!category) {
      throw new AppError('Categoria nao encontrada.', 404);
    }

    if (category._count.products > 0) {
      throw new AppError('Categoria possui produtos vinculados.', 400);
    }

    await prisma.category.delete({ where: { id } });
  }
};

