import type { NavigatorScreenParams } from '@react-navigation/native';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { MovementType } from '../types/api';

export type MainTabParamList = {
  ProductsTab: undefined;
  CategoriesTab: undefined;
  UsersTab: undefined;
};

export type RootStackParamList = {
  Login: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  ProductDetails: { productId: string };
  ProductForm: { productId?: string } | undefined;
  StockMovement: { productId: string; type: MovementType };
  UserForm: { userId?: string } | undefined;
  CategoryForm: { categoryId?: string } | undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, T>,
  NativeStackScreenProps<RootStackParamList>
>;
