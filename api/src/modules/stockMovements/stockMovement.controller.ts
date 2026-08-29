import { asyncHandler } from '../../middlewares/asyncHandler';
import { getRequestUser } from '../../utils/requestUser';
import { StockMovementService } from './stockMovement.service';

export const StockMovementController = {
  list: asyncHandler(async (_request, response) => {
    const movements = await StockMovementService.list();
    response.json(movements);
  }),

  create: asyncHandler(async (request, response) => {
    const user = getRequestUser(request);
    const result = await StockMovementService.create(request.body, user.id);
    response.status(201).json(result);
  })
};

