package com.hotpot.controller;

import com.hotpot.result.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.sql.SQLException;

@RestController
@RequestMapping("/api/database")
public class DatabaseInitController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostMapping("/init")
    public Result<String> initDatabase() {
        try {
            // 创建购物车表
            String createCartTableSQL = """
                CREATE TABLE IF NOT EXISTS cart (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    user_id INT NOT NULL COMMENT '用户ID',
                    ingredient_id INT NOT NULL COMMENT '食材ID',
                    quantity INT NOT NULL DEFAULT 1 COMMENT '数量',
                    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
                    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    UNIQUE KEY uk_user_ingredient (user_id, ingredient_id),
                    INDEX idx_user_id (user_id)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='购物车表';
                """;

            jdbcTemplate.execute(createCartTableSQL);

            return Result.success("数据库初始化成功，已创建缺失的表");
        } catch (Exception e) {
            return Result.error("数据库初始化失败: " + e.getMessage());
        }
    }
}