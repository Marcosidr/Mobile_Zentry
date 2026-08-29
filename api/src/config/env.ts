import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().min(1).optional(),
  JWT_SECRET: z.string().min(12).default('dev-secret-change-me'),
  PORT: z.coerce.number().default(3333),
  UPLOAD_DIR: z.string().default('uploads'),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development')
});

export const env = envSchema.parse(process.env);

