// src/main/java/com/hotpot/mapper/UserMapper.java
package com.hotpot.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.hotpot.entity.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper extends BaseMapper<User> {
}