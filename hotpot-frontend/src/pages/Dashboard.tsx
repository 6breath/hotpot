import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Spin } from 'antd';
import { ShoppingOutlined, InboxOutlined, WarningOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { ingredientApi } from '../api/ingredient';
import { stockRecordApi } from '../api/stockRecord';
import type { Ingredient, IngredientStockVO } from '../types/ingredient';
import type { StockRecord } from '../types/stockRecord';
import type { ColumnsType } from 'antd/es/table';

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalIngredients: 0,
    totalStock: 0,
    lowStockCount: 0,
  });
  const [lowStockList, setLowStockList] = useState<Ingredient[]>([]);
  const [recentRecords, setRecentRecords] = useState<StockRecord[]>([]);
  const [stockOverview, setStockOverview] = useState<IngredientStockVO[]>([]);

  // 加载统计数据
  const loadStats = async () => {
    setLoading(true);
    try {
      // 获取库存概览
      const stockOverviewRes = await ingredientApi.getStockOverview();
      console.log('库存概览数据:', stockOverviewRes.data);
      
      // 验证返回的数据是否为数组
      if (!Array.isArray(stockOverviewRes.data)) {
        console.error('库存概览API返回的数据不是数组:', stockOverviewRes.data);
        return;
      }
      
      const stockData = stockOverviewRes.data;
      setStockOverview(stockData);
      
      // 获取低库存食材(从库存概览中筛选)
      const lowStock = stockData.filter(item => {
        // 处理BigDecimal类型到number的转换
        const currentStock = typeof item.currentStock === 'object' && item.currentStock !== null 
          ? parseFloat(item.currentStock.toString()) 
          : item.currentStock;
        const minStock = typeof item.minStock === 'object' && item.minStock !== null 
          ? parseFloat(item.minStock.toString()) 
          : item.minStock;
        return item.stockStatus === '库存不足' || (currentStock < minStock);
      });
      
      // 获取所有记录
      const recordsRes = await stockRecordApi.list();
      
      setStats({
        totalIngredients: stockData.length,
        totalStock: stockData.reduce((sum, item) => {
          // 处理BigDecimal类型到number的转换
          const currentStock = typeof item.currentStock === 'object' && item.currentStock !== null 
            ? parseFloat(item.currentStock.toString()) 
            : item.currentStock || 0;
          return sum + currentStock;
        }, 0),
        lowStockCount: lowStock.length,
      });
      
      // 转换为Ingredient类型用于表格显示
      const lowStockIngredients: Ingredient[] = lowStock.map(item => ({
        id: item.id,
        name: item.name,
        categoryName: item.categoryName,
        unit: item.unit,
        currentStock: typeof item.currentStock === 'object' && item.currentStock !== null 
          ? parseFloat(item.currentStock.toString()) 
          : item.currentStock,
        minStock: typeof item.minStock === 'object' && item.minStock !== null 
          ? parseFloat(item.minStock.toString()) 
          : item.minStock,
        maxStock: typeof item.maxStock === 'object' && item.maxStock !== null 
          ? parseFloat(item.maxStock.toString()) 
          : item.maxStock,
        code: '',
        categoryId: 0,
        price: 0,
        status: 1,
      }));
      
      setLowStockList(lowStockIngredients.slice(0, 5)); // 只显示前5条
      
      // 确保recordsRes.data是数组
      const recentRecordsData = Array.isArray(recordsRes.data) ? recordsRes.data : [];
      setRecentRecords(recentRecordsData.slice(0, 10)); // 只显示前10条
    } catch (error) {
      console.error('加载数据失败', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const lowStockColumns: ColumnsType<Ingredient> = [
    {
      title: '食材名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '当前库存',
      dataIndex: 'currentStock',
      key: 'currentStock',
      render: (stock: number, record) => (
        <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>
          {stock || 0} {record.unit}
        </span>
      ),
    },
    {
      title: '最小库存',
      dataIndex: 'minStock',
      key: 'minStock',
      render: (stock: number, record) => `${stock} ${record.unit}`,
    },
    {
      title: '状态',
      key: 'status',
      render: (_, record) => {
        const current = record.currentStock || 0;
        if (current === 0) {
          return <Tag color="error">缺货</Tag>;
        }
        return <Tag color="warning">低库存</Tag>;
      },
    },
  ];

  const recordColumns: ColumnsType<StockRecord> = [
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
        <Tag color={type === 'IN' ? 'success' : 'error'}>
          {type === 'IN' ? '入库' : '出库'}
        </Tag>
      ),
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity: number, record) => (
        <span style={{ color: record.type === 'IN' ? '#52c41a' : '#ff4d4f' }}>
          {record.type === 'IN' ? '+' : '-'}{quantity}
        </span>
      ),
    },
    {
      title: '操作人',
      dataIndex: 'operatorName',
      key: 'operatorName',
    },
    {
      title: '操作时间',
      dataIndex: 'recordTime',
      key: 'recordTime',
      width: 150,
      render: (time: string) => time?.substring(0, 16),
    },
  ];

  // 库存状态饼图
  const getStockStatusPieOption = () => {
    // 确保stockOverview是数组
    if (!Array.isArray(stockOverview)) {
      console.error('stockOverview不是数组:', stockOverview);
      return {};
    }

    const normal = stockOverview.filter(item => 
      item.stockStatus === '正常' || item.stockStatus === 'normal'
    ).length;
    const low = stockOverview.filter(item => 
      item.stockStatus === '库存不足' || item.stockStatus === 'low' || item.stockStatus === 'out'
    ).length;
    const excess = stockOverview.filter(item => 
      item.stockStatus === '库存过剩' || item.stockStatus === 'excess'
    ).length;

    return {
      title: {
        text: '库存状态分布',
        left: 'center',
        top: 10,
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)',
      },
      legend: {
        bottom: 10,
        left: 'center',
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '55%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: false,
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: 'bold',
            },
          },
          data: [
            { value: normal, name: '正常', itemStyle: { color: '#52c41a' } },
            { value: low, name: '库存不足', itemStyle: { color: '#faad14' } },
            { value: excess, name: '库存过剩', itemStyle: { color: '#1890ff' } },
          ],
        },
      ],
    };
  };

  // TOP10库存食材柱状图
  const getTop10StockBarOption = () => {
    // 确保stockOverview是数组
    if (!Array.isArray(stockOverview)) {
      console.error('stockOverview不是数组:', stockOverview);
      return {};
    }
    
    const top10 = [...stockOverview]
      .sort((a, b) => {
        // 处理BigDecimal类型到number的转换
        const aCurrentStock = typeof a.currentStock === 'object' && a.currentStock !== null 
          ? parseFloat(a.currentStock.toString()) 
          : a.currentStock;
        const bCurrentStock = typeof b.currentStock === 'object' && b.currentStock !== null 
          ? parseFloat(b.currentStock.toString()) 
          : b.currentStock;
        return bCurrentStock - aCurrentStock;
      })
      .slice(0, 10);

    console.log('TOP10数据:', top10);

    return {
      title: {
        text: 'TOP10 库存食材',
        left: 'center',
        top: 10,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: 50,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: top10.map(item => item.name),
        axisLabel: {
          rotate: 45,
          interval: 0,
        },
      },
      yAxis: {
        type: 'value',
        name: '库存量',
      },
      series: [
        {
          name: '当前库存',
          type: 'bar',
          data: top10.map(item => item.currentStock),
          itemStyle: {
            color: '#1890ff',
          },
          markLine: {
            data: [
              {
                type: 'average',
                name: '平均值',
                lineStyle: { color: '#52c41a' },
              },
            ],
          },
        },
      ],
    };
  };

  // 出入库趋势折线图
  const getStockTrendOption = () => {
    // 按类型统计
    const inRecords = recentRecords.filter(r => r.type === 'IN');
    const outRecords = recentRecords.filter(r => r.type === 'OUT');

    const inTotal = inRecords.reduce((sum, r) => sum + r.quantity, 0);
    const outTotal = outRecords.reduce((sum, r) => sum + r.quantity, 0);

    return {
      title: {
        text: '出入库统计',
        left: 'center',
        top: 10,
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}',
      },
      legend: {
        bottom: 10,
        left: 'center',
      },
      series: [
        {
          type: 'pie',
          radius: '60%',
          center: ['50%', '55%'],
          data: [
            { value: inTotal, name: '入库总量', itemStyle: { color: '#52c41a' } },
            { value: outTotal, name: '出库总量', itemStyle: { color: '#ff4d4f' } },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };
  };

  return (
    <Spin spinning={loading}>
      <div>
        <h2 style={{ marginBottom: 16 }}>数据概览</h2>
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={8}>
            <Card>
              <Statistic
                title="食材总数"
                value={stats.totalIngredients}
                prefix={<ShoppingOutlined />}
                styles={{ content: { color: '#3f8600' } }}
                suffix="种"
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="总库存量"
                value={stats.totalStock}
                prefix={<InboxOutlined />}
                styles={{ content: { color: '#1890ff' } }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="低库存预警"
                value={stats.lowStockCount}
                prefix={<WarningOutlined />}
                styles={{ content: { color: '#cf1322' } }}
                suffix="项"
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={8}>
            <Card>
              <ReactECharts option={getStockStatusPieOption()} style={{ height: 300 }} />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <ReactECharts option={getTop10StockBarOption()} style={{ height: 300 }} />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <ReactECharts option={getStockTrendOption()} style={{ height: 300 }} />
            </Card>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Card title="低库存预警" style={{ marginBottom: 16 }}>
              {lowStockList.length > 0 ? (
                <Table
                  columns={lowStockColumns}
                  dataSource={lowStockList}
                  rowKey="id"
                  pagination={false}
                  size="small"
                />
              ) : (
                <div style={{ textAlign: 'center', padding: '20px 0', color: '#999' }}>
                  暂无低库存预警
                </div>
              )}
            </Card>
          </Col>
          <Col span={12}>
            <Card title="最近出入库记录" style={{ marginBottom: 16 }}>
              {recentRecords.length > 0 ? (
                <Table
                  columns={recordColumns}
                  dataSource={recentRecords}
                  rowKey="id"
                  pagination={false}
                  size="small"
                />
              ) : (
                <div style={{ textAlign: 'center', padding: '20px 0', color: '#999' }}>
                  暂无出入库记录
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </div>
    </Spin>
  );
};

export default Dashboard;
