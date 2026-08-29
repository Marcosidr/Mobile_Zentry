import type { NextFunction, Request, Response } from 'express';
import type { ZodTypeAny } from 'zod';
import { AppError } from '../utils/AppError';

export function validate(schema: ZodTypeAny) {
  return (request: Request, _response: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: request.body,
      params: request.params,
      query: request.query
    });

    if (!result.success) {
      next(new AppError('Dados invalidos.', 400, result.error.flatten()));
      return;
    }

    const data = result.data as {
      body?: unknown;
      params?: Record<string, string>;
      query?: Request['query'];
    };

    if (data.body) {
      request.body = data.body;
    }

    if (data.params) {
      request.params = data.params;
    }

    if (data.query) {
      request.query = data.query;
    }

    next();
  };
}

