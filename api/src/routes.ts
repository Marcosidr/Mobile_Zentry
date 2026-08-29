import { Router } from 'express';
import { authRoutes } from './modules/auth/auth.routes';
import { categoryRoutes } from './modules/categories/category.routes';
import { productRoutes } from './modules/products/product.routes';
import { stockMovementRoutes } from './modules/stockMovements/stockMovement.routes';
import { userRoutes } from './modules/users/user.routes';

export const routes = Router();

routes.use('/auth', authRoutes);
routes.use('/users', userRoutes);
routes.use('/categories', categoryRoutes);
routes.use('/products', productRoutes);
routes.use('/stock-movements', stockMovementRoutes);

