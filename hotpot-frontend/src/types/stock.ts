// 库存类型定义
export interface Stock {
  id?: number;
  ingredientId: number;
  ingredientName?: string;  // 关联字段
  quantity: number;
  warehouse: string;
  unit?: string;  // 关联字段
  updateTime?: string;
}
