package com.hotpot.controller;

import com.hotpot.entity.User;
import com.hotpot.result.Result;
import com.hotpot.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/login")
    public Result<Map<String, Object>> login(@RequestBody Map<String, String> loginData) {
        String username = loginData.get("username");
        String password = loginData.get("password");
        
        if (username == null || username.isEmpty() || password == null || password.isEmpty()) {
            return Result.error("用户名和密码不能为空");
        }
        
        User user = userService.login(username, password);
        if (user != null) {
            Map<String, Object> data = new HashMap<>();
            // 不返回密码
            user.setPassword(null);
            data.put("user", user);
            data.put("token", "mock-token-" + user.getId()); // 简单的token,实际项目中应该使用JWT
            return Result.success(data);
        } else {
            return Result.error("用户名或密码错误");
        }
    }

    @PostMapping("/register")
    public Result<Boolean> register(@RequestBody User user) {
        if (user.getUsername() == null || user.getUsername().isEmpty()) {
            return Result.error("用户名不能为空");
        }
        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            return Result.error("密码不能为空");
        }
        
        boolean success = userService.register(user);
        if (success) {
            return Result.success(true);
        } else {
            return Result.error("用户名已存在");
        }
    }

    @GetMapping("/check-username")
    public Result<Boolean> checkUsername(@RequestParam String username) {
        boolean exists = userService.checkUsernameExists(username);
        return Result.success(exists);
    }

    @GetMapping("/info")
    public Result<User> getUserInfo(@RequestParam String token) {
        // 简单实现,实际项目中应该从token解析用户ID
        String userId = token.replace("mock-token-", "");
        User user = userService.getById(userId);
        if (user != null) {
            user.setPassword(null);
            return Result.success(user);
        }
        return Result.error("用户不存在");
    }

    @PostMapping("/logout")
    public Result<Boolean> logout() {
        // 简单实现,实际项目中应该清除token
        return Result.success(true);
    }
}
