-- 火锅点餐系统数据库结构脚本

-- 创建数据库
CREATE DATABASE IF NOT EXISTS hotpot_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE hotpot_db;

-- 用户表
CREATE TABLE user (
                      id INT PRIMARY KEY AUTO_INCREMENT,
                      username VARCHAR(50) UNIQUE NOT NULL COMMENT '用户名',
                      password VARCHAR(100) NOT NULL COMMENT '密码',
                      name VARCHAR(50) COMMENT '姓名',
                      role VARCHAR(20) DEFAULT 'USER' COMMENT '角色(ADMIN, MANAGER, USER)',
                      phone VARCHAR(20),
                      status INT DEFAULT 1 COMMENT '状态: 0-禁用, 1-启用',
                      create_time DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 用户表数据
INSERT INTO user (username, password, name, role, phone, status, create_time) VALUES
                                                                                  ('admin', 'e10adc3949ba59abbe56e057f20f883e', '张店长', 'ADMIN', '13800138001', 1, '2024-01-01 09:00:00'),
                                                                                  ('zhangsan', 'e10adc3949ba59abbe56e057f20f883e', '张三', 'MANAGER', '13800138002', 1, '2024-01-02 10:15:00'),
                                                                                  ('lisi', 'e10adc3949ba59abbe56e057f20f883e', '李四', 'USER', '13800138003', 1, '2024-01-03 11:30:00'),
                                                                                  ('wangwu', 'e10adc3949ba59abbe56e057f20f883e', '王五', 'USER', '13800138004', 1, '2024-01-04 13:45:00'),
                                                                                  ('zhaoliu', 'e10adc3949ba59abbe56e057f20f883e', '赵六', 'USER', '13800138005', 1, '2024-01-05 14:20:00'),
                                                                                  ('qianqi', 'e10adc3949ba59abbe56e057f20f883e', '钱七', 'USER', '13800138006', 0, '2024-01-06 15:40:00');  -- 禁用用户

-- 食材分类表
CREATE TABLE category (
                          id INT PRIMARY KEY AUTO_INCREMENT,
                          name VARCHAR(50) NOT NULL COMMENT '分类名称',
                          parent_id INT DEFAULT 0 COMMENT '父分类ID',
                          sort INT DEFAULT 0 COMMENT '排序',
                          create_time DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='食材分类表';

-- 分类表数据（火锅店典型分类）
INSERT INTO category (name, parent_id, sort, create_time) VALUES
                                                            ('肉类', 0, 1, '2024-01-01 10:00:00'),
                                                            ('牛肉类', 1, 11, '2024-01-01 10:05:00'),
                                                            ('羊肉类', 1, 12, '2024-01-01 10:06:00'),
                                                            ('猪肉类', 1, 13, '2024-01-01 10:07:00'),
                                                            ('其他肉类', 1, 14, '2024-01-01 10:08:00'),

                                                            ('蔬菜类', 0, 2, '2024-01-01 10:10:00'),
                                                            ('叶菜类', 6, 21, '2024-01-01 10:12:00'),
                                                            ('菌菇类', 6, 22, '2024-01-01 10:13:00'),
                                                            ('根茎类', 6, 23, '2024-01-01 10:14:00'),

                                                            ('海鲜类', 0, 3, '2024-01-01 10:15:00'),
                                                            ('虾类', 10, 31, '2024-01-01 10:16:00'),
                                                            ('鱼类', 10, 32, '2024-01-01 10:17:00'),
                                                            ('贝类', 10, 33, '2024-01-01 10:18:00'),

                                                            ('主食类', 0, 4, '2024-01-01 10:20:00'),
                                                            ('面类', 14, 41, '2024-01-01 10:21:00'),
                                                            ('粉类', 14, 42, '2024-01-01 10:22:00'),

                                                            ('调料类', 0, 5, '2024-01-01 10:25:00'),
                                                            ('汤底', 17, 51, '2024-01-01 10:26:00'),
                                                            ('蘸料', 17, 52, '2024-01-01 10:27:00');

-- 供应商表
CREATE TABLE supplier (
                          id INT PRIMARY KEY AUTO_INCREMENT,
                          name VARCHAR(100) NOT NULL COMMENT '供应商名称',
                          contact_person VARCHAR(50) COMMENT '联系人',
                          phone VARCHAR(20) COMMENT '电话',
                          address VARCHAR(200) COMMENT '地址',
                          rating INT DEFAULT 3 COMMENT '评级 1-5',
                          status INT DEFAULT 1 COMMENT '状态',
                          create_time DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='供应商表';

-- 供应商表数据
INSERT INTO supplier (name, contact_person, phone, address, rating, status, create_time) VALUES
                                                                                           ('四川肉类批发市场', '王经理', '028-86543210', '四川省成都市金牛区批发路88号', 5, 1, '2024-01-01 11:00:00'),
                                                                                           ('绿源蔬菜合作社', '李主任', '028-87654321', '四川省成都市郫都区农业路66号', 4, 1, '2024-01-02 09:30:00'),
                                                                                           ('渤海湾海鲜公司', '张总', '0411-12345678', '辽宁省大连市中山区海鲜路99号', 4, 1, '2024-01-03 10:20:00'),
                                                                                           ('本地粮油供应商', '赵老板', '028-88886666', '四川省成都市武侯区粮仓路55号', 3, 1, '2024-01-04 14:15:00'),
                                                                                           ('老干妈调料厂', '陶经理', '0851-22334455', '贵州省贵阳市云岩区工业园33号', 5, 1, '2024-01-05 16:30:00'),
                                                                                           ('暂停合作供应商', '刘经理', '028-77778888', '四川省成都市成华区暂停路22号', 2, 0, '2024-01-06 11:45:00');

-- 食材表
CREATE TABLE ingredient (
                            id INT PRIMARY KEY AUTO_INCREMENT,
                            name VARCHAR(100) NOT NULL COMMENT '食材名称',
                            code VARCHAR(30) UNIQUE COMMENT '食材编码',
                            category_id INT NOT NULL COMMENT '分类ID',
                            unit VARCHAR(10) DEFAULT 'kg' COMMENT '单位',
                            price DECIMAL(10,2) COMMENT '参考单价',
                            min_stock INT DEFAULT 10 COMMENT '最小库存预警',
                            max_stock INT DEFAULT 100 COMMENT '最大库存',
                            supplier_id INT COMMENT '供应商ID',
                            description TEXT COMMENT '描述',
                            image_url VARCHAR(200) COMMENT '图片',
                            status INT DEFAULT 1 COMMENT '状态',
                            create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
                            INDEX idx_category (category_id),
                            INDEX idx_supplier (supplier_id),
                            INDEX idx_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='食材表';

-- 食材表数据（40种常见火锅食材）
INSERT INTO ingredient (name, code, category_id, unit, price, min_stock, max_stock, supplier_id, description, status) VALUES
-- 牛肉类 (6种)
('肥牛卷', 'FB001', 2, '份', 45.00, 50, 200, 1, '精选肥牛，肥瘦相间，10片/份', 1),
('雪花牛肉', 'XB002', 2, 'kg', 88.00, 10, 50, 1, '澳洲进口雪花牛肉', 1),
('牛舌片', 'NS003', 2, '份', 38.00, 30, 120, 1, '薄切牛舌片，8片/份', 1),
('牛百叶', 'NB004', 2, 'kg', 65.00, 5, 30, 1, '新鲜牛百叶，爽脆可口', 1),
('牛肉丸', 'NRW005', 2, '份', 28.00, 40, 160, 1, '手工牛肉丸，8颗/份', 1),
('牛筋', 'NJ006', 2, 'kg', 75.00, 8, 40, 1, '炖煮软糯的牛筋', 1),

-- 羊肉类 (4种)
('羊肉卷', 'YR001', 3, '份', 42.00, 60, 250, 1, '内蒙古羔羊肉，10片/份', 1),
('羊蝎子', 'YXZ002', 3, 'kg', 68.00, 15, 60, 1, '带骨羊肉，火锅底料', 1),
('羊排卷', 'YPJ003', 3, '份', 48.00, 25, 100, 1, '精品羊排肉卷', 1),
('羊肉串', 'YRC004', 3, '串', 8.00, 100, 400, 1, '腌制好的羊肉串', 1),

-- 猪肉类 (4种)
('梅花肉', 'MHR001', 4, 'kg', 52.00, 12, 50, 1, '猪梅花肉，肉质鲜美', 1),
('午餐肉', 'WCR002', 4, '罐', 15.00, 30, 120, 1, '火锅专用午餐肉', 1),
('猪脑花', 'ZNH003', 4, '份', 25.00, 20, 80, 1, '新鲜猪脑花，1个/份', 1),
('猪黄喉', 'ZHH004', 4, 'kg', 85.00, 6, 25, 1, '爽脆猪黄喉', 1),

-- 叶菜类 (5种)
('生菜', 'SC001', 7, 'kg', 8.00, 20, 80, 2, '新鲜生菜，洗净备用', 1),
('油麦菜', 'YMC002', 7, 'kg', 7.50, 18, 70, 2, '有机油麦菜', 1),
('菠菜', 'BC003', 7, 'kg', 9.00, 15, 60, 2, '嫩叶菠菜', 1),
('茼蒿', 'TH004', 7, 'kg', 12.00, 12, 50, 2, '火锅必备茼蒿', 1),
('娃娃菜', 'WWC005', 7, 'kg', 10.00, 25, 100, 2, '小颗娃娃菜', 1),

-- 菌菇类 (5种)
('金针菇', 'JZG001', 8, 'kg', 14.00, 15, 60, 2, '白色金针菇', 1),
('香菇', 'XG002', 8, 'kg', 22.00, 10, 40, 2, '新鲜香菇', 1),
('杏鲍菇', 'XBG003', 8, 'kg', 18.00, 12, 50, 2, '切片杏鲍菇', 1),
('平菇', 'PG004', 8, 'kg', 16.00, 8, 35, 2, '新鲜平菇', 1),
('木耳', 'ME005', 8, 'kg', 35.00, 5, 20, 2, '泡发黑木耳', 1),

-- 海鲜类 (虾类 3种)
('虾滑', 'XH001', 11, '份', 36.00, 40, 160, 3, '手工虾滑，200g/份', 1),
('大虾', 'DX002', 11, 'kg', 95.00, 8, 35, 3, '鲜活大虾', 1),
('虾仁', 'XR003', 11, 'kg', 78.00, 10, 40, 3, '去壳虾仁', 1),

-- 海鲜类 (鱼类 3种)
('巴沙鱼片', 'BSY001', 12, 'kg', 45.00, 15, 60, 3, '无刺巴沙鱼片', 1),
('龙利鱼', 'LLY002', 12, 'kg', 68.00, 10, 40, 3, '进口龙利鱼', 1),
('鱼豆腐', 'YDF003', 12, '份', 22.00, 50, 200, 3, '火锅鱼豆腐', 1),

-- 面类 (4种)
('火锅面', 'HGM001', 15, '份', 12.00, 80, 320, 4, '特制火锅面', 1),
('粉丝', 'FS002', 16, 'kg', 25.00, 10, 40, 4, '红薯粉丝', 1),
('宽粉', 'KF003', 16, 'kg', 28.00, 8, 35, 4, '土豆宽粉', 1),
('方便面', 'FBM004', 15, '包', 5.00, 100, 400, 4, '普通方便面', 1),

-- 汤底 (3种)
('牛油麻辣锅底', 'NY001', 18, '包', 25.00, 50, 200, 5, '经典牛油麻辣', 1),
('番茄锅底', 'FQ002', 18, '包', 20.00, 40, 160, 5, '酸甜番茄味', 1),
('菌汤锅底', 'JT003', 18, '包', 22.00, 30, 120, 5, '养生菌菇汤', 1),

-- 蘸料 (3种)
('香油蒜泥', 'XY001', 19, '份', 5.00, 200, 800, 5, '经典香油碟', 1),
('麻酱蘸料', 'MJ002', 19, '份', 6.00, 150, 600, 5, '北方麻酱味', 1),
('沙茶酱', 'SCJ003', 19, '瓶', 18.00, 30, 120, 5, '潮汕沙茶酱', 1);

-- 库存表
CREATE TABLE stock (
                       id INT PRIMARY KEY AUTO_INCREMENT,
                       ingredient_id INT NOT NULL COMMENT '食材ID',
                       quantity DECIMAL(10,2) DEFAULT 0 COMMENT '当前库存数量',
                       warehouse VARCHAR(50) DEFAULT '主仓库' COMMENT '仓库位置',
                       update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                       UNIQUE KEY uk_ingredient (ingredient_id, warehouse),
                       INDEX idx_ingredient (ingredient_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='库存表';

-- 库存表数据（随机生成，但符合业务逻辑）
INSERT INTO stock (ingredient_id, quantity, warehouse) VALUES
-- 肉类库存相对充足
(1, 120, '冷藏库A区'),   -- 肥牛卷
(2, 25, '冷冻库A区'),    -- 雪花牛肉
(3, 85, '冷藏库B区'),    -- 牛舌片
(4, 18, '冷藏库C区'),    -- 牛百叶
(5, 130, '冷冻库B区'),   -- 牛肉丸
(6, 22, '冷冻库C区'),    -- 牛筋
(7, 180, '冷冻库A区'),   -- 羊肉卷
(8, 35, '冷冻库B区'),    -- 羊蝎子
(9, 60, '冷冻库A区'),    -- 羊排卷
(10, 280, '冷藏库D区'),  -- 羊肉串
(11, 32, '冷藏库E区'),   -- 梅花肉
(12, 90, '常温库A区'),   -- 午餐肉
(13, 50, '冷藏库F区'),   -- 猪脑花
(14, 15, '冷藏库G区'),   -- 猪黄喉

-- 蔬菜类库存较少（需每日补充）
(15, 45, '蔬菜冷藏库'),  -- 生菜
(16, 38, '蔬菜冷藏库'),  -- 油麦菜
(17, 28, '蔬菜冷藏库'),  -- 菠菜
(18, 20, '蔬菜冷藏库'),  -- 茼蒿
(19, 60, '蔬菜冷藏库'),  -- 娃娃菜
(20, 35, '菌菇冷藏库'),  -- 金针菇
(21, 25, '菌菇冷藏库'),  -- 香菇
(22, 30, '菌菇冷藏库'),  -- 杏鲍菇
(23, 15, '菌菇冷藏库'),  -- 平菇
(24, 12, '菌菇冷藏库'),  -- 木耳

-- 海鲜类库存适中
(25, 110, '冷冻库D区'),  -- 虾滑
(26, 20, '海鲜池'),      -- 大虾
(27, 28, '冷冻库E区'),   -- 虾仁
(28, 40, '冷冻库F区'),   -- 巴沙鱼片
(29, 25, '冷冻库G区'),   -- 龙利鱼
(30, 150, '冷冻库H区'),  -- 鱼豆腐

-- 主食类库存充足
(31, 250, '主食库'),     -- 火锅面
(32, 25, '主食库'),      -- 粉丝
(33, 20, '主食库'),      -- 宽粉
(34, 320, '方便面区'),   -- 方便面

-- 调料类库存充足
(35, 160, '调料库'),     -- 牛油麻辣锅底
(36, 120, '调料库'),     -- 番茄锅底
(37, 90, '调料库'),      -- 菌汤锅底
(38, 650, '调料库'),     -- 香油蒜泥
(39, 480, '调料库'),     -- 麻酱蘸料
(40, 85, '调料库');      -- 沙茶酱

-- 出入库记录表
CREATE TABLE stock_record (
                              id INT PRIMARY KEY AUTO_INCREMENT,
                              ingredient_id INT NOT NULL COMMENT '食材ID',
                              type VARCHAR(10) NOT NULL COMMENT '类型: IN-入库, OUT-出库',
                              quantity DECIMAL(10,2) NOT NULL COMMENT '数量',
                              unit_price DECIMAL(10,2) COMMENT '单价',
                              total_price DECIMAL(10,2) COMMENT '总价',
                              operator_id INT COMMENT '操作人ID',
                              operator_name VARCHAR(50) COMMENT '操作人姓名',
                              remark VARCHAR(200) COMMENT '备注',
                              related_order VARCHAR(50) COMMENT '关联单号',
                              record_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '记录时间',
                              INDEX idx_ingredient_time (ingredient_id, record_time),
                              INDEX idx_type_time (type, record_time),
                              INDEX idx_ingredient (ingredient_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='出入库记录表';

-- 入库记录（采购入库）
INSERT INTO stock_record (ingredient_id, type, quantity, unit_price, total_price, operator_id, operator_name, remark, related_order, record_time) VALUES
-- 牛肉类入库（量大价高）
(1, 'IN', 50, 40.00, 2000.00, 2, '张三', '周一常规补货', 'PO20240115001', '2024-02-20 08:30:00'),
(2, 'IN', 15, 75.00, 1125.00, 2, '张三', '高端食材补货', 'PO20240115002', '2024-02-20 09:15:00'),
(7, 'IN', 100, 35.00, 3500.00, 3, '李四', '羊肉卷大量进货', 'PO20240115003', '2024-02-20 10:00:00'),

-- 蔬菜类入库（每日进货）
(15, 'IN', 40, 6.00, 240.00, 3, '李四', '生菜每日进货', 'PO20240115004', '2024-02-21 06:30:00'),
(20, 'IN', 30, 10.00, 300.00, 3, '李四', '金针菇进货', 'PO20240115005', '2024-02-21 07:00:00'),
(25, 'IN', 80, 30.00, 2400.00, 4, '王五', '虾滑补货', 'PO20240115006', '2024-02-21 14:20:00'),

-- 调料类入库（周进货）
(35, 'IN', 100, 20.00, 2000.00, 4, '王五', '锅底料进货', 'PO20240116001', '2024-02-22 11:30:00'),
(38, 'IN', 300, 3.00, 900.00, 5, '赵六', '蘸料大量进货', 'PO20240116002', '2024-02-22 13:45:00'),

-- 出库记录（日常消耗）
(1, 'OUT', 35, NULL, NULL, 3, '李四', '晚市消耗', 'SO20240220001', '2024-02-20 19:30:00'),
(15, 'OUT', 25, NULL, NULL, 3, '李四', '午市蔬菜消耗', 'SO20240220002', '2024-02-20 12:15:00'),
(25, 'OUT', 45, NULL, NULL, 4, '王五', '虾滑热销', 'SO20240220003', '2024-02-20 20:45:00'),
(35, 'OUT', 28, NULL, NULL, 4, '王五', '麻辣锅底消耗', 'SO20240220004', '2024-02-20 21:30:00'),
(38, 'OUT', 120, NULL, NULL, 5, '赵六', '香油碟消耗', 'SO20240220005', '2024-02-20 22:00:00'),

-- 更多出库记录（模拟日常运营）
(7, 'OUT', 60, NULL, NULL, 3, '李四', '羊肉卷热销', 'SO20240221001', '2024-02-21 19:45:00'),
(20, 'OUT', 20, NULL, NULL, 3, '李四', '金针菇消耗', 'SO20240221002', '2024-02-21 13:20:00'),
(31, 'OUT', 80, NULL, NULL, 4, '王五', '火锅面消耗', 'SO20240221003', '2024-02-21 20:30:00'),

-- 周末高峰出库
(1, 'OUT', 55, NULL, NULL, 3, '李四', '周末高峰', 'SO20240224001', '2024-02-24 21:00:00'),
(7, 'OUT', 85, NULL, NULL, 3, '李四', '周末羊肉热销', 'SO20240224002', '2024-02-24 21:15:00'),
(25, 'OUT', 65, NULL, NULL, 4, '王五', '周末虾滑热销', 'SO20240224003', '2024-02-24 21:30:00'),
(35, 'OUT', 42, NULL, NULL, 4, '王五', '周末锅底消耗', 'SO20240224004', '2024-02-24 22:00:00');

-- 库存快照表
CREATE TABLE stock_snapshot (
                                id INT PRIMARY KEY AUTO_INCREMENT,
                                snapshot_date DATE NOT NULL COMMENT '快照日期',
                                ingredient_id INT NOT NULL COMMENT '食材ID',
                                stock_quantity DECIMAL(10,2) COMMENT '当日库存',
                                create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
                                UNIQUE KEY uk_date_ingredient (snapshot_date, ingredient_id),
                                INDEX idx_date (snapshot_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='库存快照表';

-- 生成最近7天的库存快照（用于可视化趋势图）
-- 假设从2月14日到2月20日，库存有规律波动
INSERT INTO stock_snapshot (snapshot_date, ingredient_id, stock_quantity) VALUES
-- 肥牛卷(1) 库存变化趋势
('2024-02-14', 1, 130),
('2024-02-15', 1, 115),
('2024-02-16', 1, 95),
('2024-02-17', 1, 65),
('2024-02-18', 1, 40),
('2024-02-19', 1, 30),
('2024-02-20', 1, 120),

-- 羊肉卷(7) 库存变化趋势
('2024-02-14', 7, 200),
('2024-02-15', 7, 175),
('2024-02-16', 7, 145),
('2024-02-17', 7, 100),
('2024-02-18', 7, 60),
('2024-02-19', 7, 35),
('2024-02-20', 7, 180),

-- 虾滑(25) 库存变化趋势
('2024-02-14', 25, 120),
('2024-02-15', 25, 105),
('2024-02-16', 25, 85),
('2024-02-17', 25, 55),
('2024-02-18', 25, 30),
('2024-02-19', 25, 25),
('2024-02-20', 25, 110),

-- 生菜(15) 库存变化（每日波动）
('2024-02-14', 15, 50),
('2024-02-15', 15, 35),
('2024-02-16', 15, 48),
('2024-02-17', 15, 30),
('2024-02-18', 15, 45),
('2024-02-19', 15, 32),
('2024-02-20', 15, 45);

-- 订单表
CREATE TABLE `order` (
                      id INT PRIMARY KEY AUTO_INCREMENT,
                      order_no VARCHAR(50) UNIQUE NOT NULL COMMENT '订单号',
                      user_id INT NOT NULL COMMENT '下单用户ID',
                      table_number VARCHAR(10) COMMENT '桌号',
                      total_amount DECIMAL(10,2) DEFAULT 0 COMMENT '订单总金额',
                      status VARCHAR(20) DEFAULT 'PENDING' COMMENT '订单状态: PENDING-待确认, CONFIRMED-已确认, PREPARING-制作中, SERVED-已上菜, COMPLETED-已完成, CANCELLED-已取消',
                      create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
                      update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                      INDEX idx_user_id (user_id),
                      INDEX idx_order_no (order_no),
                      INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单表';

-- 订单详情表
CREATE TABLE order_detail (
                          id INT PRIMARY KEY AUTO_INCREMENT,
                          order_id INT NOT NULL COMMENT '订单ID',
                          ingredient_id INT NOT NULL COMMENT '食材ID',
                          ingredient_name VARCHAR(100) NOT NULL COMMENT '食材名称',
                          quantity INT NOT NULL COMMENT '数量',
                          unit_price DECIMAL(10,2) NOT NULL COMMENT '单价',
                          total_price DECIMAL(10,2) NOT NULL COMMENT '小计',
                          note TEXT COMMENT '备注',
                          create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
                          INDEX idx_order_id (order_id),
                          INDEX idx_ingredient_id (ingredient_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单详情表';

-- 购物车表
CREATE TABLE cart (
                     id INT PRIMARY KEY AUTO_INCREMENT,
                     user_id INT NOT NULL COMMENT '用户ID',
                     ingredient_id INT NOT NULL COMMENT '食材ID',
                     quantity INT NOT NULL DEFAULT 1 COMMENT '数量',
                     create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
                     update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                     UNIQUE KEY uk_user_ingredient (user_id, ingredient_id),
                     INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='购物车表';

-- 创建视图
CREATE VIEW stock_overview AS
SELECT
    i.id,
    i.name,
    i.category_id,
    c.name AS category_name,
    i.unit,
    COALESCE(s.quantity, 0) AS current_stock,
    i.min_stock,
    i.max_stock,
    CASE
        WHEN COALESCE(s.quantity, 0) < i.min_stock THEN '库存不足'
        WHEN COALESCE(s.quantity, 0) > i.max_stock THEN '库存过剩'
        ELSE '正常'
        END AS stock_status
FROM ingredient i
         LEFT JOIN category c ON i.category_id = c.id
         LEFT JOIN stock s ON i.id = s.ingredient_id;