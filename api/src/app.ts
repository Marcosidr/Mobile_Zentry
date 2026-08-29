import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import path from 'node:path';
import { env } from './config/env';
import { errorHandler } from './middlewares/errorHandler';
import { routes } from './routes';

export const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.resolve(process.cwd(), env.UPLOAD_DIR)));

app.get('/health', (_request, response) => {
  response.json({ status: 'ok', service: 'mobile-zentry-api' });
});

app.use('/api', routes);
app.use(errorHandler);

