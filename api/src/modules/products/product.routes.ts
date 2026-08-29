import { Role } from '@prisma/client';
import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import { productImageUpload } from '../../middlewares/upload';
import { validate } from '../../middlewares/validate';
import { ProductController } from './product.controller';
import {
  createProductSchema,
  productIdParamSchema,
  updateProductSchema
} from './product.schemas';

export const productRoutes = Router();

productRoutes.use(authenticate);
productRoutes.get('/', ProductController.list);
productRoutes.get('/:id', validate(productIdParamSchema), ProductController.findById);
productRoutes.post('/', authorize(Role.ADMIN), validate(createProductSchema), ProductController.create);
productRoutes.put('/:id', authorize(Role.ADMIN), validate(updateProductSchema), ProductController.update);
productRoutes.delete('/:id', authorize(Role.ADMIN), validate(productIdParamSchema), ProductController.remove);
productRoutes.post(
  '/:id/image',
  authorize(Role.ADMIN),
  validate(productIdParamSchema),
  productImageUpload.single('image'),
  ProductController.uploadImage
);

