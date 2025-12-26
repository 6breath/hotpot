// src/main/java/com/hotpot/controller/StockController.java
package com.hotpot.controller;

import com.hotpot.entity.Stock;
import com.hotpot.result.Result;
import com.hotpot.service.StockService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/stock")
@RequiredArgsConstructor
public class StockController {

    private final StockService stockService;

    @GetMapping("/list")
    public Result<List<Stock>> list() {
        List<Stock> list = stockService.getAllStockWithIngredient();
        return Result.success(list);
    }

    @GetMapping("/quantity/{ingredientId}")
    public Result<BigDecimal> getQuantity(@PathVariable Integer ingredientId) {
        BigDecimal quantity = stockService.getStockQuantity(ingredientId);
        return Result.success(quantity);
    }

    @GetMapping("/detail/{ingredientId}")
    public Result<Stock> getStockDetail(@PathVariable Integer ingredientId) {
        Stock stock = stockService.getStockWithIngredient(ingredientId);
        return Result.success(stock);
    }

    @PostMapping("/update")
    public Result<Boolean> updateStock(
            @RequestParam Integer ingredientId,
            @RequestParam BigDecimal quantity) {
        boolean success = stockService.updateStock(ingredientId, quantity);
        return success ? Result.success(true) : Result.error("更新失败");
    }
}