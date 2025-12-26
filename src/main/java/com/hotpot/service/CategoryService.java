// src/main/java/com/hotpot/service/CategoryService.java
package com.hotpot.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.hotpot.entity.Category;
import com.hotpot.entity.CategoryTreeDTO;
import java.util.List;
import java.util.Map;

public interface CategoryService extends IService<Category> {

    List<CategoryTreeDTO> getTreeCategories();

    Map<Integer, String> getCategoryMap();
}