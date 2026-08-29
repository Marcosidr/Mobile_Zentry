import { Role } from '@prisma/client';
import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import { validate } from '../../middlewares/validate';
import { UserController } from './user.controller';
import { updateUserRoleSchema, userIdParamSchema } from './user.schemas';

export const userRoutes = Router();

userRoutes.use(authenticate, authorize(Role.ADMIN));
userRoutes.get('/', UserController.list);
userRoutes.patch('/:id/role', validate(updateUserRoleSchema), UserController.updateRole);
userRoutes.delete('/:id', validate(userIdParamSchema), UserController.remove);

