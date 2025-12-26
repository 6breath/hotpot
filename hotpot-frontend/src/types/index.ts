// 类型定义统一导出
export type { Result, PageParams, PageResult } from './common';
export type { Category, CategoryMap } from './category';
export type { Ingredient, IngredientStockVO, UpdateStockParams } from './ingredient';
export type { Stock } from './stock';
export type { StockRecord } from './stockRecord';
export type { Supplier } from './supplier';
export type { User, LoginRequest, LoginResponse } from './user';

export interface Order {
  id: number;
  orderNo: string;
  userId: number;
  tableNumber?: string;
  totalAmount: number;
  status: string;
  createTime: string;
  updateTime: string;
}

export interface OrderDetail {
  id: number;
  orderId: number;
  ingredientId: number;
  ingredientName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  note?: string;
  createTime: string;
}

export interface Cart {
  id: number;
  userId: number;
  ingredientId: number;
  quantity: number;
  createTime: string;
  updateTime: string;
}
