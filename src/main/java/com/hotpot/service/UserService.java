package com.hotpot.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.hotpot.entity.User;

public interface UserService extends IService<User> {
    
    /**
     * 用户登录
     */
    User login(String username, String password);
    
    /**
     * 用户注册
     */
    boolean register(User user);
    
    /**
     * 检查用户名是否存在
     */
    boolean checkUsernameExists(String username);
}
