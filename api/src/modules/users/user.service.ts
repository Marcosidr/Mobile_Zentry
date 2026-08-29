import { prisma } from '../../lib/prisma';
import { AppError } from '../../utils/AppError';

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true
};

export const UserService = {
  list() {
    return prisma.user.findMany({
      select: userSelect,
      orderBy: { name: 'asc' }
    });
  },

  async updateRole(id: string, role: 'ADMIN' | 'USER') {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new AppError('Usuario nao encontrado.', 404);
    }

    return prisma.user.update({
      where: { id },
      data: { role },
      select: userSelect
    });
  },

  async remove(id: string, currentUserId: string) {
    if (id === currentUserId) {
      throw new AppError('Voce nao pode excluir seu proprio usuario.', 400);
    }

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new AppError('Usuario nao encontrado.', 404);
    }

    if (user.role === 'ADMIN') {
      const admins = await prisma.user.count({ where: { role: 'ADMIN' } });

      if (admins <= 1) {
        throw new AppError('Nao e permitido excluir o ultimo administrador.', 400);
      }
    }

    await prisma.user.delete({ where: { id } });
  }
};

