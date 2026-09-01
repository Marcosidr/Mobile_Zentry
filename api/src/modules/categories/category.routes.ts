import { Role } from '@prisma/client';
import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import { validate } from '../../middlewares/validate';
import { CategoryController } from './category.controller';
import {
  categoryIdParamSchema,
  createCategorySchema,
  updateCategorySchema
} from './category.schemas';

export const categoryRoutes = Router();

categoryRoutes.use(authenticate);
categoryRoutes.get('/', CategoryController.list);
categoryRoutes.get('/:id', validate(categoryIdParamSchema), CategoryController.findById);
categoryRoutes.post('/', authorize(Role.ADMIN), validate(createCategorySchema), CategoryController.create);
categoryRoutes.put('/:id', authorize(Role.ADMIN), validate(updateCategorySchema), CategoryController.update);
categoryRoutes.delete('/:id', authorize(Role.ADMIN), validate(categoryIdParamSchema), CategoryController.remove);
