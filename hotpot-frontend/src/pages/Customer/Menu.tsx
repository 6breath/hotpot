import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Input, message, Badge, Drawer, Space, Modal } from 'antd';
import { ShoppingCartOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { ingredientApi, cartApi, orderApi, categoryApi, databaseApi } from '@/api';
import { Ingredient } from '@/types';
import { useCartStore } from '@/utils/cart';

const { Search } = Input;

const Menu: React.FC = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [cartVisible, setCartVisible] = useState(false);
  const [tableNumber, setTableNumber] = useState('');
  const [tableNumberModalVisible, setTableNumberModalVisible] = useState(false);
  
  const { cartItems, addToCart, updateQuantity, removeFromCart, getTotalCount, getTotalPrice, clearCart } = useCartStore();

  useEffect(() => {
    // 初始化数据库（检查并创建缺失的表）
    const initDatabase = async () => {
      try {
        await databaseApi.init();
      } catch (error) {
        console.error('数据库初始化失败:', error);
      }
    };
    
    initDatabase();
    fetchIngredients();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryApi.getCategoryMap();
      if (response.code === 200) {
        const categoryOptions = Object.entries(response.data || {}).map(([id, name]) => ({
          id: parseInt(id),
          name: name
        }));
        setCategories(categoryOptions);
      }
    } catch (error) {
      console.error('获取分类列表失败', error);
    }
  };

  const fetchIngredients = async () => {
    try {
      const response = await ingredientApi.getIngredients({
        page: 1,
        size: 1000
      });
      if (response.code === 200) {
        // 从分页结果中提取记录
        const ingredientsData = response.data?.records || response.data || [];
        setIngredients(ingredientsData);
        
        // 如果分类还没有加载，则从食材数据中临时提取分类
        if (categories.length === 0) {
          // 优先使用分类API获取准确的分类名称
          try {
            const categoryResponse = await categoryApi.getCategoryMap();
            if (categoryResponse.code === 200) {
              const categoryMap = categoryResponse.data || {};
              // 只提取有可用食材的分类（状态为1且有库存的食材）
              const availableIngredients = ingredientsData.filter(ingredient => 
                ingredient.status === 1 // 只包括启用的食材
              );
              const uniqueCategories = Array.from(
                new Set(availableIngredients.map(item => item.categoryId))
              ).map(catId => ({
                id: catId,
                name: categoryMap[catId] || `分类${catId}`
              }));
              setCategories(uniqueCategories);
            } else {
              // 如果分类API失败，从食材数据中提取
              const availableIngredients = ingredientsData.filter(ingredient => 
                ingredient.status === 1 // 只包括启用的食材
              );
              const uniqueCategories = Array.from(
                new Set(availableIngredients.map(item => item.categoryId))
              ).map(catId => {
                const ingredient = availableIngredients.find(item => item.categoryId === catId);
                return {
                  id: catId,
                  name: ingredient?.categoryName || `分类${catId}`
                };
              });
              setCategories(uniqueCategories);
            }
          } catch (categoryError) {
            // 如果获取分类失败，从食材数据中提取
            const availableIngredients = ingredientsData.filter(ingredient => 
              ingredient.status === 1 // 只包括启用的食材
            );
            const uniqueCategories = Array.from(
              new Set(availableIngredients.map(item => item.categoryId))
            ).map(catId => {
              const ingredient = availableIngredients.find(item => item.categoryId === catId);
              return {
                id: catId,
                name: ingredient?.categoryName || `分类${catId}`
              };
            });
            setCategories(uniqueCategories);
          }
        }
      }
    } catch (error) {
      message.error('获取食材列表失败');
    }
  };

  // 只显示有可用食材的分类
  const getCategoriesWithIngredients = () => {
    const availableIngredients = ingredients.filter(ingredient => 
      ingredient.status === 1 // 只包括启用的食材
    );
    const categoryIdsWithIngredients = new Set(availableIngredients.map(item => item.categoryId));
    
    return categories.filter(category => categoryIdsWithIngredients.has(category.id));
  };

  const filteredIngredients = ingredients.filter(ingredient => {
    const matchesSearch = ingredient.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                         ingredient.description?.toLowerCase().includes(searchValue.toLowerCase());
    const matchesCategory = selectedCategory === null || ingredient.categoryId === selectedCategory;
    return matchesSearch && matchesCategory && ingredient.status === 1; // 只显示启用的食材
  });

  const handleAddToCart = async (ingredient: Ingredient) => {
    // 使用实际登录的用户ID，如果没有登录用户，则使用默认值
    const userId = localStorage.getItem('userId') ? parseInt(localStorage.getItem('userId')!) : 1; // 默认用户ID
    try {
      await cartApi.addToCart(userId, ingredient.id, 1);
      addToCart(ingredient);
      message.success(`已添加 ${ingredient.name} 到购物车`);
    } catch (error) {
      message.error('添加购物车失败');
      console.error('添加购物车失败:', error);
    }
  };

  const handleQuantityChange = async (ingredientId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(ingredientId);
      return;
    }

    const userId = localStorage.getItem('userId') ? parseInt(localStorage.getItem('userId')!) : 1;
    try {
      await cartApi.updateCart(userId, ingredientId, newQuantity);
      updateQuantity(ingredientId, newQuantity);
    } catch (error) {
      message.error('更新购物车失败');
      console.error('更新购物车失败:', error);
    }
  };

  const handleRemoveFromCart = async (ingredientId: number) => {
    const userId = localStorage.getItem('userId') ? parseInt(localStorage.getItem('userId')!) : 1;
    try {
      await cartApi.removeFromCart(userId, ingredientId);
      removeFromCart(ingredientId);
      message.success('已从购物车移除');
    } catch (error) {
      message.error('移除购物车失败');
      console.error('移除购物车失败:', error);
    }
  };

  const handleSubmitOrder = async () => {
    if (cartItems.length === 0) {
      message.warning('购物车为空，请先选择商品');
      return;
    }
    
    // 检查是否包含锅底（分类ID为18是汤底分类，根据数据库中的分类数据）
    const hasSoupBase = cartItems.some(item => item.categoryId === 18);
    
    if (!hasSoupBase) {
      // 提示用户必须选择锅底
      Modal.confirm({
        title: '需要选择锅底',
        content: '火锅必须选择锅底才能下单，是否前往选择锅底？',
        okText: '去选择锅底',
        cancelText: '取消下单',
        onOk: () => {
          // 高亮显示锅底分类
          setSelectedCategory(18); // 选择汤底分类
          message.info('已为您选中汤底分类，请选择锅底');
        },
        onCancel: () => {
          message.info('您可以继续选择其他商品');
        }
      });
      return;
    }
    
    // 检查是否已输入桌号
    if (!tableNumber) {
      setTableNumberModalVisible(true);
      return;
    }
    
    // 将购物车商品转换为订单详情
    const orderDetails = cartItems.map(item => ({
      ingredientId: item.id,
      ingredientName: item.name,
      quantity: item.quantity,
      unitPrice: item.price || 0,
      totalPrice: (item.price || 0) * item.quantity
    }));
    
    try {
      const userId = localStorage.getItem('userId') ? parseInt(localStorage.getItem('userId')!) : 1;
      const response = await orderApi.createOrder(userId, tableNumber, orderDetails);
      if (response.code === 200) {
        message.success('订单提交成功！');
        clearCart(); // 清空购物车
        setCartVisible(false);
        setTableNumber(''); // 清空桌号
      } else {
        message.error(response.message || '订单提交失败');
      }
    } catch (error) {
      message.error('订单提交失败');
      console.error('订单提交失败:', error);
    }
  };

  const handleTableNumberConfirm = () => {
    if (!tableNumber.trim()) {
      message.error('请输入桌号');
      return;
    }
    setTableNumberModalVisible(false);
    handleSubmitOrder(); // 确认桌号后提交订单
  };

  // 获取有食材的分类
  const categoriesWithIngredients = getCategoriesWithIngredients();

  return (
    <div style={{ padding: '20px', background: '#f8f9fa', minHeight: '100%' }}>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontWeight: 600, color: '#333' }}>火锅食材</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Search
            placeholder="搜索食材..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            style={{ width: 200, borderRadius: '12px' }}
            className="apple-input"
            enterButton
          />
          <Badge count={getTotalCount()} offset={[10, 0]}>
            <Button 
              type="primary" 
              icon={<ShoppingCartOutlined />} 
              onClick={() => setCartVisible(true)}
              className="apple-button"
              style={{ borderRadius: '12px', backgroundColor: '#fa8c16', borderColor: '#fa8c16' }}
            >
              购物车
            </Button>
          </Badge>
        </div>
      </div>

      {/* 分类导航 - 只显示有可用食材的分类 */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <div 
          className={`apple-category-tag ${selectedCategory === null ? 'active' : ''}`}
          onClick={() => setSelectedCategory(null)}
          style={{ cursor: 'pointer' }}
        >
          全部
        </div>
        {categoriesWithIngredients.map(category => (
          <div
            key={category.id}
            className={`apple-category-tag ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
            style={{ cursor: 'pointer' }}
          >
            {category.name}
          </div>
        ))}
      </div>

      {/* 食材列表 */}
      <Row gutter={[20, 20]}>
        {filteredIngredients.map(ingredient => {
          const cartItem = cartItems.find(item => item.id === ingredient.id);
          const quantity = cartItem ? cartItem.quantity : 0;
          
          return (
            <Col key={ingredient.id} xs={24} sm={12} md={8} lg={6}>
              <div className="apple-card" style={{ borderRadius: '16px', overflow: 'hidden', height: '100%' }}>
                <div style={{ 
                  height: '150px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  backgroundColor: '#f8f9fa',
                  position: 'relative'
                }}>
                  {ingredient.imageUrl ? (
                    <img 
                      src={ingredient.imageUrl} 
                      alt={ingredient.name} 
                      style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'cover' }} 
                      onError={(e) => {
                        // 如果图片加载失败，显示默认火锅图标
                        const target = e.target as HTMLImageElement;
                        target.onerror = null; // 避免无限循环
                        target.style.display = 'none'; // 隐藏图片元素
                        // 重新显示火锅图标
                        const parentDiv = target.parentElement;
                        if (parentDiv) {
                          const iconDiv = document.createElement('div');
                          iconDiv.style.fontSize = '48px';
                          iconDiv.style.color = '#ddd';
                          iconDiv.textContent = '🍲';
                          parentDiv.appendChild(iconDiv);
                        }
                      }}
                    />
                  ) : (
                    <div style={{ fontSize: '48px', color: '#ddd' }}>🍲</div>
                  )}
                </div>
                <div style={{ padding: '16px' }}>
                  <div style={{ fontWeight: 600, fontSize: '16px', marginBottom: '8px', color: '#333' }}>
                    {ingredient.name}
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ color: '#fa8c16', fontWeight: 'bold', fontSize: '18px' }}>
                      ¥{ingredient.price?.toFixed(2)}
                    </div>
                    <div style={{ marginTop: '8px', fontSize: '12px', color: '#666', minHeight: '36px' }}>
                      {ingredient.description}
                    </div>
                  </div>
                  <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      {quantity > 0 && (
                        <span style={{ color: '#1890ff', fontWeight: 'bold' }}>
                          已选: {quantity}
                        </span>
                      )}
                    </div>
                    <div className="apple-quantity-control" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f5f5f5', borderRadius: '12px', padding: '4px 8px' }}>
                      <Button
                        size="small"
                        icon={<MinusOutlined />}
                        onClick={() => handleQuantityChange(ingredient.id, quantity - 1)}
                        disabled={quantity <= 0}
                        style={{ borderRadius: '8px', padding: '0 8px' }}
                      />
                      <span style={{ minWidth: '20px', textAlign: 'center' }}>{quantity}</span>
                      <Button
                        size="small"
                        icon={<PlusOutlined />}
                        onClick={() => handleAddToCart(ingredient)}
                        style={{ borderRadius: '8px', padding: '0 8px' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          );
        })}
      </Row>

      {/* 购物车抽屉 */}
      <Drawer
        title="购物车"
        placement="right"
        onClose={() => setCartVisible(false)}
        open={cartVisible}
        size="large"
        className="apple-shadow"
      >
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px', color: '#333' }}>
            总计: ¥{getTotalPrice().toFixed(2)}
          </div>
          <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
            {cartItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                购物车为空
              </div>
            ) : (
              cartItems.map(item => (
                <div key={item.id} className="apple-cart-item" style={{ 
                  padding: '16px', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center' 
                }}>
                  <div>
                    <div style={{ fontWeight: 'bold', color: '#333' }}>{item.name}</div>
                    <div style={{ fontSize: '14px', color: '#666' }}>¥{item.price?.toFixed(2)} × {item.quantity}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="apple-quantity-control" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f5f5f5', borderRadius: '12px', padding: '4px 8px' }}>
                      <Button
                        size="small"
                        icon={<MinusOutlined />}
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        style={{ borderRadius: '8px', padding: '0 8px' }}
                      />
                      <span style={{ minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                      <Button
                        size="small"
                        icon={<PlusOutlined />}
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        style={{ borderRadius: '8px', padding: '0 8px' }}
                      />
                    </div>
                    <Button
                      type="text"
                      danger
                      size="small"
                      onClick={() => handleRemoveFromCart(item.id)}
                    >
                      删除
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button 
            block 
            size="large" 
            disabled={cartItems.length === 0}
            onClick={handleSubmitOrder}
            className="apple-button"
            style={{ borderRadius: '12px', height: '48px', fontSize: '16px' }}
          >
            提交订单 (¥{getTotalPrice().toFixed(2)})
          </Button>
        </div>
      </Drawer>
      
      {/* 桌号输入模态框 */}
      <Modal
        title="请输入桌号"
        open={tableNumberModalVisible}
        onOk={handleTableNumberConfirm}
        onCancel={() => setTableNumberModalVisible(false)}
        okText="确认"
        cancelText="取消"
        className="apple-shadow"
      >
        <Input
          placeholder="请输入桌号"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
          onPressEnter={handleTableNumberConfirm}
          className="apple-input"
        />
      </Modal>
    </div>
  );
};

export default Menu;