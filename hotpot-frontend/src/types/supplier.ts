// 供应商类型定义
export interface Supplier {
  id?: number;
  name: string;
  contactPerson?: string;  // 改为contactPerson与后端一致
  phone?: string;
  address?: string;
  rating?: number;  // 添加评级字段
  status: number;
  createTime?: string;
}
