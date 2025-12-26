package com.hotpot.controller;

import com.hotpot.entity.Order;
import com.hotpot.entity.OrderDetail;
import com.hotpot.result.Result;
import com.hotpot.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order")
public class OrderController {
    
    @Autowired
    private OrderService orderService;
    
    @PostMapping("/create")
    public Result<String> createOrder(@RequestParam Integer userId, 
                                      @RequestParam String tableNumber,
                                      @RequestBody List<OrderDetail> orderDetails) {
        return orderService.createOrder(userId, tableNumber, orderDetails);
    }
    
    @GetMapping("/user/{userId}")
    public Result<List<Order>> getUserOrders(@PathVariable Integer userId) {
        return orderService.getUserOrders(userId);
    }
    
    @GetMapping("/{orderId}")
    public Result<Order> getOrderDetail(@PathVariable Integer orderId) {
        return orderService.getOrderDetail(orderId);
    }
    
    @PutMapping("/{orderId}/status")
    public Result<String> updateOrderStatus(@PathVariable Integer orderId, 
                                            @RequestParam String status) {
        return orderService.updateOrderStatus(orderId, status);
    }
    
    @PutMapping("/{orderId}/cancel")
    public Result<String> cancelOrder(@PathVariable Integer orderId) {
        return orderService.cancelOrder(orderId);
    }
    
    // 获取订单详情列表
    @GetMapping("/{orderId}/details")
    public Result<List<OrderDetail>> getOrderDetails(@PathVariable Integer orderId) {
        try {
            List<OrderDetail> details = orderService.getOrderDetailsByOrderId(orderId);
            return Result.success("查询成功", details);
        } catch (Exception e) {
            return Result.error("查询失败: " + e.getMessage());
        }
    }
}