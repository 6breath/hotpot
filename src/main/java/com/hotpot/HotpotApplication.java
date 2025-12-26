package com.hotpot;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.hotpot.mapper")
public class HotpotApplication {

    public static void main(String[] args) {
        SpringApplication.run(HotpotApplication.class, args);
    }

}