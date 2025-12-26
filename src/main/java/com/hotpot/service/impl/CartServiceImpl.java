package com.hotpot.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.hotpot.entity.Cart;
import com.hotpot.entity.Ingredient;
import com.hotpot.entity.Stock;
import com.hotpot.mapper.CartMapper;
import com.hotpot.mapper.IngredientMapper;
import com.hotpot.mapper.StockMapper;
import com.hotpot.result.Result;
import com.hotpot.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CartServiceImpl extends ServiceImpl<CartMapper, Cart> implements CartService {
    
    @Autowired
    private CartMapper cartMapper;
    
    @Autowired
    private IngredientMapper ingredientMapper;
    
    @Autowired
    private StockMapper stockMapper;
    
    @Override
    public Result<String> addToCart(Integer userId, Integer ingredientId, Integer quantity) {
        try {
            // 检查食材是否存在且有库存
            Ingredient ingredient = ingredientMapper.selectById(ingredientId);
            if (ingredient == null) {
                return Result.error("食材不存在");
            }
            
            Stock stock = stockMapper.selectOne(new QueryWrapper<Stock>().eq("ingredient_id", ingredientId));
            if (stock == null || stock.getQuantity().compareTo(java.math.BigDecimal.valueOf(quantity)) < 0) {
                return Result.error("库存不足");
            }
            
            // 检查购物车中是否已存在该商品
            Cart existingCart = cartMapper.selectOne(new QueryWrapper<Cart>()
                    .eq("user_id", userId)
                    .eq("ingredient_id", ingredientId));
            
            if (existingCart != null) {
                // 如果存在，则更新数量
                existingCart.setQuantity(existingCart.getQuantity() + quantity);
                existingCart.setUpdateTime(LocalDateTime.now());
                cartMapper.updateById(existingCart);
            } else {
                // 如果不存在，则新增
                Cart cart = new Cart();
                cart.setUserId(userId);
                cart.setIngredientId(ingredientId);
                cart.setQuantity(quantity);
                cart.setCreateTime(LocalDateTime.now());
                cart.setUpdateTime(LocalDateTime.now());
                cartMapper.insert(cart);
            }
            
            return Result.success("添加购物车成功");
        } catch (Exception e) {
            return Result.error("添加购物车失败: " + e.getMessage());
        }
    }
    
    @Override
    public Result<String> updateCart(Integer userId, Integer ingredientId, Integer quantity) {
        try {
            if (quantity <= 0) {
                return removeFromCart(userId, ingredientId);
            }
            
            // 检查库存
            Stock stock = stockMapper.selectOne(new QueryWrapper<Stock>().eq("ingredient_id", ingredientId));
            if (stock == null || stock.getQuantity().compareTo(java.math.BigDecimal.valueOf(quantity)) < 0) {
                return Result.error("库存不足");
            }
            
            Cart cart = cartMapper.selectOne(new QueryWrapper<Cart>()
                    .eq("user_id", userId)
                    .eq("ingredient_id", ingredientId));
            
            if (cart == null) {
                return Result.error("购物车中没有该商品");
            }
            
            cart.setQuantity(quantity);
            cart.setUpdateTime(LocalDateTime.now());
            cartMapper.updateById(cart);
            
            return Result.success("更新购物车成功");
        } catch (Exception e) {
            return Result.error("更新购物车失败: " + e.getMessage());
        }
    }
    
    @Override
    public Result<String> removeFromCart(Integer userId, Integer ingredientId) {
        try {
            cartMapper.delete(new QueryWrapper<Cart>()
                    .eq("user_id", userId)
                    .eq("ingredient_id", ingredientId));
            
            return Result.success("移除购物车成功");
        } catch (Exception e) {
            return Result.error("移除购物车失败: " + e.getMessage());
        }
    }
    
    @Override
    public Result<List<Cart>> getUserCart(Integer userId) {
        try {
            List<Cart> cartList = cartMapper.selectList(new QueryWrapper<Cart>().eq("user_id", userId));
            return Result.success("查询购物车成功", cartList);
        } catch (Exception e) {
            return Result.error("查询购物车失败: " + e.getMessage());
        }
    }
    
    @Override
    public Result<String> clearCart(Integer userId) {
        try {
            cartMapper.delete(new QueryWrapper<Cart>().eq("user_id", userId));
            return Result.success("清空购物车成功");
        } catch (Exception e) {
            return Result.error("清空购物车失败: " + e.getMessage());
        }
    }
}