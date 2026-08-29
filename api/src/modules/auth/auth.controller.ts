import { asyncHandler } from '../../middlewares/asyncHandler';
import { getRequestUser } from '../../utils/requestUser';
import { AuthService } from './auth.service';

export const AuthController = {
  register: asyncHandler(async (request, response) => {
    const result = await AuthService.register(request.body);
    response.status(201).json(result);
  }),

  login: asyncHandler(async (request, response) => {
    const result = await AuthService.login(request.body);
    response.json(result);
  }),

  me: asyncHandler(async (request, response) => {
    response.json({ user: getRequestUser(request) });
  })
};

