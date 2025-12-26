// src/main/java/com/hotpot/service/StockRecordService.java
package com.hotpot.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.hotpot.entity.StockRecord;
import java.time.LocalDateTime;
import java.util.List;

public interface StockRecordService extends IService<StockRecord> {
    
    List<StockRecord> getRecentRecords(Integer days);
    
    List<StockRecord> getRecordsByIngredient(Integer ingredientId);
    
    boolean addRecord(StockRecord record);
    
    List<StockRecord> getAllRecordsWithIngredient();
}