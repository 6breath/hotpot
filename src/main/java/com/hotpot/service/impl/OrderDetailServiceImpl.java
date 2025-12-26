package com.hotpot.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.hotpot.entity.OrderDetail;
import com.hotpot.mapper.OrderDetailMapper;
import com.hotpot.service.OrderDetailService;
import org.springframework.stereotype.Service;

@Service
public class OrderDetailServiceImpl extends ServiceImpl<OrderDetailMapper, OrderDetail> implements OrderDetailService {
}