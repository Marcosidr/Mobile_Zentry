import type { Role } from '@prisma/client';
import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError';

export function authorize(...roles: Role[]) {
  return (request: Request, _response: Response, next: NextFunction) => {
    if (!request.user) {
      next(new AppError('Usuario nao autenticado.', 401));
      return;
    }

    if (!roles.includes(request.user.role)) {
      next(new AppError('Permissao insuficiente.', 403));
      return;
    }

    next();
  };
}

