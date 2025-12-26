// src/main/java/com/hotpot/entity/StockRecord.java
package com.hotpot.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("stock_record")
public class StockRecord {
    @TableId(type = IdType.AUTO)
    private Integer id;

    private Integer ingredientId;
    private String type; // IN/OUT
    private BigDecimal quantity;
    private BigDecimal unitPrice;
    private BigDecimal totalPrice;
    private Integer operatorId;
    private String operatorName;
    private String remark;
    private String relatedOrder;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime recordTime;

    // 关联字段
    @TableField(exist = false)
    private String ingredientName;
}