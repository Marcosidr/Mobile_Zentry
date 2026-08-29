import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { validate } from '../../middlewares/validate';
import { AuthController } from './auth.controller';
import { loginSchema, registerSchema } from './auth.schemas';

export const authRoutes = Router();

authRoutes.post('/register', validate(registerSchema), AuthController.register);
authRoutes.post('/login', validate(loginSchema), AuthController.login);
authRoutes.get('/me', authenticate, AuthController.me);

