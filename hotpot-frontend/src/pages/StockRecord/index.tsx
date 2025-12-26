import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, message, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { stockRecordApi } from '../../api/stockRecord';
import { ingredientApi } from '../../api/ingredient';
import type { StockRecord } from '../../types/stockRecord';
import type { Ingredient } from '../../types/ingredient';
import type { ColumnsType } from 'antd/es/table';

const StockRecordPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<StockRecord[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [form] = Form.useForm();

  // 加载记录
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await stockRecordApi.list();
      console.log('出入库记录数据:', res);
      setDataSource(res.data);
    } catch (error) {
      console.error('加载失败:', error);
      message.error('加载失败');
    } finally {
      setLoading(false);
    }
  };

  // 加载食材列表
  const loadIngredients = async () => {
    try {
      const res = await ingredientApi.list();
      setIngredients(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('加载食材失败');
      setIngredients([]);
    }
  };

  useEffect(() => {
    loadData();
    loadIngredients();
  }, []);

  // 新增记录
  const handleAdd = () => {
    form.resetFields();
    setModalVisible(true);
  };

  // 保存
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      await stockRecordApi.add(values);
      message.success('添加成功');
      setModalVisible(false);
      loadData();
    } catch (error) {
      message.error('添加失败');
    }
  };

  const columns: ColumnsType<StockRecord> = [
    {
      title: '食材名称',
      dataIndex: 'ingredientName',
      key: 'ingredientName',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type?.toUpperCase() === 'IN' ? 'success' : 'error'}>
          {type?.toUpperCase() === 'IN' ? '入库' : '出库'}
        </Tag>
      ),
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity: number, record) => (
        <span style={{ color: record.type?.toUpperCase() === 'IN' ? '#52c41a' : '#ff4d4f' }}>
          {record.type?.toUpperCase() === 'IN' ? '+' : '-'}{quantity}
        </span>
      ),
    },
    {
      title: '操作人',
      dataIndex: 'operatorName',
      key: 'operatorName',
    },
    {
      title: '原因/备注',
      dataIndex: 'remark',
      key: 'remark',
      ellipsis: true,
    },
    {
      title: '操作时间',
      dataIndex: 'recordTime',
      key: 'recordTime',
      width: 180,
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增记录
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        rowKey="id"
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
      />

      <Modal
        title="新增出入库记录"
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        okText="保存"
        cancelText="取消"
      >
        <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
          <Form.Item
            label="食材"
            name="ingredientId"
            rules={[{ required: true, message: '请选择食材' }]}
          >
            <Select
              placeholder="请选择食材"
              showSearch
              filterOption={(input, option) =>
                (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {ingredients.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="类型"
            name="type"
            rules={[{ required: true, message: '请选择类型' }]}
          >
            <Select placeholder="请选择类型">
              <Select.Option value="IN">入库</Select.Option>
              <Select.Option value="OUT">出库</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="数量"
            name="quantity"
            rules={[{ required: true, message: '请输入数量' }]}
          >
            <InputNumber
              min={0}
              precision={2}
              style={{ width: '100%' }}
              placeholder="请输入数量"
            />
          </Form.Item>
          <Form.Item
            label="操作人"
            name="operatorName"
            rules={[{ required: true, message: '请输入操作人' }]}
          >
            <Input placeholder="请输入操作人" />
          </Form.Item>
          <Form.Item label="原因/备注" name="remark">
            <Input.TextArea rows={3} placeholder="请输入原因或备注信息" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StockRecordPage;
