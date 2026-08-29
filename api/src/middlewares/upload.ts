import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import multer from 'multer';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';

const uploadDir = path.resolve(process.cwd(), env.UPLOAD_DIR);
const maxFileSize = 5 * 1024 * 1024;
const allowedTypes = new Map<string, string[]>([
  ['image/jpeg', ['.jpg', '.jpeg']],
  ['image/png', ['.png']],
  ['image/webp', ['.webp']]
]);

fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_request, _file, callback) => {
    callback(null, uploadDir);
  },
  filename: (_request, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const filename = `produto-${randomUUID()}-${Date.now()}${extension}`;
    callback(null, filename);
  }
});

export const productImageUpload = multer({
  storage,
  limits: { fileSize: maxFileSize },
  fileFilter: (_request, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const validExtensions = allowedTypes.get(file.mimetype);

    if (!validExtensions || !validExtensions.includes(extension)) {
      callback(new AppError('Formato de imagem invalido. Use JPG, JPEG, PNG ou WEBP.'));
      return;
    }

    callback(null, true);
  }
});
