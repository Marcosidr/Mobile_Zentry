import { Role, type User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { prisma } from '../../lib/prisma';
import { AppError } from '../../utils/AppError';
import type { LoginPayload, RegisterPayload } from './auth.schemas';

type PublicUser = Pick<User, 'id' | 'name' | 'email' | 'role' | 'createdAt'>;

function toPublicUser(user: PublicUser) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  };
}

function createToken(user: Pick<User, 'id' | 'role'>) {
  return jwt.sign({ role: user.role }, env.JWT_SECRET, {
    subject: user.id,
    expiresIn: '7d'
  });
}

export const AuthService = {
  async register(data: RegisterPayload) {
    const emailInUse = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (emailInUse) {
      throw new AppError('E-mail ja cadastrado.', 409);
    }

    const totalUsers = await prisma.user.count();
    const passwordHash = await bcrypt.hash(data.password, 10);
    const role = totalUsers === 0 ? Role.ADMIN : Role.USER;

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        role
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    return {
      user: toPublicUser(user),
      token: createToken(user)
    };
  },

  async login(data: LoginPayload) {
    const user = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (!user) {
      throw new AppError('Credenciais invalidas.', 401);
    }

    const passwordMatches = await bcrypt.compare(data.password, user.passwordHash);

    if (!passwordMatches) {
      throw new AppError('Credenciais invalidas.', 401);
    }

    return {
      user: toPublicUser(user),
      token: createToken(user)
    };
  }
};

