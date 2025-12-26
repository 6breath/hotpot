import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Input, Modal, Form, InputNumber, Select, message, Popconfirm, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { ingredientApi } from '../../api/ingredient';
import { categoryApi } from '../../api/category';
import { supplierApi } from '../../api/supplier';
import type { Ingredient } from '../../types/ingredient';
import type { CategoryMap } from '../../types/category';
import type { Supplier } from '../../types/supplier';
import type { ColumnsType } from 'antd/es/table';

const IngredientPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<Ingredient[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Ingredient | null>(null);
  const [categoryMap, setCategoryMap] = useState<CategoryMap>({});
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [form] = Form.useForm();

  // 加载数据
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await ingredientApi.list();
      setDataSource(res.data);
    } catch (error) {
      message.error('加载失败');
    } finally {
      setLoading(false);
    }
  };

  // 加载分类映射
  const loadCategoryMap = async () => {
    try {
      const res = await categoryApi.getCategoryMap();
      setCategoryMap(res.data);
    } catch (error) {
      console.error('加载分类失败');
    }
  };

  // 加载供应商列表
  const loadSuppliers = async () => {
    try {
      const res = await supplierApi.list();
      // 确保返回的是数组
      setSuppliers(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('加载供应商失败', error);
      setSuppliers([]);
    }
  };

  useEffect(() => {
    loadData();
    loadCategoryMap();
    loadSuppliers();
  }, []);

  // 搜索
  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      loadData();
      return;
    }
    setLoading(true);
    try {
      // 搜索功能需要专门的搜索接口，但我们需要获取包含库存的搜索结果
      const res = await ingredientApi.search(searchKeyword);
      
      // 获取所有库存概览数据以补充库存信息
      const overviewRes = await ingredientApi.list(); // 现在list接口返回包含库存信息的数据
      const overviewMap = new Map();
      overviewRes.data.forEach(item => {
        overviewMap.set(item.id, item);
      });
      
      const convertedData = res.data.map(item => {
        const overview = overviewMap.get(item.id);
        // 如果找到库存信息，使用库存概览数据；否则使用基本食材数据
        if (overview) {
          return {
            ...overview,
            code: item.code || overview.code || '', // 保留搜索结果中的code
          };
        } else {
          // 如果没找到库存信息，使用基本食材数据并补充默认值
          return {
            ...item,
            currentStock: 0,
            minStock: typeof item.minStock !== 'number' ? 0 : item.minStock,
            maxStock: typeof item.maxStock !== 'number' ? 0 : item.maxStock,
            stockStatus: '未知',
            unit: item.unit || '',
            categoryName: item.categoryName || categoryMap[item.categoryId] || '-',
          };
        }
      });
      setDataSource(convertedData);
    } catch (error) {
      message.error('搜索失败');
    } finally {
      setLoading(false);
    }
  };

  // 新增
  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 编辑
  const handleEdit = (record: Ingredient) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  // 删除
  const handleDelete = async (id: number) => {
    try {
      await ingredientApi.delete(id);
      message.success('删除成功');
      loadData();
    } catch (error) {
      message.error('删除失败');
    }
  };

  // 保存
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const data = editingRecord ? { ...editingRecord, ...values } : values;
      await ingredientApi.save(data);
      message.success('保存成功');
      setModalVisible(false);
      loadData();
    } catch (error) {
      message.error('保存失败');
    }
  };

  // 获取库存状态标签
  const getStockStatusTag = (record: any) => {
    const current = (typeof record.currentStock === 'object' && record.currentStock !== null 
      ? parseFloat(record.currentStock.toString()) 
      : record.currentStock) || 0;
    const minStock = (typeof record.minStock === 'object' && record.minStock !== null 
      ? parseFloat(record.minStock.toString()) 
      : record.minStock) || 0;
    
    if (current === 0) {
      return <Tag color="error">缺货</Tag>;
    } else if (current < minStock) {
      return <Tag color="warning">低库存</Tag>;
    } else if (current > (typeof record.maxStock === 'object' && record.maxStock !== null 
      ? parseFloat(record.maxStock.toString()) 
      : record.maxStock)) {
      return <Tag color="processing">超储</Tag>;
    }
    return <Tag color="success">正常</Tag>;
  };

  const columns: ColumnsType<any> = [
    {
      title: '编号',
      dataIndex: 'code',
      key: 'code',
      width: 120,
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '分类',
      dataIndex: 'categoryName',
      key: 'categoryName',
      width: 120,
      render: (categoryName: string) => categoryName || '-',
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
      width: 80,
    },
    {
      title: '单价(¥)',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      render: (price: number) => (price ? price.toFixed(2) : '0.00'),
    },
    {
      title: '当前库存',
      dataIndex: 'currentStock',
      key: 'currentStock',
      width: 100,
      render: (currentStock: number | object) => {
        return typeof currentStock === 'object' && currentStock !== null 
          ? parseFloat(currentStock.toString()).toFixed(2)
          : (currentStock || 0).toFixed(2);
      },
    },
    {
      title: '库存范围',
      key: 'stockRange',
      width: 120,
      render: (_, record) => {
        const minStock = typeof record.minStock === 'object' && record.minStock !== null 
          ? parseFloat(record.minStock.toString()) 
          : record.minStock;
        const maxStock = typeof record.maxStock === 'object' && record.maxStock !== null 
          ? parseFloat(record.maxStock.toString()) 
          : record.maxStock;
        return `${minStock || 0} - ${maxStock || 0}`;
      },
    },
    {
      title: '库存状态',
      key: 'stockStatus',
      width: 100,
      render: (_, record) => getStockStatusTag(record),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: number) => (
        <Tag color={status === 1 ? 'success' : 'default'}>
          {status === 1 ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除?"
            onConfirm={() => handleDelete(record.id!)}
            okText="确认"
            cancelText="取消"
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Space>
          <Input
            placeholder="搜索食材名称或编号"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onPressEnter={handleSearch}
            style={{ width: 250 }}
            prefix={<SearchOutlined />}
          />
          <Button type="primary" onClick={handleSearch}>
            搜索
          </Button>
          <Button onClick={() => { setSearchKeyword(''); loadData(); }}>
            重置
          </Button>
        </Space>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增食材
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        rowKey="id"
        scroll={{ x: 1200 }}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
      />

      <Modal
        title={editingRecord ? '编辑食材' : '新增食材'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        width={600}
        okText="保存"
        cancelText="取消"
      >
        <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
          <Form.Item
            label="食材编号"
            name="code"
            rules={[{ required: true, message: '请输入食材编号' }]}
          >
            <Input placeholder="请输入食材编号" />
          </Form.Item>
          <Form.Item
            label="食材名称"
            name="name"
            rules={[{ required: true, message: '请输入食材名称' }]}
          >
            <Input placeholder="请输入食材名称" />
          </Form.Item>
          <Form.Item
            label="分类"
            name="categoryId"
            rules={[{ required: true, message: '请选择分类' }]}
          >
            <Select placeholder="请选择分类">
              {Object.entries(categoryMap).map(([id, name]) => (
                <Select.Option key={id} value={Number(id)}>
                  {name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="单位"
            name="unit"
            rules={[{ required: true, message: '请输入单位' }]}
          >
            <Input placeholder="如: kg、个、袋" />
          </Form.Item>
          <Form.Item
            label="单价"
            name="price"
            rules={[{ required: true, message: '请输入单价' }]}
          >
            <InputNumber
              min={0}
              precision={2}
              style={{ width: '100%' }}
              placeholder="请输入单价"
            />
          </Form.Item>
          <Form.Item
            label="最小库存"
            name="minStock"
            rules={[{ required: true, message: '请输入最小库存' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} placeholder="库存预警下限" />
          </Form.Item>
          <Form.Item
            label="最大库存"
            name="maxStock"
            rules={[{ required: true, message: '请输入最大库存' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} placeholder="库存预警上限" />
          </Form.Item>
          <Form.Item label="供应商" name="supplierId">
            <Select placeholder="请选择供应商" allowClear>
              {suppliers.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="状态" name="status" initialValue={1}>
            <Select>
              <Select.Option value={1}>启用</Select.Option>
              <Select.Option value={0}>禁用</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="备注" name="description">
            <Input.TextArea rows={3} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default IngredientPage;
