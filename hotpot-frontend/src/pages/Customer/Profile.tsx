import React from 'react';
import { Card, Descriptions, Button, message } from 'antd';
import { UserOutlined, PhoneOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../../api/user';

const CustomerProfile: React.FC = () => {
  const navigate = useNavigate();
  
  // 从 localStorage 获取用户信息
  const userStr = localStorage.getItem('user');
  let currentUser = null;
  if (userStr && userStr !== 'undefined' && userStr !== 'null') {
    try {
      currentUser = JSON.parse(userStr);
    } catch (error) {
      console.error('解析用户信息失败:', error);
    }
  }
  
  // 顾客信息
  const customerInfo = {
    name: currentUser?.name || currentUser?.username || '顾客',
    phone: currentUser?.phone || '未填写',
  };

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
      // 即使后端退出失败，也清除本地信息并跳转到登录页
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px 0', background: '#f8f9fa', minHeight: '100%' }} className="apple-card">
      <h1 style={{ textAlign: 'center', marginBottom: 24, fontWeight: 600, color: '#333' }}>个人中心</h1>
      
      <Card title="基本信息" style={{ marginBottom: 24, borderRadius: '16px' }} className="apple-card">
        <Descriptions column={1} size="middle" style={{ padding: '16px' }}>
          <Descriptions.Item label={<><UserOutlined /> 姓名</>}>
            {customerInfo.name}
          </Descriptions.Item>
          <Descriptions.Item label={<><PhoneOutlined /> 电话</>}>
            {customerInfo.phone}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="账户操作" style={{ borderRadius: '16px' }} className="apple-card">
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Button 
            type="primary" 
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            size="large"
            className="apple-button"
            style={{ 
              borderRadius: '12px', 
              height: '40px',
              backgroundColor: '#ff4d4f',
              borderColor: '#ff4d4f'
            }}
          >
            退出登录
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CustomerProfile;