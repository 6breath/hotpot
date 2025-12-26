package com.hotpot.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("`order`")  // 使用反引号转义保留字
public class Order {
    @TableId(type = IdType.AUTO)
    private Integer id;
    
    private String orderNo;
    
    private Integer userId;
    
    private String tableNumber;
    
    private BigDecimal totalAmount;
    
    private String status;
    
    private LocalDateTime createTime;
    
    private LocalDateTime updateTime;
}