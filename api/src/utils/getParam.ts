import type { Request } from 'express';
import { AppError } from './AppError';

export function getParam(request: Request, name: string) {
  const value = request.params[name];

  if (typeof value !== 'string') {
    throw new AppError(`Parametro ${name} invalido.`, 400);
  }

  return value;
}

