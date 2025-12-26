// src/main/java/com/hotpot/service/impl/IngredientServiceImpl.java
package com.hotpot.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.hotpot.entity.Ingredient;
import com.hotpot.entity.StockRecord;
import com.hotpot.entity.IngredientStockVO;
import com.hotpot.mapper.IngredientMapper;
import com.hotpot.service.IngredientService;
import com.hotpot.service.StockRecordService;
import com.hotpot.service.StockService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class IngredientServiceImpl extends ServiceImpl<IngredientMapper, Ingredient>
        implements IngredientService {

    private final StockService stockService;
    private final StockRecordService stockRecordService;
    @Autowired
    private com.hotpot.service.CategoryService categoryService;

    @Override
    public List<Ingredient> search(String keyword) {
        return baseMapper.searchWithStock(keyword);
    }

    @Override
    public List<Ingredient> getLowStockIngredients() {
        QueryWrapper<Ingredient> wrapper = new QueryWrapper<>();
        wrapper.exists("SELECT 1 FROM stock s WHERE s.ingredient_id = ingredient.id " +
                "AND s.quantity < ingredient.min_stock");
        wrapper.orderByAsc("id");
        return list(wrapper);
    }

    @Override
    public List<IngredientStockVO> getStockOverview() {
        QueryWrapper<Ingredient> wrapper = new QueryWrapper<>();
        wrapper.eq("status", 1);
        List<Ingredient> ingredients = list(wrapper);

        List<IngredientStockVO> result = new ArrayList<>();
        for (Ingredient ingredient : ingredients) {
            IngredientStockVO vo = new IngredientStockVO();
            vo.setId(ingredient.getId());
            vo.setName(ingredient.getName());
            vo.setCode(ingredient.getCode());
            vo.setCategoryId(ingredient.getCategoryId());
            // 获取分类名称
            if (ingredient.getCategoryId() != null) {
                com.hotpot.entity.Category category = categoryService.getById(ingredient.getCategoryId());
                vo.setCategoryName(category != null ? category.getName() : "未知分类");
            } else {
                vo.setCategoryName("未知分类");
            }
            
            vo.setUnit(ingredient.getUnit());
            vo.setPrice(ingredient.getPrice()); // 设置价格
            vo.setMinStock(new BigDecimal(ingredient.getMinStock()));
            vo.setMaxStock(new BigDecimal(ingredient.getMaxStock()));

            // 获取当前库存
            BigDecimal currentStock = stockService.getStockQuantity(ingredient.getId());
            vo.setCurrentStock(currentStock);

            // 计算库存状态
            if (currentStock.compareTo(new BigDecimal(ingredient.getMinStock())) < 0) {
                vo.setStockStatus("库存不足");
            } else if (currentStock.compareTo(new BigDecimal(ingredient.getMaxStock())) > 0) {
                vo.setStockStatus("库存过剩");
            } else {
                vo.setStockStatus("正常");
            }

            result.add(vo);
        }
        return result;
    }

    @Override
    @Transactional
    public boolean updateStock(Integer ingredientId, String type, Double quantity, String operator, String remark) {
        Ingredient ingredient = getById(ingredientId);
        if (ingredient == null) {
            return false;
        }

        // 更新库存
        BigDecimal changeQuantity = new BigDecimal(quantity);
        if ("OUT".equalsIgnoreCase(type)) {
            changeQuantity = changeQuantity.negate();
        }

        boolean stockUpdated = stockService.updateStock(ingredientId, changeQuantity);
        if (!stockUpdated) {
            return false;
        }

        // 记录出入库
        StockRecord record = new StockRecord();
        record.setIngredientId(ingredientId);
        record.setType(type.toUpperCase()); // 将类型转换为大写
        record.setQuantity(new BigDecimal(quantity));
        record.setUnitPrice(ingredient.getPrice());
        record.setTotalPrice(ingredient.getPrice().multiply(new BigDecimal(quantity)));
        record.setOperatorName(operator);
        // 使用用户输入的备注，如果没有则使用默认值
        record.setRemark(remark != null && !remark.trim().isEmpty() ? remark : type.toUpperCase() + "操作");
        record.setRelatedOrder("AUTO_" + System.currentTimeMillis());
        record.setRecordTime(LocalDateTime.now());

        return stockRecordService.addRecord(record);
    }
}