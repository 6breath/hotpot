import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, message, Modal, List, Card } from 'antd';
import { orderApi } from '@/api';
import { Order, OrderDetail } from '@/types';

const CustomerOrder: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem('userId') ? parseInt(localStorage.getItem('userId')!) : 1;
      const response = await orderApi.getUserOrders(userId);
      if (response.code === 200) {
        setOrders(response.data || []);
      } else {
        message.error('获取订单列表失败');
      }
    } catch (error) {
      message.error('获取订单列表失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetail = async (orderId: number) => {
    try {
      const response = await orderApi.getOrderDetails(orderId);
      if (response.code === 200) {
        setOrderDetails(response.data || []);
      } else {
        message.error('获取订单详情失败');
      }
    } catch (error) {
      message.error('获取订单详情失败');
    }
  };

  const showDetailModal = async (order: Order) => {
    setSelectedOrder(order);
    await fetchOrderDetail(order.id);
    setDetailModalVisible(true);
  };

  const getStatusTagColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'orange';
      case 'CONFIRMED':
        return 'blue';
      case 'PREPARING':
        return 'cyan';
      case 'SERVED':
        return 'purple';
      case 'COMPLETED':
        return 'green';
      case 'CANCELLED':
        return 'red';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
    },
    {
      title: '桌号',
      dataIndex: 'tableNumber',
      key: 'tableNumber',
    },
    {
      title: '订单金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => `¥${amount.toFixed(2)}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusTagColor(status)}>
          {status === 'PENDING' && '待支付'}
          {status === 'CONFIRMED' && '已确认'}
          {status === 'PREPARING' && '制作中'}
          {status === 'SERVED' && '已上菜'}
          {status === 'COMPLETED' && '已支付'}
          {status === 'CANCELLED' && '已取消'}
          {status !== 'PENDING' && status !== 'CONFIRMED' && status !== 'PREPARING' && status !== 'SERVED' && status !== 'COMPLETED' && status !== 'CANCELLED' && status}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Order) => (
        <Button type="link" onClick={() => showDetailModal(record)} className="apple-button" style={{ padding: '0 8px' }}>
          查看详情
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px', background: '#f8f9fa', minHeight: '100%' }} className="apple-card">
      <h2 style={{ fontWeight: 600, color: '#333', marginBottom: '24px' }}>我的订单</h2>
      
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="id"
        loading={loading}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
        className="apple-card"
        style={{ borderRadius: '12px', overflow: 'hidden' }}
      />

      <Modal
        title={`订单详情 - ${selectedOrder?.orderNo}`}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={600}
        className="apple-shadow"
      >
        {selectedOrder && (
          <Card className="apple-card" style={{ borderRadius: '12px' }}>
            <div style={{ marginBottom: '16px' }}>
              <p><strong>订单号：</strong>{selectedOrder.orderNo}</p>
              <p><strong>桌号：</strong>{selectedOrder.tableNumber || '未指定'}</p>
              <p><strong>订单金额：</strong>¥{selectedOrder.totalAmount.toFixed(2)}</p>
              <p><strong>状态：</strong>
                <Tag color={getStatusTagColor(selectedOrder.status)}>
                  {selectedOrder.status === 'PENDING' && '待支付'}
                  {selectedOrder.status === 'CONFIRMED' && '已确认'}
                  {selectedOrder.status === 'PREPARING' && '制作中'}
                  {selectedOrder.status === 'SERVED' && '已上菜'}
                  {selectedOrder.status === 'COMPLETED' && '已支付'}
                  {selectedOrder.status === 'CANCELLED' && '已取消'}
                </Tag>
              </p>
              <p><strong>创建时间：</strong>{new Date(selectedOrder.createTime).toLocaleString()}</p>
            </div>
            
            <h3 style={{ fontWeight: 600, color: '#333', marginBottom: '16px' }}>订单明细</h3>
            <List
              dataSource={orderDetails}
              renderItem={(detail) => (
                <List.Item className="apple-cart-item" style={{ borderRadius: '12px', marginBottom: '8px' }}>
                  <List.Item.Meta
                    title={detail.ingredientName}
                    description={`数量: ${detail.quantity}, 单价: ¥${detail.unitPrice.toFixed(2)}, 小计: ¥${detail.totalPrice.toFixed(2)}`}
                  />
                </List.Item>
              )}
            />
          </Card>
        )}
      </Modal>
    </div>
  );
};

export default CustomerOrder;