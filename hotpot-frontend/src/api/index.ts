import { http } from '../utils/request';

export * from './user';
export * from './ingredient';
export * from './category';
export * from './stock';
export * from './stockRecord';
export * from './supplier';
export * from './order';
export * from './cart';

// 数据库初始化API
export const databaseApi = {
  init: () => {
    return http.post('/api/database/init');
  }
};