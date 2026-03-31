# 后端源代码目录说明

此目录包含 CaptRAW Documents 后端服务的所有源代码。

## 目录结构

### 核心文件
- `server.ts` - Express 应用入口点，设置中间件和路由
- `config.ts` - 配置管理模块，读取和验证配置文件
- `assetRegistry.ts` - 资产注册表，管理资产元数据和数据库查询
- `assetSignRoute.ts` - 资产签名路由，处理资产签名请求

### 模块目录
- `database/` - 数据库连接和操作
- `storage/` - 对象存储客户端和操作

## 文件详细说明

### `server.ts` - 主服务器文件
Express 应用的入口点，负责：
- 初始化 Express 应用
- 配置中间件（CORS、JSON 解析、日志）
- 设置路由
- 启动 HTTP 服务器
- 健康检查端点

**主要功能：**
- 创建 Express 应用实例
- 配置全局中间件
- 注册 API 路由
- 错误处理中间件
- 服务器启动和关闭处理

### `config.ts` - 配置管理
读取和验证配置文件，提供类型安全的配置访问。

**主要功能：**
- 从 `config.yaml` 读取配置
- 验证配置完整性和有效性
- 提供类型安全的配置接口
- 环境变量覆盖支持

**配置接口：**
```typescript
interface AppConfig {
  api: ApiConfig;
  assets: AssetConfig;
  objectStorage: ObjectStorageConfig;
  database: DatabaseConfig;
}
```

### `assetRegistry.ts` - 资产注册表
管理资产元数据的数据库查询和操作。

**主要功能：**
- 查询资产记录
- 验证资产访问权限
- 处理资产关联数据
- 提供资产元数据管理

**核心方法：**
- `findAsset(kind, uuid)` - 查找资产记录
- `checkPermission(asset, user)` - 检查访问权限
- `createAsset(assetData)` - 创建资产记录
- `updateAsset(uuid, updates)` - 更新资产记录

### `assetSignRoute.ts` - 资产签名路由
处理资产签名请求的 Express 路由。

**主要功能：**
- 处理单个资产签名请求
- 处理批量资产签名请求
- 验证请求参数
- 调用资产注册表和存储客户端
- 返回签名 URL 或错误响应

**路由端点：**
- `GET /api/assets/sign` - 单个资产签名
- `POST /api/assets/sign` - 批量资产签名

## 模块说明

### `database/` - 数据库模块
PostgreSQL 数据库连接和操作。

**文件：**
- `index.ts` - 数据库连接池和查询函数

**主要功能：**
- 创建和管理数据库连接池
- 执行 SQL 查询
- 事务处理
- 数据库健康检查

**核心函数：**
- `query(sql, params)` - 执行 SQL 查询
- `transaction(callback)` - 执行事务
- `healthCheck()` - 数据库健康检查

### `storage/` - 存储模块
S3 兼容对象存储客户端。

**文件：**
- `s3Client.ts` - S3 客户端和签名操作

**主要功能：**
- 初始化 S3 客户端
- 生成预签名 URL
- 上传对象到存储桶
- 管理存储桶操作

**核心方法：**
- `getSignedUrl(key, expiresIn)` - 获取签名 URL
- `putObject(key, body)` - 上传对象
- `headObject(key)` - 获取对象元数据
- `deleteObject(key)` - 删除对象

## 架构设计

### 数据流
1. **请求到达** → `server.ts` 接收 HTTP 请求
2. **路由分发** → `assetSignRoute.ts` 处理资产相关请求
3. **资产查询** → `assetRegistry.ts` 查询数据库
4. **权限验证** → 检查用户访问权限
5. **URL 签名** → `s3Client.ts` 生成预签名 URL
6. **响应返回** → 返回 JSON 响应

### 依赖关系
```
server.ts → assetSignRoute.ts → assetRegistry.ts → database/
                                         ↓
                                    s3Client.ts → storage/
```

## 错误处理

### 错误类型
1. **配置错误** - 配置缺失或无效
2. **数据库错误** - 连接或查询失败
3. **存储错误** - 对象存储操作失败
4. **验证错误** - 请求参数无效
5. **权限错误** - 无权访问资源

### 错误响应格式
```json
{
  "success": false,
  "error": "error_code",
  "message": "错误描述",
  "details": { /* 可选详细信息 */ }
}
```

## 配置管理

### 配置文件位置
- 根目录：`../config.yaml`（开发环境）
- 生产环境：环境变量或外部配置服务

### 配置优先级
1. 环境变量（最高）
2. 配置文件
3. 默认值（最低）

### 环境变量支持
```bash
export DATABASE_URL="postgresql://user:pass@host:5432/db"
export OBJECT_STORAGE_BUCKET="my-bucket"
export API_PORT=3001
```

## 开发指南

### 启动开发服务器
```bash
cd backend
npm run dev
```

### 代码结构约定
1. 使用 TypeScript 类型定义
2. 遵循 Express 最佳实践
3. 异步函数使用 async/await
4. 错误处理使用 try/catch
5. 日志记录重要操作

### 添加新路由
1. 创建新的路由文件
2. 在 `server.ts` 中导入和注册
3. 定义路由处理器
4. 添加输入验证
5. 实现错误处理

## 测试策略

### 单元测试
```typescript
describe('assetRegistry', () => {
  test('应该正确查询资产', async () => {
    const asset = await findAsset('user', 'user_menu_avatar');
    expect(asset).toBeDefined();
    expect(asset.kind).toBe('user');
  });
});
```

### 集成测试
```typescript
describe('资产签名 API', () => {
  test('应该返回签名 URL', async () => {
    const response = await request(app)
      .get('/api/assets/sign?kind=user&uuid=avatar');
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.signedUrl).toMatch(/^http/);
  });
});
```

## 性能优化

### 数据库优化
- 使用连接池管理数据库连接
- 优化查询语句和索引
- 缓存常用查询结果

### 存储优化
- 批量处理签名请求
- 缓存签名 URL（注意过期时间）
- 使用 CDN 加速静态资源

### 服务器优化
- 启用 HTTP 压缩
- 设置适当的超时时间
- 实现请求限流

## 安全考虑

### 输入验证
- 验证所有请求参数
- 清理用户输入
- 防止 SQL 注入

### 权限控制
- 验证用户身份
- 检查资源访问权限
- 记录访问日志

### 配置安全
- 敏感信息不硬编码
- 使用环境变量存储密钥
- 定期轮换访问凭证

## 监控和日志

### 日志记录
```typescript
import logger from './utils/logger';

logger.info('服务器启动', { port: config.api.port });
logger.error('数据库连接失败', { error: err.message });
```

### 性能监控
- 记录请求处理时间
- 监控数据库查询性能
- 跟踪存储操作延迟

## 扩展指南

### 添加新功能模块
1. 创建新的模块目录
2. 实现核心功能
3. 添加类型定义
4. 创建路由处理器
5. 更新服务器配置

### 集成新数据库
1. 创建新的数据库适配器
2. 实现通用查询接口
3. 更新配置类型
4. 添加环境变量支持

### 支持新存储提供商
1. 创建新的存储客户端
2. 实现通用存储接口
3. 更新配置管理
4. 添加提供商特定配置