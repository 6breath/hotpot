// src/main/java/com/hotpot/mapper/StockMapper.java
package com.hotpot.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.hotpot.entity.Stock;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.math.BigDecimal;

@Mapper
public interface StockMapper extends BaseMapper<Stock> {

    @Select("SELECT s.*, i.name as ingredient_name, i.unit " +
            "FROM stock s " +
            "LEFT JOIN ingredient i ON s.ingredient_id = i.id " +
            "WHERE s.ingredient_id = #{ingredientId}")
    Stock selectWithIngredient(@Param("ingredientId") Integer ingredientId);

    @Select("SELECT s.*, i.name as ingredient_name, i.unit " +
            "FROM stock s " +
            "LEFT JOIN ingredient i ON s.ingredient_id = i.id " +
            "ORDER BY s.update_time DESC")
    java.util.List<Stock> selectAllWithIngredient();

    @Update("UPDATE stock SET quantity = quantity + #{quantity} WHERE ingredient_id = #{ingredientId}")
    int updateQuantity(@Param("ingredientId") Integer ingredientId,
                       @Param("quantity") BigDecimal quantity);
}