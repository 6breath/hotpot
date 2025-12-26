package com.hotpot.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.hotpot.entity.Order;
import com.hotpot.entity.OrderDetail;
import com.hotpot.result.Result;

import java.util.List;

public interface OrderService extends IService<Order> {
    Result<String> createOrder(Integer userId, String tableNumber, List<OrderDetail> orderDetails);
    
    Result<List<Order>> getUserOrders(Integer userId);
    
    Result<Order> getOrderDetail(Integer orderId);
    
    Result<String> updateOrderStatus(Integer orderId, String status);
    
    Result<String> cancelOrder(Integer orderId);
    
    // 获取订单详情列表
    List<OrderDetail> getOrderDetailsByOrderId(Integer orderId);
}