package com.hotpot.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.hotpot.entity.Cart;
import com.hotpot.result.Result;

import java.util.List;

public interface CartService extends IService<Cart> {
    Result<String> addToCart(Integer userId, Integer ingredientId, Integer quantity);
    
    Result<String> updateCart(Integer userId, Integer ingredientId, Integer quantity);
    
    Result<String> removeFromCart(Integer userId, Integer ingredientId);
    
    Result<List<Cart>> getUserCart(Integer userId);
    
    Result<String> clearCart(Integer userId);
}