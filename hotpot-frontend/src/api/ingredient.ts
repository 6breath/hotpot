import { http } from '../utils/request';
import type { Ingredient, IngredientStockVO, UpdateStockParams, Result, PageResult } from '../types';

export const ingredientApi = {
  // 获取食材列表(包含库存信息)
  list() {
    return http.get<IngredientStockVO[]>('/api/ingredient/list');
  },

  // 分页获取食材列表
  getIngredients(params: { page: number; size: number }) {
    return http.get<PageResult<Ingredient>>('/api/ingredient', params);
  },

  // 搜索食材
  search(keyword: string) {
    return http.get<Ingredient[]>('/api/ingredient/search', {
      params: { keyword },
    });
  },

  // 获取低库存食材
  getLowStock() {
    return http.get<Ingredient[]>('/api/ingredient/low-stock');
  },

  // 获取库存概览
  getStockOverview() {
    return http.get<IngredientStockVO[]>('/api/ingredient/stock-overview');
  },

  // 更新库存
  updateStock(params: UpdateStockParams) {
    return http.post<boolean>('/api/ingredient/update-stock', null, {
      params,
    });
  },

  // 保存食材
  save(data: Ingredient) {
    return http.post<boolean>('/api/ingredient/save', data);
  },

  // 删除食材
  delete(id: number) {
    return http.delete<boolean>(`/api/ingredient/${id}`);
  },
};