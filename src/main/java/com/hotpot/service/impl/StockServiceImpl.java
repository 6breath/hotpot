// src/main/java/com/hotpot/service/impl/StockServiceImpl.java
package com.hotpot.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.hotpot.entity.Stock;
import com.hotpot.mapper.StockMapper;
import com.hotpot.service.StockService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class StockServiceImpl extends ServiceImpl<StockMapper, Stock>
        implements StockService {

    @Override
    public BigDecimal getStockQuantity(Integer ingredientId) {
        QueryWrapper<Stock> wrapper = new QueryWrapper<>();
        wrapper.eq("ingredient_id", ingredientId);
        Stock stock = getOne(wrapper);
        return stock != null ? stock.getQuantity() : BigDecimal.ZERO;
    }

    @Override
    @Transactional
    public boolean updateStock(Integer ingredientId, BigDecimal quantity) {
        QueryWrapper<Stock> wrapper = new QueryWrapper<>();
        wrapper.eq("ingredient_id", ingredientId);
        Stock stock = getOne(wrapper);

        if (stock == null) {
            // 新增库存记录
            stock = new Stock();
            stock.setIngredientId(ingredientId);
            stock.setQuantity(quantity);
            stock.setWarehouse("默认仓库");
            return save(stock);
        } else {
            // 更新库存数量
            BigDecimal newQuantity = stock.getQuantity().add(quantity);
            if (newQuantity.compareTo(BigDecimal.ZERO) < 0) {
                throw new RuntimeException("库存不能为负数");
            }
            stock.setQuantity(newQuantity);
            return updateById(stock);
        }
    }

    @Override
    public Stock getStockWithIngredient(Integer ingredientId) {
        return baseMapper.selectWithIngredient(ingredientId);
    }

    @Override
    public java.util.List<Stock> getAllStockWithIngredient() {
        return baseMapper.selectAllWithIngredient();
    }
}