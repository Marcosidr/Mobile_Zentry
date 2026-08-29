import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { prisma } from '../lib/prisma';
import { AppError } from '../utils/AppError';

type TokenPayload = jwt.JwtPayload & {
  sub: string;
};

export async function authenticate(
  request: Request,
  _response: Response,
  next: NextFunction
) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new AppError('Token nao informado.', 401);
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw new AppError('Token invalido.', 401);
    }

    const payload = jwt.verify(token, env.JWT_SECRET) as TokenPayload;

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, name: true, email: true, role: true }
    });

    if (!user) {
      throw new AppError('Usuario nao encontrado.', 401);
    }

    request.user = user;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
      return;
    }

    next(new AppError('Sessao expirada ou invalida.', 401));
  }
}

