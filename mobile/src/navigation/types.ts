import type { MovementType } from '../types/api';

export type RootStackParamList = {
  Login: undefined;
  Products: undefined;
  ProductDetails: { productId: string };
  ProductForm: { productId?: string } | undefined;
  StockMovement: { productId: string; type: MovementType };
};

