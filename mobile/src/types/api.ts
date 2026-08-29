export type Role = 'ADMIN' | 'USER';
export type StockStatus = 'LOW' | 'OK';
export type MovementType = 'ENTRADA' | 'SAIDA';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  _count?: {
    products: number;
  };
}

export interface Product {
  id: string;
  name: string;
  description?: string | null;
  code: string;
  price: number;
  quantity: number;
  minimumStock: number;
  imageUrl?: string | null;
  categoryId: string;
  category: Category;
  stockStatus: StockStatus;
  createdAt: string;
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  type: MovementType;
  quantity: number;
  note?: string | null;
  product: Product;
  user: User;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface StockMovementResponse {
  movement: StockMovement;
  product: Product;
}