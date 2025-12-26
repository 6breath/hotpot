// src/main/java/com/hotpot/entity/Stock.java
package com.hotpot.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("stock")
public class Stock {
    @TableId(type = IdType.AUTO)
    private Integer id;

    private Integer ingredientId;
    private BigDecimal quantity;
    private String warehouse;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    // 关联字段
    @TableField(exist = false)
    private String ingredientName;
    @TableField(exist = false)
    private String unit;
}