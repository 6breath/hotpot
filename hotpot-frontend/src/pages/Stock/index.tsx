import React, { useEffect, useState } from 'react';
import { Table, Button, Card, Statistic, Row, Col, Tag, Modal, Form, InputNumber, Input, Select, message } from 'antd';
import { WarningOutlined, InboxOutlined, RiseOutlined } from '@ant-design/icons';
import { ingredientApi } from '../../api/ingredient';
import { stockApi } from '../../api/stock';

import type { Stock } from '../../types/stock';
import type { ColumnsType } from 'antd/es/table';

const StockPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<Stock[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<Stock | null>(null);
  const [form] = Form.useForm();

  // 统计数据
  const [stats, setStats] = useState({
    total: 0,
    totalQuantity: 0,
    warehouseCount: 0,
  });

  // 加载库存数据
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await stockApi.list();
      
      // 确保res.data是数组
      const data = Array.isArray(res.data) ? res.data : [];
      setDataSource(data);
      
      // 计算统计数据
      const total = data.length;
      const totalQuantity = data.reduce((sum, item) => sum + (item.quantity || 0), 0);
      const warehouses = new Set(data.map(item => item.warehouse));
      
      setStats({ total, totalQuantity, warehouseCount: warehouses.size });
    } catch (error) {
      message.error('加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 库存调整
  const handleAdjust = (record: Stock) => {
    setCurrentRecord(record);
    form.resetFields();
    setModalVisible(true);
  };

  // 保存调整
  const handleSave = async () => {
    if (!currentRecord) return;
    
    try {
      const values = await form.validateFields();
      await ingredientApi.updateStock({
        ingredientId: currentRecord.ingredientId,
        type: values.type,
        quantity: values.quantity,
        operator: values.operator,
        remark: values.remark,
      });
      message.success('库存调整成功');
      setModalVisible(false);
      loadData();
    } catch (error) {
      message.error('库存调整失败');
    }
  };

  const columns: ColumnsType<Stock> = [
    {
      title: '食材名称',
      dataIndex: 'ingredientName',
      key: 'ingredientName',
    },
    {
      title: '仓库位置',
      dataIndex: 'warehouse',
      key: 'warehouse',
      render: (warehouse: string) => (
        <Tag color="blue">{warehouse}</Tag>
      ),
    },
    {
      title: '当前库存',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity: number, record) => (
        <span style={{ fontSize: 16, fontWeight: 'bold' }}>
          {quantity?.toFixed(2) || 0} {record.unit}
        </span>
      ),
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button type="primary" size="small" onClick={() => handleAdjust(record)}>
          库存调整
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="库存记录总数"
              value={stats.total}
              prefix={<InboxOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="总库存量"
              value={stats.totalQuantity.toFixed(2)}
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="仓库数量"
              value={stats.warehouseCount}
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

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
        title={`库存调整 - ${currentRecord?.ingredientName}`}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        okText="确认调整"
        cancelText="取消"
      >
        <div style={{ marginBottom: 16, padding: 12, background: '#f5f5f5', borderRadius: 4 }}>
          <div>食材: <strong>{currentRecord?.ingredientName}</strong></div>
          <div>仓库: <strong>{currentRecord?.warehouse}</strong></div>
          <div>当前库存: <strong>{currentRecord?.quantity?.toFixed(2) || 0} {currentRecord?.unit}</strong></div>
        </div>
        <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
          <Form.Item
            label="调整类型"
            name="type"
            rules={[{ required: true, message: '请选择调整类型' }]}
          >
            <Select placeholder="请选择">
              <Select.Option value="in">入库(增加)</Select.Option>
              <Select.Option value="out">出库(减少)</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="调整数量"
            name="quantity"
            rules={[{ required: true, message: '请输入调整数量' }]}
          >
            <InputNumber
              min={0}
              precision={2}
              style={{ width: '100%' }}
              placeholder={`单位: ${currentRecord?.unit}`}
            />
          </Form.Item>
          <Form.Item
            label="操作人"
            name="operator"
            rules={[{ required: true, message: '请输入操作人' }]}
          >
            <Input placeholder="请输入操作人姓名" />
          </Form.Item>
          <Form.Item
            label="原因/备注"
            name="remark"
          >
            <Input.TextArea rows={3} placeholder="请输入原因或备注信息" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StockPage;
