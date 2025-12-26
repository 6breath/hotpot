package com.hotpot.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.hotpot.entity.*;
import com.hotpot.mapper.*;
import com.hotpot.result.Result;
import com.hotpot.service.IngredientService;
import com.hotpot.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class OrderServiceImpl extends ServiceImpl<OrderMapper, Order> implements OrderService {
    
    @Autowired
    private OrderMapper orderMapper;
    
    @Autowired
    private OrderDetailMapper orderDetailMapper;
    
    @Autowired
    private IngredientMapper ingredientMapper;
    
    @Autowired
    private StockMapper stockMapper;
    
    @Autowired
    private IngredientService ingredientService;
    
    @Override
    @Transactional
    public Result<String> createOrder(Integer userId, String tableNumber, List<OrderDetail> orderDetails) {
        try {
            // 生成订单号
            String orderNo = generateOrderNo();
            
            // 计算订单总金额
            BigDecimal totalAmount = BigDecimal.ZERO;
            for (OrderDetail detail : orderDetails) {
                totalAmount = totalAmount.add(detail.getTotalPrice());
            }
            
            // 创建订单
            Order order = new Order();
            order.setOrderNo(orderNo);
            order.setUserId(userId);
            order.setTableNumber(tableNumber);
            order.setTotalAmount(totalAmount);
            order.setStatus("COMPLETED");
            order.setCreateTime(LocalDateTime.now());
            order.setUpdateTime(LocalDateTime.now());
            
            // 保存订单
            orderMapper.insert(order);
            
            // 保存订单详情
            for (OrderDetail detail : orderDetails) {
                detail.setOrderId(order.getId());
                detail.setCreateTime(LocalDateTime.now());
                orderDetailMapper.insert(detail);
                
                // 更新库存
                Stock stock = stockMapper.selectOne(new QueryWrapper<Stock>().eq("ingredient_id", detail.getIngredientId()));
                if (stock != null) {
                    stock.setQuantity(stock.getQuantity().subtract(BigDecimal.valueOf(detail.getQuantity())));
                    stock.setUpdateTime(LocalDateTime.now());
                    stockMapper.updateById(stock);
                }
            }
            
            return Result.success("订单创建成功", orderNo);
        } catch (Exception e) {
            return Result.error("订单创建失败: " + e.getMessage());
        }
    }
    
    @Override
    public Result<List<Order>> getUserOrders(Integer userId) {
        List<Order> orders = orderMapper.selectList(new QueryWrapper<Order>().eq("user_id", userId));
        return Result.success("查询成功", orders);
    }
    
    @Override
    public Result<Order> getOrderDetail(Integer orderId) {
        Order order = orderMapper.selectById(orderId);
        if (order == null) {
            return Result.error("订单不存在");
        }
        
        // 获取订单详情
        List<OrderDetail> orderDetails = orderDetailMapper.selectList(
                new QueryWrapper<OrderDetail>().eq("order_id", orderId));
        for (OrderDetail detail : orderDetails) {
            Ingredient ingredient = ingredientMapper.selectById(detail.getIngredientId());
            if (ingredient != null) {
                detail.setIngredientName(ingredient.getName());
            }
        }
        
        // 将订单详情设置到订单对象中（如果Order类有这个字段的话）
        // 如果Order类没有orderDetails字段，我们可以通过扩展方法来处理
        
        return Result.success("查询成功", order);
    }
    
    @Override
    public Result<String> updateOrderStatus(Integer orderId, String status) {
        Order order = orderMapper.selectById(orderId);
        if (order == null) {
            return Result.error("订单不存在");
        }
        
        order.setStatus(status);
        order.setUpdateTime(LocalDateTime.now());
        orderMapper.updateById(order);
        
        return Result.success("订单状态更新成功");
    }
    
    @Override
    public Result<String> cancelOrder(Integer orderId) {
        Order order = orderMapper.selectById(orderId);
        if (order == null) {
            return Result.error("订单不存在");
        }
        
        if ("COMPLETED".equals(order.getStatus()) || "CANCELLED".equals(order.getStatus())) {
            return Result.error("订单已完成或已取消，无法取消");
        }
        
        order.setStatus("CANCELLED");
        order.setUpdateTime(LocalDateTime.now());
        orderMapper.updateById(order);
        
        // 退回库存
        List<OrderDetail> orderDetails = orderDetailMapper.selectList(
                new QueryWrapper<OrderDetail>().eq("order_id", orderId));
        for (OrderDetail detail : orderDetails) {
            Stock stock = stockMapper.selectOne(new QueryWrapper<Stock>().eq("ingredient_id", detail.getIngredientId()));
            if (stock != null) {
                stock.setQuantity(stock.getQuantity().add(BigDecimal.valueOf(detail.getQuantity())));
                stock.setUpdateTime(LocalDateTime.now());
                stockMapper.updateById(stock);
            }
        }
        
        return Result.success("订单取消成功");
    }
    
    // 添加一个获取订单详情列表的方法
    public List<OrderDetail> getOrderDetailsByOrderId(Integer orderId) {
        List<OrderDetail> orderDetails = orderDetailMapper.selectList(
                new QueryWrapper<OrderDetail>().eq("order_id", orderId));
        for (OrderDetail detail : orderDetails) {
            Ingredient ingredient = ingredientMapper.selectById(detail.getIngredientId());
            if (ingredient != null) {
                detail.setIngredientName(ingredient.getName());
            }
        }
        return orderDetails;
    }
    
    private String generateOrderNo() {
        return "ORD" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}