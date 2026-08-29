import type { Request } from 'express';
import { AppError } from './AppError';

export function getRequestUser(request: Request) {
  if (!request.user) {
    throw new AppError('Usuario nao autenticado.', 401);
  }

  return request.user;
}

