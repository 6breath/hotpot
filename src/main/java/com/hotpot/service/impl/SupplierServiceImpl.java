// src/main/java/com/hotpot/service/impl/SupplierServiceImpl.java
package com.hotpot.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.hotpot.entity.Supplier;
import com.hotpot.mapper.SupplierMapper;
import com.hotpot.service.SupplierService;
import org.springframework.stereotype.Service;

@Service
public class SupplierServiceImpl extends ServiceImpl<SupplierMapper, Supplier>
        implements SupplierService {
}