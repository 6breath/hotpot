// src/main/java/com/hotpot/controller/IngredientController.java
package com.hotpot.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.*;
import com.hotpot.entity.Ingredient;
import com.hotpot.entity.IngredientStockVO;
import com.hotpot.result.Result;
import com.hotpot.service.IngredientService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ingredient")
@RequiredArgsConstructor
public class IngredientController {

    private final IngredientService ingredientService;

    @GetMapping
    public Result<IPage<Ingredient>> getIngredients(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        IPage<Ingredient> pageInfo = new Page<>(page, size);
        IPage<Ingredient> result = ingredientService.page(pageInfo);
        return Result.success(result);
    }

    @GetMapping("/list")
    public Result<List<IngredientStockVO>> list() {
        List<IngredientStockVO> list = ingredientService.getStockOverview();
        return Result.success(list);
    }

    @GetMapping("/search")
    public Result<List<Ingredient>> search(@RequestParam String keyword) {
        List<Ingredient> result = ingredientService.search(keyword);
        return Result.success(result);
    }

    @GetMapping("/low-stock")
    public Result<List<Ingredient>> getLowStock() {
        List<Ingredient> result = ingredientService.getLowStockIngredients();
        return Result.success(result);
    }

    @GetMapping("/stock-overview")
    public Result<List<IngredientStockVO>> getStockOverview() {
        List<IngredientStockVO> result = ingredientService.getStockOverview();
        return Result.success(result);
    }

    @PostMapping("/update-stock")
    public Result<Boolean> updateStock(
            @RequestParam Integer ingredientId,
            @RequestParam String type,
            @RequestParam Double quantity,
            @RequestParam String operator,
            @RequestParam(required = false) String remark) {
        boolean success = ingredientService.updateStock(ingredientId, type, quantity, operator, remark);
        return success ? Result.success(true) : Result.error("操作失败");
    }

    @PostMapping("/save")
    public Result<Boolean> save(@RequestBody Ingredient ingredient) {
        boolean success = ingredientService.saveOrUpdate(ingredient);
        return success ? Result.success(true) : Result.error("保存失败");
    }

    @DeleteMapping("/{id}")
    public Result<Boolean> delete(@PathVariable Integer id) {
        boolean success = ingredientService.removeById(id);
        return success ? Result.success(true) : Result.error("删除失败");
    }
}