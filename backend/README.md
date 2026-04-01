# CaptRAW Documents 后端服务

*最后更新：2024年4月*

## 概述

CaptRAW Documents 后端服务是一个基于 Express.js 的 Node.js 应用，提供以下核心功能：

1. **资产签名服务** - 为前端资产生成预签名URL，实现安全的对象存储访问
2. **数据库集成** - 使用 PostgreSQL 存储资产元数据
3. **对象存储集成** - 兼容 S3 协议的对象存储访问（支持 MinIO、AWS S3 等）
4. **配置管理** - 统一的 YAML 配置文件管理

## 架构设计

### 核心模块

```
backend/
├── src/
│   ├── config.ts          # 配置管理
│   ├── server.ts          # Express 应用入口
│   ├── serverInfoRoute.ts # 服务器信息路由
│   ├── database/          # 数据库模块
│   │   └── index.ts       # PostgreSQL 连接池和查询
│   ├── storage/           # 存储模块
│   │   └── s3Client.ts    # S3 兼容存储客户端
│   ├── assetRegistry.ts   # 资产注册表（数据库查询）
│   ├── assetSignRoute.ts  # 资产签名路由
│   └── services/          # 业务服务
│       └── serverInfoService.ts # 服务器信息服务
├── scripts/
│   ├── upload-assets.ts   # 资产上传脚本
│   ├── reset-db.ts        # 数据库重置脚本
│   └── seed-db.ts         # 数据库种子脚本
├── init-db.sql           # 数据库初始化脚本
├── seed-data.sql         # 种子数据脚本
└── package.json
```

### 数据流

1. **前端请求** → `GET /api/assets/sign?kind=user&uuid=user_menu_avatar`
2. **路由处理** → `assetSignRoute.ts` 处理请求
3. **资产查询** → `assetRegistry.ts` 查询数据库获取资产记录
4. **权限检查** → 验证用户访问权限
5. **URL签名** → `s3Client.ts` 生成预签名URL
6. **响应返回** → 返回带过期时间的签名URL

## 配置说明

### 配置文件结构

```yaml
api:
  baseUrl: "http://localhost:3001/api"

assets:
  strategy: "signedUrl"           # 前端使用的策略
  publicBaseUrl: "https://via.placeholder.com"  # 占位图URL
  sign:
    mode: "real"                  # "real" 或 "mock"
    expiresSeconds: 300           # 签名URL有效期

objectStorage:
  endpoint: "localhost"
  port: 9000
  bucket: "capt-docs-storage"     # 存储桶名称（小写字母和连字符）
  accessKey: "Capt-Docs"
  secretKey: "12345678"
  region: "us-east-1"
  secure: false

database:
  url: "postgresql://captraw_user:captraw_password@localhost:5432/captraw_db"
```

### 配置模式

1. **开发模式** (`sign.mode: "mock"`)
   - 使用占位图服务，快速开发测试
   - 无需运行 MinIO 和 PostgreSQL

2. **生产模式** (`sign.mode: "real"`)
   - 真实的 S3 签名URL
   - 需要完整的存储桶和数据库环境

## 数据库设计

### 资产表 (assets)

```sql
CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uuid VARCHAR(255) NOT NULL UNIQUE,      -- 前端使用的 assetUuid
  kind VARCHAR(50) NOT NULL,              -- 'user' | 'article' | 'notice' | 'banner'
  object_key VARCHAR(500) NOT NULL,       -- 存储桶中的对象键
  mime_type VARCHAR(100),                 -- 文件类型
  size_bytes BIGINT,                      -- 文件大小
  visibility VARCHAR(20) DEFAULT 'public', -- 'public' | 'private'
  owner_id VARCHAR(255),                  -- 所有者ID
  username VARCHAR(255),                  -- 联邦用户名
  hostname VARCHAR(255),                  -- 联邦主机名
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 存储设计

### 对象键命名规则

- **用户资产**: `user/{encoded-username}/{uuid}`
  - `encoded-username`: URL编码的联邦用户名 `@username@hostname`
- **文章资产**: `article/{uuid}`
- **横幅资产**: `banner/{uuid}`
- **公告资产**: `notice/{uuid}`

### 存储桶结构

```
capt-docs-storage/
├── user/
│   ├── %40He0xD4C0%40hub.captraw.com/
│   │   ├── user_menu_avatar
│   │   └── current_user_avatar
│   └── %40new_user%40hub.captraw.com/
│       └── new_user_avatar
├── article/
│   ├── article_1_cover
│   └── article_2_cover
├── banner/
│   ├── banner_1_image
│   └── banner_2_image
└── notice/
    ├── notice_1_author_avatar
    └── notice_2_author_avatar
```

## 开发指南

### 环境准备

1. **启动依赖服务**
   ```bash
   docker-compose up -d minio postgres
   ```

2. **初始化 MinIO 存储桶**
   ```bash
   ./scripts/init-minio-local.sh
   ```

3. **安装依赖**
   ```bash
   cd backend
   npm install
   ```

### 运行开发服务器

```bash
cd backend
npm run dev
```

### 数据库操作

1. **健康检查**
   ```bash
   npm run test-db
   ```

2. **查看数据库内容**
   ```bash
   docker exec captraw-postgres psql -U captraw_user -d captraw_db -c "SELECT * FROM assets LIMIT 5;"
   ```

### 资产上传脚本

将示例数据上传到存储桶并插入数据库记录：

```bash
npm run upload-assets
```

脚本功能：
1. 读取前端示例数据 (`frontend/src/data/`)
2. 上传图片到 MinIO 存储桶
3. 插入资产元数据到 PostgreSQL
4. 验证上传结果

## API 文档

### 健康检查

```http
GET /health
```

响应：
```json
{
  "ok": true,
  "service": "backend",
  "timestamp": "2026-03-31T09:47:19.685Z"
}
```

### 资产签名

#### 单资产签名

```http
GET /api/assets/sign?kind={kind}&uuid={uuid}
```

参数：
- `kind`: 资产类型 (`user` | `article` | `notice` | `banner`)
- `uuid`: 资产唯一标识符

响应：
```json
{
  "success": true,
  "data": {
    "kind": "user",
    "uuid": "user_menu_avatar",
    "signedUrl": "http://localhost:9000/...",
    "expiresIn": 300
  }
}
```

#### 批量资产签名

```http
POST /api/assets/sign
Content-Type: application/json

{
  "items": [
    { "kind": "user", "uuid": "user_menu_avatar" },
    { "kind": "article", "uuid": "article_1_cover" }
  ]
}
```

## 错误处理

### 常见错误码

- `400`: 请求参数缺失或格式错误
- `403`: 无权访问私有资产
- `404`: 资产记录不存在
- `500`: 服务器内部错误

### 错误响应格式

```json
{
  "success": false,
  "error": "not_found",
  "kind": "user",
  "uuid": "unknown_avatar",
  "detail": "详细错误信息（可选）"
}
```

## 安全考虑

1. **签名URL有效期**: 默认为5分钟，防止URL被长期滥用
2. **权限检查**: 私有资产需要用户身份验证
3. **配置隔离**: 敏感配置（数据库密码、访问密钥）与前端隔离
4. **输入验证**: 严格的参数验证和类型检查

## 部署说明

### 生产环境配置

1. **修改配置文件** (`config.yaml`)
   - 更新数据库连接字符串为生产环境
   - 设置 `secure: true` 如果使用 HTTPS
   - 使用强密码替换默认凭证

2. **构建应用**
   ```bash
   npm run build
   ```

3. **启动服务**
   ```bash
   npm start
   ```

### 环境变量

可以通过环境变量覆盖配置：

```bash
export OBJECT_STORAGE_BUCKET="my-production-bucket"
export DATABASE_URL="postgresql://user:password@host:5432/db"
```

## 故障排除

### 常见问题

1. **数据库连接失败**
   - 检查 PostgreSQL 容器是否运行
   - 验证连接字符串中的用户名和密码

2. **MinIO 连接失败**
   - 检查 MinIO 容器是否运行
   - 验证端口映射是否正确
   - 检查访问密钥和秘密密钥

3. **签名URL无法访问**
   - 确认存储桶中存在对应的对象
   - 检查对象键的编码是否正确
   - 验证签名URL是否已过期

### 日志检查

```bash
# 查看后端日志
cd backend && npm run dev

# 查看 MinIO 日志
docker-compose logs minio

# 查看 PostgreSQL 日志
docker-compose logs postgres
```

## 扩展开发

### 添加新的资产类型

1. 在 `config.ts` 中扩展 `AssetKind` 类型
2. 在数据库 `assets` 表中添加相应的记录
3. 在 `s3Client.ts` 中更新对象键生成逻辑
4. 在前端同步更新相应的类型定义

### 集成其他对象存储

1. 实现新的存储客户端（继承相同接口）
2. 在配置中添加存储类型选择
3. 在 `s3Client.ts` 中根据配置选择客户端

## 许可证

本项目采用 MIT 许可证。详见 [LICENSE](../LICENSE) 文件。