// src/main/java/com/hotpot/entity/Ingredient.java
package com.hotpot.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("ingredient")
public class Ingredient {
    @TableId(type = IdType.AUTO)
    private Integer id;

    private String name;
    private String code;
    private Integer categoryId;
    private String unit;
    private BigDecimal price;
    private Integer minStock;
    private Integer maxStock;
    private Integer supplierId;
    private String description;
    private String imageUrl;
    private Integer status;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    // 关联字段（不映射到数据库）
    @TableField(exist = false)
    private String categoryName;

    @TableField(exist = false)
    private Integer currentStock;

    @TableField(exist = false)
    private String stockStatus;
}