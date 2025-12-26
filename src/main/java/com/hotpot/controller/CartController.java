package com.hotpot.controller;

import com.hotpot.entity.Cart;
import com.hotpot.result.Result;
import com.hotpot.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    
    @Autowired
    private CartService cartService;
    
    @PostMapping("/add")
    public Result<String> addToCart(@RequestParam Integer userId,
                                    @RequestParam Integer ingredientId,
                                    @RequestParam Integer quantity) {
        return cartService.addToCart(userId, ingredientId, quantity);
    }
    
    @PutMapping("/update")
    public Result<String> updateCart(@RequestParam Integer userId,
                                     @RequestParam Integer ingredientId,
                                     @RequestParam Integer quantity) {
        return cartService.updateCart(userId, ingredientId, quantity);
    }
    
    @DeleteMapping("/remove")
    public Result<String> removeFromCart(@RequestParam Integer userId,
                                         @RequestParam Integer ingredientId) {
        return cartService.removeFromCart(userId, ingredientId);
    }
    
    @GetMapping("/user/{userId}")
    public Result<List<Cart>> getUserCart(@PathVariable Integer userId) {
        return cartService.getUserCart(userId);
    }
    
    @DeleteMapping("/clear/{userId}")
    public Result<String> clearCart(@PathVariable Integer userId) {
        return cartService.clearCart(userId);
    }
}