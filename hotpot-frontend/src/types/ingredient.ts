// 食材类型定义
export interface Ingredient {
  id?: number;
  name: string;
  code: string;
  categoryId: number;
  unit: string;
  price: number;
  minStock: number;
  maxStock: number;
  supplierId?: number;
  description?: string;
  imageUrl?: string;
  status: number;
  createTime?: string;
  categoryName?: string;
  currentStock?: number;
  stockStatus?: string;
}

export interface IngredientStockVO {
  id: number;
  name: string;  // 注意:后端返回的是name,不是ingredientName
  code: string;
  categoryId: number;
  categoryName: string;
  unit: string;
  price: number | object; // 后端返回BigDecimal类型，可能需要转换
  currentStock: number | object; // 后端返回BigDecimal类型，可能需要转换
  minStock: number | object; // 后端返回BigDecimal类型，可能需要转换
  maxStock: number | object; // 后端返回BigDecimal类型，可能需要转换
  stockStatus: string;  // '正常' | '库存不足' | '库存过剩'
}

export interface UpdateStockParams {
  ingredientId: number;
  type: 'in' | 'out';
  quantity: number;
  operator: string;
  remark?: string;
}
