import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { validate } from '../../middlewares/validate';
import { StockMovementController } from './stockMovement.controller';
import { createStockMovementSchema } from './stockMovement.schemas';

export const stockMovementRoutes = Router();

stockMovementRoutes.use(authenticate);
stockMovementRoutes.get('/', StockMovementController.list);
stockMovementRoutes.post('/', validate(createStockMovementSchema), StockMovementController.create);

