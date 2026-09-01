import { asyncHandler } from '../../middlewares/asyncHandler';
import { getParam } from '../../utils/getParam';
import { CategoryService } from './category.service';

export const CategoryController = {
  list: asyncHandler(async (_request, response) => {
    const categories = await CategoryService.list();
    response.json(categories);
  }),

  findById: asyncHandler(async (request, response) => {
    const category = await CategoryService.findById(getParam(request, 'id'));
    response.json(category);
  }),

  create: asyncHandler(async (request, response) => {
    const category = await CategoryService.create(request.body);
    response.status(201).json(category);
  }),

  update: asyncHandler(async (request, response) => {
    const category = await CategoryService.update(getParam(request, 'id'), request.body);
    response.json(category);
  }),

  remove: asyncHandler(async (request, response) => {
    await CategoryService.remove(getParam(request, 'id'));
    response.status(204).send();
  })
};
