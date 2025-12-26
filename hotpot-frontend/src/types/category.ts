// 分类类型定义
export interface Category {
  id?: number;
  name: string;
  parentId?: number;
  sort?: number;
  createTime?: string;
  children?: Category[];
}

export type CategoryMap = Record<number, string>;
