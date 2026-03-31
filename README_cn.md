# CaptRAW Documents

![CaptRAW Documents Banner](https://via.placeholder.com/1200x400/3b82f6/ffffff?text=CaptRAW+Documents)

一个现代化的技术博客和文档管理系统，专注于技术分享和知识管理。

## 🚀 项目概述

**CaptRAW Documents** 是一个完整的博客系统，提供用户管理、文章管理、文章浏览等功能。项目采用现代化的技术栈，注重代码质量、安全性和用户体验。

### ✨ 核心特性

- 📝 **文章管理系统** - 支持Markdown格式的文章编写和发布
- 🎨 **现代化UI设计** - 响应式设计，支持深色/浅色主题
- 🔐 **用户认证系统** - 完整的注册、登录和个人资料管理
- 🏷️ **标签分类系统** - 灵活的文章标签和分类管理
- 📊 **数据统计** - 文章阅读量、点赞数、评论数统计
- 🔧 **配置驱动架构** - 灵活的配置系统，支持多环境部署
- 🛡️ **安全设计** - 敏感配置隔离，安全的资源访问控制

## 📊 项目状态

**开发阶段**: 第1阶段 - 前端开发（已完成75%） + 后端基础架构  
**最后更新**: 2026年3月31日

### ✅ 已完成功能

1. **项目基础架构** - 完整的项目结构和开发环境
2. **布局系统** - Header、Footer、Layout组件
3. **主页功能** - 横幅轮播、公告板、文章时间线
4. **配置系统** - 安全的配置管理和资源统一管理
5. **数据层** - 完整的API服务和数据管理
6. **后端基础** - 数据库、对象存储和资产管理
7. **项目文档** - 完整的模块文档和进度报告

### 🚧 开发中功能

1. **文章详情页面** - 文章内容展示和Markdown渲染
2. **评论系统** - 文章评论和互动功能
3. **用户认证** - 登录、注册、个人资料页面
4. **管理后台** - 管理员功能面板

## 🛠️ 技术栈

### 前端技术栈
- **框架**: React 19.2.4 + TypeScript 4.9.5
- **路由**: React Router DOM 7.13.2
- **状态管理**: @tanstack/react-query 5.95.2
- **样式**: Tailwind CSS 3.4.19
- **HTTP客户端**: Axios 1.14.0
- **构建工具**: Create React App 5.0.1
- **配置管理**: js-yaml 4.1.1

### 后端技术栈（部分实现）
- **运行时**: Node.js + Express 5.2.1
- **数据库**: PostgreSQL + pg 8.20.0
- **对象存储**: @aws-sdk/client-s3（S3兼容）
- **资产管理**: 签名URL生成和资产注册表
- **数据库操作**: 连接池、事务、CRUD操作
- **配置管理**: 统一的YAML配置，支持环境变量

## 📁 项目结构

```
CaptRAW-Documents/
├── frontend/                    # 前端项目（React + TypeScript + Tailwind）
│   ├── src/
│   │   ├── components/         # React组件
│   │   │   ├── layout/        # 布局组件（Header、Footer、Layout）
│   │   │   ├── ui/           # UI组件（AssetImage、ThemeToggle、UserAvatar）
│   │   │   ├── home/         # 主页组件（BannerCarousel、NoticeBoard、ArticleTimeline）
│   │   │   └── articles/     # 文章组件（ArticleCard）
│   │   ├── pages/            # 页面组件（HomePage）
│   │   ├── hooks/            # React Hooks（useArticles、useAssetUrl等）
│   │   ├── services/         # API服务（模块化服务架构）
│   │   ├── config/           # 配置模块（runtimeConfig、urls）
│   │   ├── data/             # 数据文件（articles、notices、banners JSON）
│   │   ├── types/            # TypeScript类型定义
│   │   └── utils/            # 工具函数（assetUrl）
│   ├── public/               # 静态资源
│   ├── scripts/              # 构建脚本（配置同步）
│   └── package.json          # 依赖配置
├── backend/                    # 后端项目（Node.js + Express + TypeScript）
│   ├── src/
│   │   ├── database/          # 数据库模块（PostgreSQL连接池）
│   │   ├── storage/           # 存储模块（S3兼容客户端）
│   │   ├── assetRegistry.ts   # 资产注册表（支持数据库回退）
│   │   ├── assetSignRoute.ts  # 资产签名路由处理器
│   │   ├── config.ts          # 配置管理
│   │   └── server.ts          # Express服务器
│   ├── scripts/                # 工具脚本（资产上传）
│   ├── init-db.sql            # 数据库初始化脚本
│   └── package.json            # 依赖配置
├── Reference/                  # 项目文档和参考资料
├── scripts/                    # 全局脚本（MinIO初始化）
├── config.yaml                 # 主配置文件
├── docker-compose.yml          # Docker配置（PostgreSQL + MinIO）
└── .gitignore                  # Git忽略文件
```

## 🚀 快速开始

### 环境要求

- Node.js 18+ 
- npm 9+ 或 yarn 1.22+
- Git

### 安装步骤

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd CaptRAW-Documents
   ```

2. **安装前端依赖**
   ```bash
   cd frontend
   npm install
   ```

3. **创建配置文件**
   ```bash
   # 从模板创建配置文件
   cp config.example.yaml config.yaml
   # 编辑配置文件（可选）
   nano config.yaml
   ```

4. **启动开发服务器**
   ```bash
   npm start
   ```

5. **访问应用**
   - 打开浏览器访问: http://localhost:3000

### 配置文件示例

创建 `config.yaml` 文件：

```yaml
# API配置
api:
  baseUrl: http://localhost:3001/api

# 资源管理配置
assets:
  strategy: signedUrl          # 策略: publicPrefix | signedUrl
  publicBaseUrl: https://via.placeholder.com
  sign:
    mode: mock                 # 模式: real | mock
    expiresSeconds: 300        # 签名URL过期时间

# 社区链接
community:
  url: https://hub.captraw.com

# 后端专用配置（不会同步到前端）
database:
  url: postgresql://user:password@localhost:5432/captraw_db
objectStorage:
  endpoint: http://localhost:9000
  bucket: captraw-assets
  accessKey: minioadmin
  secretKey: minioadmin
```

## 📖 使用指南

### 开发模式

1. **启动开发服务器**
   ```bash
   cd frontend
   npm start
   ```

2. **构建生产版本**
   ```bash
   npm run build
   ```

3. **运行测试**
   ```bash
   npm test
   ```

### 配置说明

项目采用配置驱动的架构：

1. **唯一配置源**: `config.yaml` 是项目的唯一配置源
2. **安全去敏**: 前端只能访问去敏后的配置
3. **运行时加载**: 前端运行时动态加载配置
4. **自动同步**: 构建时自动同步配置到前端

### 资源管理

项目使用统一的资源管理系统：

```typescript
// 使用AssetImage组件加载图片
<AssetImage
  kind="article"
  assetUuid="article_1_cover"
  alt="文章封面"
  className="w-full h-48 object-cover"
/>

// 使用useAssetUrl Hook获取URL
const { data: avatarUrl } = useAssetUrl('user', user.avatar);
```

## 🔧 开发指南

### 代码规范

- 使用TypeScript进行类型检查
- 遵循ESLint代码规范
- 使用Prettier代码格式化
- 组件使用函数式组件和Hooks

### 组件开发

1. **创建新组件**
   ```bash
   # 在components目录下创建新组件
   touch src/components/NewComponent.tsx
   ```

2. **组件结构**
   ```typescript
   import React from 'react';
   import { SomeType } from '../types';
   
   interface NewComponentProps {
     // 组件属性定义
   }
   
   const NewComponent: React.FC<NewComponentProps> = ({ ...props }) => {
     // 组件逻辑
     return (
       // JSX
     );
   };
   
   export default NewComponent;
   ```

### API服务开发

1. **创建新服务**
   ```typescript
   import { BaseService } from './baseService';
   
   export class NewService extends BaseService {
     async getData(): Promise<ApiResponse<DataType>> {
       return this.client.get('/api/data');
     }
   }
   ```

2. **使用React Query**
   ```typescript
   const { data, isLoading, error } = useQuery({
     queryKey: ['data'],
     queryFn: () => newService.getData(),
   });
   ```

## 🧪 测试

### 运行测试

```bash
# 运行所有测试
npm test

# 运行特定测试文件
npm test -- --testPathPattern=ComponentName

# 生成测试覆盖率报告
npm test -- --coverage
```

### 测试策略

- **单元测试**: 测试单个组件或函数
- **集成测试**: 测试组件间的交互
- **端到端测试**: 测试完整用户流程

## 📦 部署

### 生产环境构建

```bash
cd frontend
npm run build
```

### Docker部署

```bash
# 构建Docker镜像
docker build -t captraw-documents .

# 运行容器
docker run -p 3000:80 captraw-documents
```

### 平台部署

- **Vercel**: 前端部署
- **Railway/Render**: 后端部署
- **Docker Hub**: 容器镜像托管

## 🔐 安全考虑

### 配置安全

- 敏感配置（数据库、对象存储）不会泄露到前端
- 配置加载时的类型验证和错误处理
- 配置加载失败时的安全回退机制

### 资源安全

- 支持对象存储的签名URL机制
- 后端鉴权生成短时有效URL
- 资源访问的权限验证

### 网络安全

- HTTPS支持
- CORS安全配置
- API速率限制

## 🤝 贡献指南

### 开发流程

1. Fork项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request

### 代码审查

- 确保代码通过TypeScript编译
- 运行所有测试并确保通过
- 遵循项目代码规范
- 更新相关文档

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系方式

**项目负责人**: @He0xD4C0@hub.captraw.com  
**项目状态**: 活跃开发中  
**问题反馈**: 请使用GitHub Issues

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者！

---

## 📈 项目进度

### 开发计划

| 阶段 | 状态 | 完成度 |
|------|------|--------|
| 第1阶段：前端开发 | 🟢 进行中 | 75% |
| 第2阶段：后端基础 | 🟢 进行中 | 70% |
| 第3阶段：文章系统 | ⚪ 待开始 | 0% |
| 第4阶段：用户认证 | ⚪ 待开始 | 0% |
| 第5阶段：管理功能 | ⚪ 待开始 | 0% |
| 第6阶段：测试部署 | ⚪ 待开始 | 0% |

### 详细进度

- ✅ **一阶段**: 项目初始化与基础架构 (100%)
- ✅ **二阶段**: 布局组件开发 (100%)
- ✅ **三阶段**: 主页组件开发 (100%)
- ✅ **四阶段**: 配置系统架构 (100%)
- ✅ **五阶段**: 数据层和API服务 (100%)
- ✅ **六阶段**: 项目文档和清理 (100%)
- 🟡 **七阶段**: 后端基础架构 (70%)
- ⚪ **八阶段**: 文章页面开发 (待开始)
- ⚪ **九阶段**: 用户认证系统 (待开始)
- ⚪ **十阶段**: 管理页面开发 (待开始)

---

**Inspired form CaptRAW Community - Misskey Server** - 也欢迎访问我们的CaptRAW社区，你可以交流，分享生活，亦或是水贴。