import { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { prisma } from '../../lib/prisma';
import { AppError } from '../../utils/AppError';
import type { CreateUserPayload, UpdateUserPayload } from './user.schemas';

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

  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: userSelect
    });

    if (!user) {
      throw new AppError('Usuario nao encontrado.', 404);
    }

    return user;
  },

  async create(data: CreateUserPayload) {
    await this.ensureEmailAvailable(data.email);

    const passwordHash = await bcrypt.hash(data.password, 10);

    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role ?? Role.USER
      },
      select: userSelect
    });
  },

  async update(id: string, data: UpdateUserPayload) {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new AppError('Usuario nao encontrado.', 404);
    }

    if (data.email && data.email !== user.email) {
      await this.ensureEmailAvailable(data.email, id);
    }

    if (user.role === Role.ADMIN && data.role === Role.USER) {
      await this.ensureAnotherAdminExists();
    }

    const updateData: {
      name?: string;
      email?: string;
      passwordHash?: string;
      role?: Role;
    } = {};

    if (data.name) {
      updateData.name = data.name;
    }

    if (data.email) {
      updateData.email = data.email;
    }

    if (data.password) {
      updateData.passwordHash = await bcrypt.hash(data.password, 10);
    }

    if (data.role) {
      updateData.role = data.role;
    }

    return prisma.user.update({
      where: { id },
      data: updateData,
      select: userSelect
    });
  },

  updateRole(id: string, role: Role) {
    return this.update(id, { role });
  },

  async remove(id: string, currentUserId: string) {
    if (id === currentUserId) {
      throw new AppError('Voce nao pode excluir seu proprio usuario.', 400);
    }

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new AppError('Usuario nao encontrado.', 404);
    }

    if (user.role === Role.ADMIN) {
      await this.ensureAnotherAdminExists();
    }

    await prisma.user.delete({ where: { id } });
  },

  async ensureEmailAvailable(email: string, ignoredUserId?: string) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (user && user.id !== ignoredUserId) {
      throw new AppError('E-mail ja cadastrado.', 409);
    }
  },

  async ensureAnotherAdminExists() {
    const admins = await prisma.user.count({ where: { role: Role.ADMIN } });

    if (admins <= 1) {
      throw new AppError('Nao e permitido remover o ultimo administrador.', 400);
    }
  }
};