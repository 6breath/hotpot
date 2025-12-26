// src/main/java/com/hotpot/controller/SupplierController.java
package com.hotpot.controller;

import com.hotpot.entity.Supplier;
import com.hotpot.result.Result;
import com.hotpot.service.SupplierService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/supplier")
@RequiredArgsConstructor
public class SupplierController {

    private final SupplierService supplierService;

    @GetMapping("/list")
    public Result<List<Supplier>> list() {
        List<Supplier> list = supplierService.list();
        return Result.success(list);
    }

    @PostMapping("/save")
    public Result<Boolean> save(@RequestBody Supplier supplier) {
        boolean success = supplierService.saveOrUpdate(supplier);
        return success ? Result.success(true) : Result.error("保存失败");
    }

    @DeleteMapping("/{id}")
    public Result<Boolean> delete(@PathVariable Integer id) {
        boolean success = supplierService.removeById(id);
        return success ? Result.success(true) : Result.error("删除失败");
    }
}