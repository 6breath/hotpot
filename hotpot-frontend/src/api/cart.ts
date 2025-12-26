import request from '@/utils/request';
import { Cart } from '@/types';

export const cartApi = {
  // 添加到购物车
  addToCart: (userId: number, ingredientId: number, quantity: number) => {
    return request.post('/api/cart/add', null, {
      params: {
        userId,
        ingredientId,
        quantity
      }
    });
  },

  // 更新购物车商品数量
  updateCart: (userId: number, ingredientId: number, quantity: number) => {
    return request.put('/api/cart/update', null, {
      params: {
        userId,
        ingredientId,
        quantity
      }
    });
  },

  // 从购物车移除商品
  removeFromCart: (userId: number, ingredientId: number) => {
    return request.delete('/api/cart/remove', {
      params: {
        userId,
        ingredientId
      }
    });
  },

  // 获取用户购物车
  getUserCart: (userId: number) => {
    return request.get<Cart[]>(`/api/cart/user/${userId}`);
  },

  // 清空购物车
  clearCart: (userId: number) => {
    return request.delete(`/api/cart/clear/${userId}`);
  }
};