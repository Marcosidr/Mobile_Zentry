import type { Request } from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { env } from '../../config/env';
import { prisma } from '../../lib/prisma';
import { AppError } from '../../utils/AppError';
import type { ProductPayload, ProductUpdatePayload } from './product.schemas';

function productStatus<T extends { quantity: number; minimumStock: number }>(product: T) {
  return {
    ...product,
    stockStatus: product.quantity <= product.minimumStock ? 'LOW' : 'OK'
  };
}

function parseSearch(query: Request['query']) {
  const search = typeof query.search === 'string' ? query.search.trim() : '';
  return search.length > 0 ? search : undefined;
}

export const ProductService = {
  async list(query: Request['query']) {
    const search = parseSearch(query);
    const products = await prisma.product.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { code: { contains: search, mode: 'insensitive' } }
            ]
          }
        : undefined,
      include: { category: true },
      orderBy: { name: 'asc' }
    });

    return products.map(productStatus);
  },

  async findById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true }
    });

    if (!product) {
      throw new AppError('Produto nao encontrado.', 404);
    }

    return productStatus(product);
  },

  async create(data: ProductPayload) {
    await this.ensureCategoryExists(data.categoryId);

    const product = await prisma.product.create({
      data,
      include: { category: true }
    });

    return productStatus(product);
  },

  async update(id: string, data: ProductUpdatePayload) {
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new AppError('Produto nao encontrado.', 404);
    }

    if (data.categoryId) {
      await this.ensureCategoryExists(data.categoryId);
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data,
      include: { category: true }
    });

    return productStatus(updatedProduct);
  },

  async remove(id: string) {
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new AppError('Produto nao encontrado.', 404);
    }

    await prisma.product.delete({ where: { id } });
  },

  async setImage(id: string, file: Express.Multer.File) {
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      await fs.unlink(file.path).catch(() => undefined);
      throw new AppError('Produto nao encontrado.', 404);
    }

    if (product.imageUrl) {
      const previousFile = path.basename(product.imageUrl);
      await fs.unlink(path.resolve(process.cwd(), env.UPLOAD_DIR, previousFile)).catch(() => undefined);
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { imageUrl: `/uploads/${file.filename}` },
      include: { category: true }
    });

    return productStatus(updatedProduct);
  },

  async ensureCategoryExists(categoryId: string) {
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (!category) {
      throw new AppError('Categoria nao encontrada.', 404);
    }
  }
};

