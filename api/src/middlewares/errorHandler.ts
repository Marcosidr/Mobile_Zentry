import type { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import { Prisma } from '@prisma/client';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';

export function errorHandler(
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction
) {
  if (error instanceof multer.MulterError) {
    const message =
      error.code === 'LIMIT_FILE_SIZE'
        ? 'Imagem maior que o limite de 5 MB.'
        : 'Falha no upload da imagem.';

    response.status(400).json({ message });
    return;
  }

  if (error instanceof AppError) {
    response.status(error.statusCode).json({
      message: error.message,
      details: error.details
    });
    return;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      response.status(409).json({ message: 'Registro duplicado.' });
      return;
    }
  }

  if (env.NODE_ENV !== 'test') {
    console.error(error);
  }

  response.status(500).json({ message: 'Erro interno do servidor.' });
}

