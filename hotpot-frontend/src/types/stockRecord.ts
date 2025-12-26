// 出入库记录类型定义
export interface StockRecord {
  id?: number;
  ingredientId: number;
  ingredientName?: string;  // 关联字段
  type: string;  // IN/OUT
  quantity: number;
  unitPrice?: number;
  totalPrice?: number;
  operatorId?: number;
  operatorName: string;
  remark?: string;
  relatedOrder?: string;
  recordTime?: string;
  unit?: string;  // 关联字段(从ingredient表)
}
