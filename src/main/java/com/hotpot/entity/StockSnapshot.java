// src/main/java/com/hotpot/entity/StockSnapshot.java
package com.hotpot.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@TableName("stock_snapshot")
public class StockSnapshot {
    @TableId(type = IdType.AUTO)
    private Integer id;

    private LocalDate snapshotDate;
    private Integer ingredientId;
    private BigDecimal stockQuantity;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
}