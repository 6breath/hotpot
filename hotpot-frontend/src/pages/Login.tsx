import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { UserOutlined, LockOutlined, PhoneOutlined, IdcardOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../api/user';
import type { User } from '../types/user';

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate();
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();

  // 登录处理
  const handleLogin = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      const res = await userApi.login(values);
      message.success('登录成功!');
      
      // 保存用户信息和token
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      // 根据用户角色跳转到不同页面
      const userRole = res.data.user.role?.toUpperCase();
      if (userRole === 'ADMIN' || userRole === 'MANAGER') {
        navigate('/admin');
      } else {
        // USER角色跳转到顾客端首页
        navigate('/customer');
      }
    } catch (error) {
      console.error('登录失败', error);
    } finally {
      setLoading(false);
    }
  };

  // 注册处理
  const handleRegister = async (values: User) => {
    setLoading(true);
    try {
      // 先检查用户名是否存在
      const checkRes = await userApi.checkUsername(values.username);
      if (checkRes.data) {
        message.error('用户名已存在');
        setLoading(false);
        return;
      }

      const res = await userApi.register(values);
      if (res.data) {
        message.success('注册成功!请登录');
        registerForm.resetFields();
        setActiveTab('login');
      }
    } catch (error) {
      console.error('注册失败', error);
    } finally {
      setLoading(false);
    }
  };

  // Tabs配置
  const tabItems: TabsProps['items'] = [
    {
      key: 'login',
      label: '登录',
      children: (
        <Form
          form={loginForm}
          name="login"
          onFinish={handleLogin}
          size="large"
          autoComplete="off"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{ height: 42 }}
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: 'register',
      label: '注册',
      children: (
        <Form
          form={registerForm}
          name="register"
          onFinish={handleRegister}
          size="large"
          autoComplete="off"
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入用户名!' },
              { min: 3, message: '用户名至少3个字符!' },
              { max: 20, message: '用户名最多20个字符!' },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名(3-20个字符)"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码!' },
              { min: 6, message: '密码至少6个字符!' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码(至少6个字符)"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="确认密码"
            />
          </Form.Item>

          <Form.Item
            name="name"
            rules={[{ required: true, message: '请输入姓名!' }]}
          >
            <Input
              prefix={<IdcardOutlined />}
              placeholder="姓名"
            />
          </Form.Item>

          <Form.Item name="phone">
            <Input
              prefix={<PhoneOutlined />}
              placeholder="手机号(可选)"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{ height: 42 }}
            >
              注册
            </Button>
          </Form.Item>
        </Form>
      ),
    },
  ];

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }}>
      <Card
        style={{
          width: 450,
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          borderRadius: 8,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 28, color: '#667eea', marginBottom: 8 }}>
            🍲 火锅点餐系统
          </h1>
          <p style={{ color: '#999' }}>欢迎使用火锅点餐系统</p>
        </div>

        <Tabs activeKey={activeTab} onChange={setActiveTab} centered items={tabItems} />
      </Card>
    </div>
  );
};

export default LoginPage;
