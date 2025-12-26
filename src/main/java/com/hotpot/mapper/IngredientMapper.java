// src/main/java/com/hotpot/mapper/IngredientMapper.java
package com.hotpot.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.hotpot.entity.Ingredient;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface IngredientMapper extends BaseMapper<Ingredient> {

    @Select("SELECT i.*, c.name as category_name, s.quantity as current_stock " +
            "FROM ingredient i " +
            "LEFT JOIN category c ON i.category_id = c.id " +
            "LEFT JOIN stock s ON i.id = s.ingredient_id " +
            "WHERE i.name LIKE CONCAT('%', #{keyword}, '%') OR i.code LIKE CONCAT('%', #{keyword}, '%')")
    List<Ingredient> searchWithStock(@Param("keyword") String keyword);

    @Select("SELECT * FROM ingredient WHERE category_id = #{categoryId}")
    List<Ingredient> findByCategoryId(@Param("categoryId") Integer categoryId);
}