import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Row, Col, Button, Descriptions, Tag, message, Divider, InputNumber, Space } from 'antd';
import { ShoppingCartOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { ingredientApi } from '../../api/ingredient';
import type { IngredientStockVO } from '../../types/ingredient';
import { addToCart } from '../../utils/cart';

const IngredientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [ingredient, setIngredient] = useState<IngredientStockVO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (id) {
      loadIngredientDetail();
    }
  }, [id]);

  const loadIngredientDetail = async () => {
    try {
      setLoading(true);
      // 由于后端API没有单独的详情接口，我们从列表中获取数据
      const response = await ingredientApi.getStockOverview();
      const ingredientData = response.data?.find(item => item.id === Number(id));
      
      if (ingredientData && ingredientData.categoryId !== 19) { // 排除调料类食材
        setIngredient(ingredientData);
      } else {
        message.error('未找到食材信息');
        // 如果是调料类食材，也提示不支持
        if (ingredientData && ingredientData.categoryId === 19) {
          message.error('调料类食材不支持查看详情');
        }
      }
    } catch (error) {
      console.error('Error loading ingredient detail:', error);
      message.error('加载食材详情失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!ingredient) return;
    
    if (ingredient.stockStatus === '库存不足') {
      message.warning('该食材库存不足，暂时无法购买');
      return;
    }
    
    if (quantity <= 0) {
      message.warning('请选择购买数量');
      return;
    }
    
    addToCart(ingredient, quantity);
    message.success(`已将 ${quantity} ${ingredient.unit} ${ingredient.name} 添加到购物车`);
  };

  const getStockStatusTag = (status: string) => {
    switch (status) {
      case '库存不足':
        return <Tag color="red">缺货</Tag>;
      case '库存过剩':
        return <Tag color="orange">库存多</Tag>;
      default:
        return <Tag color="green">有货</Tag>;
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px', background: '#f8f9fa', minHeight: '100%' }}>加载中...</div>;
  }

  if (!ingredient) {
    return <div style={{ textAlign: 'center', padding: '50px', background: '#f8f9fa', minHeight: '100%' }}>未找到食材信息</div>;
  }

  // 如果是调料类食材，显示提示信息
  if (ingredient.categoryId === 19) {
    return <div style={{ textAlign: 'center', padding: '50px', background: '#f8f9fa', minHeight: '100%' }}>调料类食材不支持查看详情</div>;
  }

  return (
    <div style={{ padding: '20px', background: '#f8f9fa', minHeight: '100%' }} className="apple-card">
      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 600, fontSize: '18px', color: '#333' }}>{ingredient.name}</span>
            {getStockStatusTag(ingredient.stockStatus)}
          </div>
        }
        style={{ marginBottom: 16, borderRadius: '16px' }}
        className="apple-card"
      >
        <Row gutter={24}>
          <Col span={12}>
            <div style={{ 
              height: 300, 
              background: '#f8f9fa', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              borderRadius: 16,
              border: '1px solid #e8e8e8'
            }}>
              {ingredient.imageUrl ? (
                <img 
                  src={ingredient.imageUrl} 
                  alt={ingredient.name} 
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 12 }} 
                />
              ) : (
                <div style={{ fontSize: 80, color: '#ddd' }}>🍲</div>
              )}
            </div>
          </Col>
          
          <Col span={12}>
            <Descriptions bordered column={1} style={{ borderRadius: '12px', overflow: 'hidden' }} className="apple-card">
              <Descriptions.Item label="食材名称">{ingredient.name}</Descriptions.Item>
              <Descriptions.Item label="食材编码">{ingredient.code}</Descriptions.Item>
              <Descriptions.Item label="价格">¥{(typeof ingredient.price === 'object' ? parseFloat(ingredient.price.toString()).toFixed(2) : Number(ingredient.price).toFixed(2)) || '0.00'} / {ingredient.unit}</Descriptions.Item>
              <Descriptions.Item label="当前库存">{ingredient.currentStock} {ingredient.unit}</Descriptions.Item>
              <Descriptions.Item label="最小库存">{ingredient.minStock} {ingredient.unit}</Descriptions.Item>
              <Descriptions.Item label="最大库存">{ingredient.maxStock} {ingredient.unit}</Descriptions.Item>
              <Descriptions.Item label="单位">{ingredient.unit}</Descriptions.Item>
            </Descriptions>

            <Divider />

            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div>
                <div style={{ marginBottom: 8, fontWeight: 500, color: '#333' }}>数量</div>
                <Space>
                  <Button 
                    icon={<MinusOutlined />} 
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    style={{ borderRadius: '8px', padding: '0 8px' }}
                    className="apple-button"
                  />
                  <InputNumber
                    min={1}
                    max={ingredient.currentStock}
                    value={quantity}
                    onChange={(value) => setQuantity(value || 1)}
                    style={{ width: 80, borderRadius: '12px' }}
                    className="apple-input"
                  />
                  <Button 
                    icon={<PlusOutlined />} 
                    onClick={() => setQuantity(prev => Math.min(ingredient.currentStock, prev + 1))}
                    style={{ borderRadius: '8px', padding: '0 8px' }}
                    className="apple-button"
                  />
                </Space>
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: 8, fontWeight: 500, color: '#333' }}>小计</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#fa8c16' }}>
                  ¥{((typeof ingredient.price === 'object' ? parseFloat(ingredient.price.toString()) : Number(ingredient.price)) || 0) * quantity}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 24 }}>
              <Button 
                type="primary" 
                size="large"
                icon={<ShoppingCartOutlined />}
                onClick={handleAddToCart}
                disabled={ingredient.stockStatus === '库存不足'}
                block
                className="apple-button"
                style={{ 
                  borderRadius: '12px', 
                  height: '48px',
                  backgroundColor: ingredient.stockStatus === '库存不足' ? '#bfbfbf' : '#fa8c16',
                  borderColor: ingredient.stockStatus === '库存不足' ? '#bfbfbf' : '#fa8c16'
                }}
              >
                {ingredient.stockStatus === '库存不足' ? '缺货 - 无法购买' : '加入购物车'}
              </Button>
            </div>
          </Col>
        </Row>

        <Divider />

        <div>
          <h3 style={{ fontWeight: 600, color: '#333', marginBottom: '12px' }}>食材描述</h3>
          <p style={{ fontSize: '14px', lineHeight: '1.8', color: '#555' }}>
            {ingredient.description || '该食材暂无详细描述信息。'}
          </p>
        </div>
      </Card>
    </div>
  );
};

export default IngredientDetail;