// src/main/java/com/hotpot/controller/CategoryController.java
package com.hotpot.controller;

import com.hotpot.entity.Category;
import com.hotpot.entity.CategoryTreeDTO;
import com.hotpot.result.Result;
import com.hotpot.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/category")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping("/tree")
    public Result<List<CategoryTreeDTO>> getTreeCategories() {
        List<CategoryTreeDTO> categories = categoryService.getTreeCategories();
        return Result.success(categories);
    }

    @GetMapping("/map")
    public Result<Map<Integer, String>> getCategoryMap() {
        Map<Integer, String> map = categoryService.getCategoryMap();
        return Result.success(map);
    }

    @PostMapping("/save")
    public Result<Boolean> save(@RequestBody Category category) {
        boolean success = categoryService.saveOrUpdate(category);
        return success ? Result.success(true) : Result.error("保存失败");
    }
}