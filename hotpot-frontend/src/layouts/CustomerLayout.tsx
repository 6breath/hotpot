import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Typography, Row, Col, Badge, Button, Modal, Table, message } from 'antd';
import { AppstoreOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { getCartItemCount, getCartFromStorage, getCartTotalPrice, updateCartItemQuantity, removeFromCart, clearCart } from '../utils/cart';
import type { CartItem } from '../utils/cart';
import { orderApi } from '../api';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const CustomerLayout: React.FC = () => {
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 更新购物车数量
    setCartCount(getCartItemCount());
  }, [location]); // 当路由变化时更新购物车数量

  const [cartModalVisible, setCartModalVisible] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  const menuItems = [
    {
      key: 'menu',
      label: <Link to="/customer/menu">火锅菜单</Link>,
      icon: <AppstoreOutlined />,
    },
    {
      key: 'profile',
      label: <Link to="/customer/profile">个人中心</Link>,
      icon: <UserOutlined />,
    },
  ];
  
  // 更新购物车数据
  const updateCartData = () => {
    const items = getCartFromStorage();
    setCartItems(items);
    setCartCount(getCartItemCount());
  };
  
  useEffect(() => {
    // 更新购物车数据
    updateCartData();
  }, [location]); // 当路由变化时更新购物车数量
  
  // 更新购物车数量
  const updateCartQuantity = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      // 如果数量小于等于0，从购物车中移除
      removeFromCart(id);
    } else {
      updateCartItemQuantity(id, newQuantity);
    }
    updateCartData(); // 更新购物车数据
  };
  
  // 从购物车移除商品
  const removeItem = (id: number) => {
    removeFromCart(id);
    updateCartData(); // 更新购物车数据
  };
  
  // 清空购物车
  const clearCartItems = () => {
    clearCart();
    updateCartData(); // 更新购物车数据
  };
  
  // 下单
  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      message.warning('购物车为空，请先添加商品');
      return;
    }
    
    // 检查用户是否已登录
    const token = localStorage.getItem('token');
    if (!token) {
      Modal.confirm({
        title: '需要登录',
        content: '下单前需要登录，请先登录或注册。',
        okText: '去登录',
        cancelText: '取消',
        onOk: () => {
          navigate('/login');
          setCartModalVisible(false);
        }
      });
      return;
    }
    
    // 检查是否选择了锅底（categoryId为18的食材）
    const hasSoupBase = cartItems.some(item => item.ingredient.categoryId === 18);
    if (!hasSoupBase) {
      Modal.warning({
        title: '请先选择锅底',
        content: '火锅必须选择锅底才能下单，请前往菜单选择锅底。',
        okText: '去选择锅底',
        onOk: () => {
          // 跳转到菜单页面并高亮锅底分类
          navigate('/customer/menu?categoryId=18');
          setCartModalVisible(false);
        }
      });
      return;
    }
    
    await processOrder();
  };
  
  // 处理订单的实际逻辑
  const processOrder = async () => {
    setLoading(true);
    try {
      // 准备订单数据
      const userStr = localStorage.getItem('user');
      let customerName = '顾客';
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          customerName = user.name || user.username || '顾客';
        } catch (error) {
          console.error('解析用户信息失败:', error);
        }
      }
      
      const orderData = {
        items: cartItems.map(item => ({
          ingredientId: item.ingredient.id,
          quantity: Number(item.quantity) // 确保数量是数值类型
        })),
        customerName: customerName
      };
      
      // 调用后端API扣减库存
      const response = await orderApi.placeOrder(orderData);
      
      if (response.code === 200 && response.data) {
        message.success(`订单提交成功！共 ${cartItems.length} 件商品，总价 ¥${getCartTotalPrice().toFixed(2)}`);
        clearCart();
        updateCartData(); // 更新购物车数据
        setCartModalVisible(false); // 关闭弹窗
      } else {
        message.error(response.msg || '下单失败');
      }
    } catch (error) {
      console.error('下单失败:', error);
      message.error('下单失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };
  
  // 购物车表格列定义
  const cartColumns = [
    {
      title: '食材',
      dataIndex: ['ingredient', 'name'],
      key: 'name',
    },
    {
      title: '单价',
      dataIndex: ['ingredient', 'price'],
      key: 'price',
      render: (price: number) => {
        const displayPrice = typeof price === 'object' ? parseFloat(price.toString()) : Number(price);
        return `¥${displayPrice.toFixed(2)}`;
      },
    },
    {
      title: '数量',
      key: 'quantity',
      render: (text: any, record: CartItem) => (
        <div className="apple-quantity-control">
          <Button
            size="small"
            onClick={() => updateCartQuantity(record.ingredient.id, record.quantity - 1)}
            disabled={record.quantity <= 1}
            style={{ borderRadius: '8px', padding: '0 8px' }}
          >
            -
          </Button>
          <span>{record.quantity}</span>
          <Button
            size="small"
            onClick={() => {
              // 检查库存是否充足
              const currentStock = typeof record.ingredient.currentStock === 'object' 
                ? parseFloat(record.ingredient.currentStock.toString()) 
                : record.ingredient.currentStock || 0;
              if (record.quantity >= currentStock) {
                message.warning('库存不足');
                return;
              }
              updateCartQuantity(record.ingredient.id, record.quantity + 1);
            }}
            style={{ borderRadius: '8px', padding: '0 8px' }}
          >
            +
          </Button>
        </div>
      ),
    },
    {
      title: '小计',
      key: 'subtotal',
      render: (text: any, record: CartItem) => {
        const price = typeof record.ingredient.price === 'object' ? parseFloat(record.ingredient.price.toString()) : Number(record.ingredient.price);
        const subtotal = (price || 0) * record.quantity;
        return `¥${subtotal.toFixed(2)}`;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (text: any, record: CartItem) => (
        <Button
          type="link"
          size="small"
          danger
          onClick={() => removeItem(record.ingredient.id)}
        >
          删除
        </Button>
      ),
    },
  ];

  // 购物车悬浮按钮点击事件
  const handleCartClick = () => {
    updateCartData(); // 更新购物车数据
    setCartModalVisible(true);
  };

  return (
    <Layout className="customer-layout" style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <Header className="header apple-header" style={{ background: 'rgba(255, 255, 255, 0.9)', padding: 0, backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(0, 0, 0, 0.05)' }}>
        <Row justify="space-between" align="middle" style={{ padding: '0 20px' }}>
          <Col>
            <Link to="/customer/menu">
              <Title level={3} style={{ color: '#000', margin: 0, lineHeight: '64px', fontWeight: 600 }}>
                火锅点餐系统
              </Title>
            </Link>
          </Col>
          <Col>
            <Menu
              mode="horizontal"
              defaultSelectedKeys={['menu']}
              items={menuItems}
              style={{ flex: 1, minWidth: 0, background: 'transparent', borderBottom: 'none' }}
            />
          </Col>
        </Row>
      </Header>
      
      <Content style={{ padding: '24px', marginTop: 16 }}>
        <div className="customer-content apple-card" style={{ padding: 24, minHeight: 360, background: '#fff' }}>
          <Outlet />
        </div>
      </Content>
      
      {/* 悬浮购物车按钮 */}
      <div style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        zIndex: 1000,
      }}>
        <Button
          type="primary"
          shape="circle"
          size="large"
          icon={
            <div style={{ position: 'relative' }}>
              <ShoppingCartOutlined style={{ fontSize: '20px' }} />
              {cartCount > 0 && (
                <Badge
                  count={cartCount}
                  style={{
                    position: 'absolute',
                    top: -5,
                    right: -5,
                    height: 16,
                    minWidth: 16,
                    fontSize: 12,
                  }}
                />
              )}
            </div>
          }
          onClick={handleCartClick}
          style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            backgroundColor: '#fa8c16',
            borderColor: '#fa8c16',
            boxShadow: '0 6px 16px rgba(250, 140, 22, 0.3)',
            fontSize: '20px',
          }}
        />
      </div>
      
      {/* 购物车详情弹窗 */}
      <Modal
        title={`购物车 (${cartItems.length} 件商品)`}
        open={cartModalVisible}
        onCancel={() => setCartModalVisible(false)}
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Button onClick={clearCartItems} danger className="apple-button" style={{ borderRadius: '12px' }}>
                清空购物车
              </Button>
            </div>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
              总计: ¥{getCartTotalPrice().toFixed(2)}
            </div>
            <div>
              <Button 
                type="primary" 
                onClick={handlePlaceOrder}
                loading={loading}
                className="apple-button"
                style={{ borderRadius: '12px', backgroundColor: '#1890ff', borderColor: '#1890ff' }}
              >
                立即下单
              </Button>
            </div>
          </div>
        }
        width={700}
        className="apple-shadow"
      >
        <div style={{ maxHeight: 400, overflowY: 'auto' }}>
          {cartItems.length > 0 ? (
            <Table
              columns={cartColumns}
              dataSource={cartItems}
              rowKey={(record) => record.ingredient.id}
              pagination={false}
              showHeader={true}
              className="apple-card"
              style={{ borderRadius: '12px', overflow: 'hidden' }}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              购物车为空，请前往菜单页面添加商品
            </div>
          )}
        </div>
      </Modal>
      
      <Footer style={{ textAlign: 'center', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', borderTop: '1px solid rgba(0, 0, 0, 0.05)' }} className="apple-footer">
        火锅点餐系统 ©{new Date().getFullYear()} Created by HotPot Team
      </Footer>
    </Layout>
  );
};

export default CustomerLayout;