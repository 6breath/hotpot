// src/main/java/com/hotpot/mapper/CategoryMapper.java
package com.hotpot.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.hotpot.entity.Category;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CategoryMapper extends BaseMapper<Category> {
}