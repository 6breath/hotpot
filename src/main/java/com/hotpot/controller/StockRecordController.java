// src/main/java/com/hotpot/controller/StockRecordController.java
package com.hotpot.controller;

import com.hotpot.entity.StockRecord;
import com.hotpot.result.Result;
import com.hotpot.service.StockRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stock-record")
@RequiredArgsConstructor
public class StockRecordController {

    private final StockRecordService stockRecordService;

    @GetMapping("/list")
    public Result<List<StockRecord>> list() {
        List<StockRecord> records = stockRecordService.getAllRecordsWithIngredient();
        return Result.success(records);
    }

    @GetMapping("/recent/{days}")
    public Result<List<StockRecord>> getRecentRecords(@PathVariable Integer days) {
        List<StockRecord> records = stockRecordService.getRecentRecords(days);
        return Result.success(records);
    }

    @GetMapping("/ingredient/{ingredientId}")
    public Result<List<StockRecord>> getRecordsByIngredient(@PathVariable Integer ingredientId) {
        List<StockRecord> records = stockRecordService.getRecordsByIngredient(ingredientId);
        return Result.success(records);
    }

    @PostMapping("/add")
    public Result<Boolean> addRecord(@RequestBody StockRecord record) {
        boolean success = stockRecordService.addRecord(record);
        return success ? Result.success(true) : Result.error("添加失败");
    }
}