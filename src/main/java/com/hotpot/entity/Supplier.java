// src/main/java/com/hotpot/entity/Supplier.java
package com.hotpot.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("supplier")
public class Supplier {
    @TableId(type = IdType.AUTO)
    private Integer id;

    private String name;
    private String contactPerson;
    private String phone;
    private String address;
    private Integer rating;
    private Integer status;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
}