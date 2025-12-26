import { http } from '../utils/request';
import type { Category, CategoryMap } from '../types/category';

export const categoryApi = {
  // 获取树形分类
  getTreeCategories() {
    return http.get<Category[]>('/api/category/tree');
  },

  // 获取分类映射
  getCategoryMap() {
    return http.get<CategoryMap>('/api/category/map');
  },

  // 保存分类
  save(data: Category) {
    return http.post<boolean>('/api/category/save', data);
  },
};