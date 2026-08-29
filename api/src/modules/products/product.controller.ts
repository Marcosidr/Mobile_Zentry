import { asyncHandler } from '../../middlewares/asyncHandler';
import { AppError } from '../../utils/AppError';
import { getParam } from '../../utils/getParam';
import { ProductService } from './product.service';

export const ProductController = {
  list: asyncHandler(async (request, response) => {
    const products = await ProductService.list(request.query);
    response.json(products);
  }),

  findById: asyncHandler(async (request, response) => {
    const product = await ProductService.findById(getParam(request, 'id'));
    response.json(product);
  }),

  create: asyncHandler(async (request, response) => {
    const product = await ProductService.create(request.body);
    response.status(201).json(product);
  }),

  update: asyncHandler(async (request, response) => {
    const product = await ProductService.update(getParam(request, 'id'), request.body);
    response.json(product);
  }),

  remove: asyncHandler(async (request, response) => {
    await ProductService.remove(getParam(request, 'id'));
    response.status(204).send();
  }),

  uploadImage: asyncHandler(async (request, response) => {
    if (!request.file) {
      throw new AppError('Imagem nao informada.', 400);
    }

    const product = await ProductService.setImage(getParam(request, 'id'), request.file);
    response.json(product);
  })
};
