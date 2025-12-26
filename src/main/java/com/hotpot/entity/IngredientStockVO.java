// src/main/java/com/hotpot/entity/vo/IngredientStockVO.java
package com.hotpot.entity;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class IngredientStockVO {
    private Integer id;
    private String name;
    private String code;
    private Integer categoryId;
    private String categoryName;
    private String unit;
    private BigDecimal price;  // 添加价格字段
    private BigDecimal currentStock;
    private BigDecimal minStock;
    private BigDecimal maxStock;
    private String stockStatus; // 正常/不足/过剩
}