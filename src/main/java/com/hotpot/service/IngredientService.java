// src/main/java/com/hotpot/service/IngredientService.java
package com.hotpot.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.hotpot.entity.Ingredient;
import com.hotpot.entity.IngredientStockVO;
import java.util.List;

public interface IngredientService extends IService<Ingredient> {

    List<Ingredient> search(String keyword);

    List<Ingredient> getLowStockIngredients();

    List<IngredientStockVO> getStockOverview();

    boolean updateStock(Integer ingredientId, String type, Double quantity, String operator, String remark);
}