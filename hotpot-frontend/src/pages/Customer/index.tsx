import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { AppstoreOutlined, UserOutlined, ShoppingCartOutlined, OrderedListOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;

const CustomerLayout: React.FC = () => {
  const navigate = useNavigate();
  
  const menuItems = [
    {
      key: 'menu',
      label: '点菜',
      icon: <AppstoreOutlined />,
    },
    {
      key: 'order',
      label: '我的订单',
      icon: <OrderedListOutlined />,
    },
    {
      key: 'profile',
      label: '个人中心',
      icon: <UserOutlined />,
    },
  ];

  const handleMenuClick = (e: { key: string }) => {
    switch (e.key) {
      case 'menu':
        navigate('/customer/menu');
        break;
      case 'order':
        navigate('/customer/order');
        break;
      case 'profile':
        navigate('/customer/profile');
        break;
      default:
        break;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className="header" style={{ background: '#fff', padding: 0 }}>
        <div style={{ float: 'left', fontSize: '18px', fontWeight: 'bold', lineHeight: '64px', color: '#fff' }}>
          火锅店点餐系统
        </div>
        <div style={{ float: 'right' }}>
          <Menu
            theme="light"
            mode="horizontal"
            defaultSelectedKeys={['menu']}
            items={menuItems}
            onClick={handleMenuClick}
            style={{ lineHeight: '64px' }}
          />
        </div>
      </Header>
      <Content style={{ padding: '24px', marginTop: 64 }}>
        <Outlet />
      </Content>
    </Layout>
  );
};

export default CustomerLayout;