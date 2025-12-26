// 通用类型定义
export interface Result<T = any> {
  code: number;
  message: string;
  data: T;
}

export interface PageParams {
  current?: number;
  pageSize?: number;
}

export interface PageResult<T> {
  records: T[];
  total: number;
  current: number;
  size: number;
}
