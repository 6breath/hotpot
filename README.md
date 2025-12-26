# HotPot 项目

一个基于Spring Boot和React的前后端分离火锅食材管理系统。

## 技术栈

### 后端技术栈
- **编程语言**: Java (JDK 17)
- **框架**: Spring Boot 3.1.5
- **持久层框架**: MyBatis Plus 3.5.4
- **构建工具**: Maven
- **数据库**: MySQL 8.0+
- **其他依赖**: 
  - Lombok: 简化代码
  - FastJSON: JSON处理
  - Spring Boot Devtools: 热部署

### 前端技术栈
- **框架**: React 18.3.1
- **构建工具**: Vite
- **语言**: TypeScript
- **UI组件库**: Ant Design
- **图表库**: ECharts
- **路由**: React Router DOM
- **状态管理**: Zustand
- **HTTP客户端**: Axios

## 功能模块

1. **食材管理**: 增删改查食材信息
2. **分类管理**: 食材分类管理
3. **库存管理**: 实时库存查询、更新
4. **出入库管理**: 记录食材出入库操作
5. **供应商管理**: 供应商信息管理
6. **可视化**: 库存状态展示、预警

## 项目结构

```
├── hotpot-frontend\              # 前端项目
│   ├── src\                     # 前端源代码
│   │   ├── api\                 # API接口定义
│   │   ├── layouts\             # 页面布局
│   │   ├── pages\               # 页面组件
│   │   │   ├── Ingredient\      # 食材管理页面
│   │   │   ├── Stock\           # 库存管理页面
│   │   │   ├── StockRecord\     # 出入库记录页面
│   │   │   ├── Supplier\        # 供应商管理页面
│   │   │   ├── Dashboard.tsx    # 仪表盘页面
│   │   │   └── Login.tsx        # 登录页面
│   │   ├── types\               # TypeScript类型定义
│   │   ├── utils\               # 工具函数
│   │   ├── App.tsx              # 应用主组件
│   │   ├── index.css            # 全局样式
│   │   └── main.tsx             # 应用入口
│   ├── public\                  # 静态资源
│   ├── package.json             # 前端依赖配置
│   └── vite.config.ts           # Vite构建配置
├── src\                         # 后端项目
│   └── main\                    # 主源码
│       ├── java/com/hotpot\     # Java源代码
│       │   ├── config\          # 配置类
│       │   ├── controller\      # 控制器层
│       │   ├── entity\           # 实体类
│       │   ├── mapper\           # 数据访问层
│       │   ├── result\           # 返回结果类
│       │   ├── service\          # 业务逻辑层
│       │   │   └── impl\         # 业务实现类
│       │   └── HotpotApplication.java # 应用启动类
│       └── resources\            # 资源文件
│           ├── mapper\          # MyBatis映射文件
│           └── application.yaml   # 应用配置文件
├── schema.sql                   # 数据库建表脚本
├── pom.xml                      # Maven依赖配置
└── README.md                    # 项目说明文档
```

## 启动说明

### 环境准备

1. 安装JDK 17+
2. 安装MySQL 8.0+
3. 安装Node.js和npm
4. 安装Maven 3.6+

### 数据库配置

```bash
# 创建数据库
mysql -u root -p
CREATE DATABASE hotpot_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 导入数据
mysql -u root -p hotpot_db < schema.sql
```

### 后端启动

1. 修改 [application.yaml](file:///E:/HotPotProject/hotpot/src/main/resources/application.yaml) 中的数据库连接信息
2. 在项目根目录执行：
   ```bash
   cd E:\HotPotProject\hotpot
   mvn spring-boot:run
   ```
   或者先打包再运行：
   ```bash
   mvn clean package
   java -jar target/hotpot-0.0.1-SNAPSHOT.jar
   ```

### 前端启动

1. 在前端目录安装依赖：
   ```bash
   cd E:\HotPotProject\hotpot\hotpot-frontend
   npm install
   ```
2. 启动开发服务器：
   ```bash
   npm run dev
   ```

## 端口信息

- 后端服务默认运行在8080端口
- 前端开发服务器默认运行在5173端口（根据Vite配置）
- API基础地址配置在 [hotpot-frontend/.env.development](file:///E:/HotPotProject/hotpot/hotpot-frontend/.env.development) 文件中


```
# 火锅店点餐系统

这是一个基于Spring Boot + React的火锅店点餐系统，从前端到后端完整实现点餐功能。

## 功能特点

- 顾客端：在线浏览菜单、添加到购物车、提交订单
- 管理端：食材管理、库存管理、订单管理
- 实时库存：下单自动扣减库存
- 订单跟踪：订单状态管理

## 技术栈

- 后端：Spring Boot, MyBatis Plus, MySQL
- 前端：React, TypeScript, Ant Design
- 构建工具：Maven, npm

## 快速开始

### 环境准备

1. 安装JDK 17
2. 安装Maven 3.9+
3. 安装Node.js和npm
4. 安装MySQL数据库

### 后端启动

1. 创建数据库并执行`schema.sql`
2. 配置`application.yaml`中的数据库连接信息
3. 运行`mvn spring-boot:run`

### 前端启动

1. 进入`hotpot-frontend`目录
2. 安装依赖：`npm install`
3. 启动开发服务器：`npm run dev`

## API接口

- 用户管理：`/api/user`
- 食材管理：`/api/ingredient`
- 库存管理：`/api/stock`
- 订单管理：`/api/order`
- 购物车：`/api/cart`

## 数据库设计

系统包含用户、食材、分类、供应商、库存、订单等表结构，支持完整的点餐业务流程。
