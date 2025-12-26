import request from '@/utils/request';
import { Order, OrderDetail } from '@/types';

export const orderApi = {
  // 创建订单
  createOrder: (userId: number, tableNumber: string, orderDetails: OrderDetail[]) => {
    return request.post('/api/order/create', orderDetails, {
      params: {
        userId,
        tableNumber
      }
    });
  },

  // 获取用户订单列表
  getUserOrders: (userId: number) => {
    return request.get<Order[]>(`/api/order/user/${userId}`);
  },

  // 获取订单详情
  getOrderDetail: (orderId: number) => {
    return request.get<Order>(`/api/order/${orderId}`);
  },

  // 获取订单详情列表
  getOrderDetails: (orderId: number) => {
    return request.get<OrderDetail[]>(`/api/order/${orderId}/details`);
  },

  // 更新订单状态
  updateOrderStatus: (orderId: number, status: string) => {
    return request.put(`/api/order/${orderId}/status`, null, {
      params: { status }
    });
  },

  // 取消订单
  cancelOrder: (orderId: number) => {
    return request.put(`/api/order/${orderId}/cancel`);
  }
};