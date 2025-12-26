import { http } from '../utils/request';
import type { Stock } from '../types/stock';

export const stockApi = {
  // 获取所有库存列表(带食材名称)
  list: () => http.get<Stock[]>('/api/stock/list'),

  // 获取指定食材的库存
  getByIngredient: (ingredientId: number) => 
    http.get<Stock>(`/api/stock/detail/${ingredientId}`),

  // 更新库存
  update: (ingredientId: number, quantity: number) => 
    http.post<boolean>('/api/stock/update', null, {
      params: { ingredientId, quantity }
    }),
};
