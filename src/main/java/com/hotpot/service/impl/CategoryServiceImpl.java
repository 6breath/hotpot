// src/main/java/com/hotpot/service/impl/CategoryServiceImpl.java
package com.hotpot.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.hotpot.entity.Category;
import com.hotpot.entity.CategoryTreeDTO;
import com.hotpot.mapper.CategoryMapper;
import com.hotpot.service.CategoryService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl extends ServiceImpl<CategoryMapper, Category>
        implements CategoryService {

    @Override
    public List<CategoryTreeDTO> getTreeCategories() {
        // 获取所有分类
        List<Category> allCategories = list();

        // 将Category转换为CategoryTreeDTO
        Map<Integer, CategoryTreeDTO> categoryMap = new HashMap<>();
        for (Category category : allCategories) {
            CategoryTreeDTO dto = new CategoryTreeDTO();
            dto.setId(category.getId());
            dto.setName(category.getName());
            dto.setParentId(category.getParentId());
            dto.setSort(category.getSort());
            dto.setCreateTime(category.getCreateTime());
            categoryMap.put(dto.getId(), dto);
        }

        // 构建树形结构
        List<CategoryTreeDTO> rootCategories = new ArrayList<>();
        for (Category category : allCategories) {
            CategoryTreeDTO dto = categoryMap.get(category.getId());
            if (category.getParentId() != null && category.getParentId() > 0) {
                // 这是一个子分类，找到父分类并添加到其children列表
                CategoryTreeDTO parentDto = categoryMap.get(category.getParentId());
                if (parentDto != null) {
                    if (parentDto.getChildren() == null) {
                        parentDto.setChildren(new ArrayList<>());
                    }
                    parentDto.getChildren().add(dto);
                }
            } else {
                // 这是一个根分类
                rootCategories.add(dto);
            }
        }

        return rootCategories;
    }

    @Override
    public Map<Integer, String> getCategoryMap() {
        List<Category> categories = list();
        Map<Integer, String> map = new HashMap<>();
        for (Category category : categories) {
            map.put(category.getId(), category.getName());
        }
        return map;
    }
}