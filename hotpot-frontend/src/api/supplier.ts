import { http } from '../utils/request';
import type { Supplier } from '../types/supplier';

export const supplierApi = {
  // 获取供应商列表
  list() {
    return http.get<Supplier[]>('/api/supplier/list');
  },

  // 保存供应商
  save(data: Supplier) {
    return http.post<boolean>('/api/supplier/save', data);
  },

  // 删除供应商
  delete(id: number) {
    return http.delete<boolean>(`/api/supplier/${id}`);
  },
};
