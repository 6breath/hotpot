package com.hotpot.entity;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class CategoryTreeDTO {
    private Integer id;
    private String name;
    private Integer parentId;
    private Integer sort;
    private LocalDateTime createTime;
    private List<CategoryTreeDTO> children;
}