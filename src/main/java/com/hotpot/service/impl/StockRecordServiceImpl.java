// src/main/java/com/hotpot/service/impl/StockRecordServiceImpl.java
package com.hotpot.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.hotpot.entity.StockRecord;
import com.hotpot.mapper.StockRecordMapper;
import com.hotpot.service.StockRecordService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class StockRecordServiceImpl extends ServiceImpl<StockRecordMapper, StockRecord>
        implements StockRecordService {

    @Override
    public List<StockRecord> getRecentRecords(Integer days) {
        LocalDateTime endTime = LocalDateTime.now();
        LocalDateTime startTime = endTime.minusDays(days);
        return baseMapper.selectByTimeRange(startTime, endTime);
    }

    @Override
    public List<StockRecord> getRecordsByIngredient(Integer ingredientId) {
        return baseMapper.selectByIngredientId(ingredientId);
    }

    @Override
    public boolean addRecord(StockRecord record) {
        return save(record);
    }

    @Override
    public List<StockRecord> getAllRecordsWithIngredient() {
        return baseMapper.selectAllWithIngredient();
    }
}