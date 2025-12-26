// src/main/java/com/hotpot/service/StockService.java
package com.hotpot.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.hotpot.entity.Stock;
import java.math.BigDecimal;

public interface StockService extends IService<Stock> {
    
    BigDecimal getStockQuantity(Integer ingredientId);
    
    boolean updateStock(Integer ingredientId, BigDecimal quantity);
    
    Stock getStockWithIngredient(Integer ingredientId);
    
    java.util.List<Stock> getAllStockWithIngredient();
}