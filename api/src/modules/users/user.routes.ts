import { Role } from '@prisma/client';
import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import { validate } from '../../middlewares/validate';
import { UserController } from './user.controller';
import {
  createUserSchema,
  updateUserRoleSchema,
  updateUserSchema,
  userIdParamSchema
} from './user.schemas';

export const userRoutes = Router();

userRoutes.use(authenticate, authorize(Role.ADMIN));
userRoutes.get('/', UserController.list);
userRoutes.post('/', validate(createUserSchema), UserController.create);
userRoutes.get('/:id', validate(userIdParamSchema), UserController.findById);
userRoutes.put('/:id', validate(updateUserSchema), UserController.update);
userRoutes.patch('/:id/role', validate(updateUserRoleSchema), UserController.updateRole);
userRoutes.delete('/:id', validate(userIdParamSchema), UserController.remove);