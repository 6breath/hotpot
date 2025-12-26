// 用户相关类型定义
export interface User {
  id?: number;
  username: string;
  password?: string;
  name?: string;
  role?: string;
  phone?: string;
  status?: number;
  createTime?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}
