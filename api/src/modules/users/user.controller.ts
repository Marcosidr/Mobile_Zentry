import { asyncHandler } from '../../middlewares/asyncHandler';
import { getParam } from '../../utils/getParam';
import { getRequestUser } from '../../utils/requestUser';
import { UserService } from './user.service';

export const UserController = {
  list: asyncHandler(async (_request, response) => {
    const users = await UserService.list();
    response.json(users);
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
