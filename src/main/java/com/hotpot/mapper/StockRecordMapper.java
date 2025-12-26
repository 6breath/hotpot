// src/main/java/com/hotpot/mapper/StockRecordMapper.java
package com.hotpot.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.hotpot.entity.StockRecord;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.time.LocalDateTime;
import java.util.List;

@Mapper
public interface StockRecordMapper extends BaseMapper<StockRecord> {

    @Select("SELECT r.*, i.name as ingredient_name " +
            "FROM stock_record r " +
            "LEFT JOIN ingredient i ON r.ingredient_id = i.id " +
            "WHERE r.ingredient_id = #{ingredientId} " +
            "ORDER BY r.record_time DESC")
    List<StockRecord> selectByIngredientId(@Param("ingredientId") Integer ingredientId);

    @Select("SELECT r.*, i.name as ingredient_name " +
            "FROM stock_record r " +
            "LEFT JOIN ingredient i ON r.ingredient_id = i.id " +
            "WHERE r.record_time BETWEEN #{startTime} AND #{endTime} " +
            "ORDER BY r.record_time DESC")
    List<StockRecord> selectByTimeRange(@Param("startTime") LocalDateTime startTime,
                                        @Param("endTime") LocalDateTime endTime);

    @Select("SELECT r.*, i.name as ingredient_name " +
            "FROM stock_record r " +
            "LEFT JOIN ingredient i ON r.ingredient_id = i.id " +
            "ORDER BY r.record_time DESC")
    List<StockRecord> selectAllWithIngredient();
}