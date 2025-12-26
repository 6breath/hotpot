import { http } from '../utils/request';
import type { StockRecord } from '../types/stockRecord';

export const stockRecordApi = {
  // 获取所有记录(带食材名称)
  list: () => http.get<StockRecord[]>('/api/stock-record/list'),

  // 获取最近记录
  getRecentRecords: (days: number) => 
    http.get<StockRecord[]>(`/api/stock-record/recent/${days}`),

  // 根据食材ID获取记录
  getRecordsByIngredient: (ingredientId: number) => 
    http.get<StockRecord[]>(`/api/stock-record/ingredient/${ingredientId}`),

  // 添加记录
  add: (data: StockRecord) => 
    http.post<boolean>('/api/stock-record/add', data),
};
