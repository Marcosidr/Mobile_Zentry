import { asyncHandler } from '../../middlewares/asyncHandler';
import { getParam } from '../../utils/getParam';
import { getRequestUser } from '../../utils/requestUser';
import { UserService } from './user.service';

export const UserController = {
  list: asyncHandler(async (_request, response) => {
    const users = await UserService.list();
    response.json(users);
  }),

  findById: asyncHandler(async (request, response) => {
    const user = await UserService.findById(getParam(request, 'id'));
    response.json(user);
  }),

  create: asyncHandler(async (request, response) => {
    const user = await UserService.create(request.body);
    response.status(201).json(user);
  }),

  update: asyncHandler(async (request, response) => {
    const user = await UserService.update(getParam(request, 'id'), request.body);
    response.json(user);
  }),

  updateRole: asyncHandler(async (request, response) => {
    const user = await UserService.updateRole(getParam(request, 'id'), request.body.role);
    response.json(user);
  }),

  remove: asyncHandler(async (request, response) => {
    const currentUser = getRequestUser(request);
    await UserService.remove(getParam(request, 'id'), currentUser.id);
    response.status(204).send();
  })
};