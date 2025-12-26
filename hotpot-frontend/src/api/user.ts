import { http } from '../utils/request';
import type { User, LoginRequest, LoginResponse } from '../types/user';

export const userApi = {
  // 用户登录
  login: (data: LoginRequest) => {
    return http.post<LoginResponse>('/api/user/login', data);
  },

  // 用户注册
  register: (data: User) => {
    return http.post<boolean>('/api/user/register', data);
  },

  // 检查用户名是否存在
  checkUsername: (username: string) => {
    return http.get<boolean>('/api/user/check-username', { params: { username } });
  },

  // 获取用户信息
  getUserInfo: (token: string) => {
    return http.get<User>('/api/user/info', { params: { token } });
  },

  // 退出登录
  logout: () => {
    return http.post<boolean>('/api/user/logout');
  },
};
