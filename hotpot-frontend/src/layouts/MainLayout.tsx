import React, { useState } from 'react';
import { Layout, Menu, Dropdown, Avatar, message } from 'antd';
import type { MenuProps } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  ShoppingOutlined,
  InboxOutlined,
  HistoryOutlined,
  TeamOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { userApi } from '../api/user';
import type { User } from '../types/user';

const { Header, Content, Sider } = Layout;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // 从 localStorage 获取用户信息
  const userStr = localStorage.getItem('user');
  let currentUser: User | null = null;
  if (userStr && userStr !== 'undefined' && userStr !== 'null') {
    try {
      currentUser = JSON.parse(userStr);
    } catch (error) {
      console.error('解析用户信息失败:', error);
      currentUser = null;
    }
  }

  const menuItems = [
    {
      key: '/admin',
      icon: <DashboardOutlined />,
      label: '仪表盘',
    },
    {
      key: '/admin/ingredients',
      icon: <ShoppingOutlined />,
      label: '食材管理',
    },
    {
      key: '/admin/stock',
      icon: <InboxOutlined />,
      label: '库存管理',
    },
    {
      key: '/admin/stock-records',
      icon: <HistoryOutlined />,
      label: '出入库记录',
    },
    {
      key: '/admin/suppliers',
      icon: <TeamOutlined />,
      label: '供应商管理',
    },
  ];

  // 退出登录
  const handleLogout = async () => {
    try {
      await userApi.logout();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      message.success('退出成功');
      navigate('/login');
    } catch (error) {
      console.error('退出失败', error);
    }
  };

  // 用户下拉菜单
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'info',
      icon: <UserOutlined />,
      label: (
        <div>
          <div>用户名: {currentUser?.username}</div>
          <div>姓名: {currentUser?.name}</div>
          <div>角色: {currentUser?.role}</div>
        </div>
      ),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div
          style={{
            height: 32,
            margin: 16,
            color: '#fff',
            fontSize: 20,
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          {collapsed ? '火锅' : '火锅点餐系统'}
        </div>
        <Menu
          theme="dark"
          selectedKeys={[location.pathname]}
          mode="inline"
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: '0 24px', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
            <div style={{ fontSize: 18, fontWeight: 'bold' }}>
              火锅点餐系统
            </div>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#667eea' }} />
                <span>{currentUser?.name || currentUser?.username}</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content style={{ margin: '16px' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: '#fff',
              borderRadius: 8,
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
