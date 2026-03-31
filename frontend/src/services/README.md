# API 服务架构文档

## 概述

我们已经将原来庞大的 `api.ts` 文件重构为模块化的服务架构。新的架构提供了更好的代码组织、可维护性和可测试性。

## 新的服务结构

```
frontend/src/services/
├── baseService.ts          # 基础服务类（包含axios配置和通用工具）
├── articleService.ts       # 文章相关API服务
├── noticeService.ts        # 公告相关API服务
├── bannerService.ts        # 横幅相关API服务
├── tagService.ts           # 标签相关API服务
├── authService.ts          # 用户认证相关API服务
├── fileService.ts          # 文件上传相关API服务
├── api.ts                  # 主API服务（向后兼容的入口）
├── index.ts                # 服务索引文件
└── README.md               # 本文档
```

## 如何使用

### 1. 导入单个服务（推荐）

```typescript
// 导入特定的服务
import { articleService } from '../services/articleService';
import { authService } from '../services/authService';

// 使用服务
const articles = await articleService.getArticles();
const user = await authService.getCurrentUser();
```

### 2. 通过索引文件导入

```typescript
// 从索引文件导入
import { 
  articleService, 
  authService, 
  noticeService 
} from '../services';

// 使用服务
const notices = await noticeService.getNotices();
```

### 3. 使用主API服务（向后兼容）

```typescript
// 旧的导入方式仍然有效
import apiService from '../services/api';

// 所有方法都保持相同
const articles = await apiService.getArticles();
const banners = await apiService.getBanners();
```

## 服务详细说明

### BaseService（基础服务类）
- 包含axios客户端配置
- 请求/响应拦截器
- 通用响应方法（successResponse, errorResponse, paginatedResponse）
- 模拟延迟工具（simulateDelay）

### ArticleService（文章服务）
- `getArticles(params?)` - 获取文章列表（支持分页、筛选、排序）
- `getArticle(id)` - 获取单篇文章
- `createArticle(data)` - 创建文章
- `updateArticle(id, data)` - 更新文章
- `deleteArticle(id)` - 删除文章

### NoticeService（公告服务）
- `getNotices(params?)` - 获取公告列表（自动过滤过期公告）

### BannerService（横幅服务）
- `getBanners()` - 获取横幅列表（只返回活跃的横幅）

### TagService（标签服务）
- `getTags()` - 获取标签列表（从文章中提取并统计）

### AuthService（认证服务）
- `login(data)` - 用户登录
- `register(data)` - 用户注册
- `logout()` - 用户登出
- `getCurrentUser()` - 获取当前用户信息

### FileService（文件服务）
- `uploadImage(file)` - 上传图片

## 类型定义

### 导入类型
```typescript
import { AuthResponse } from '../services/authService';
import { UploadResponse } from '../services/fileService';
```

### 通过索引文件导入类型
```typescript
import type { 
  AuthResponse, 
  UploadResponse 
} from '../services';
```

## 向后兼容性

为了确保现有的代码继续工作，我们保留了 `api.ts` 文件作为主API服务入口。所有现有的导入和使用方式都不需要修改：

```typescript
// 现有的代码继续有效
import apiService from '../services/api';

// 所有方法签名保持不变
const result = await apiService.getArticles();
const user = await apiService.getCurrentUser();
```

## 迁移指南

### 从旧API迁移到新服务

如果你想要使用新的模块化服务，可以按照以下步骤迁移：

1. **识别导入语句**
   ```typescript
   // 旧方式
   import apiService from '../services/api';
   
   // 新方式
   import { articleService } from '../services/articleService';
   ```

2. **更新方法调用**
   ```typescript
   // 旧方式
   const articles = await apiService.getArticles();
   
   // 新方式
   const articles = await articleService.getArticles();
   ```

3. **使用类型安全的响应**
   ```typescript
   // 新服务提供更好的类型推断
   const response = await articleService.getArticle(1);
   if (response.success) {
     const article = response.data; // 类型为 Article
   }
   ```

## 优势

### 1. 更好的代码组织
- 每个服务专注于单一职责
- 易于查找和维护特定功能

### 2. 提高可测试性
- 可以单独测试每个服务
- 更容易模拟和替换服务实现

### 3. 减少耦合
- 组件只需要导入它们实际需要的服务
- 减少不必要的依赖

### 4. 更好的类型安全
- 每个服务都有明确的输入/输出类型
- 编译时错误检测更准确

### 5. 易于扩展
- 添加新服务只需创建新文件
- 不影响现有代码

## 最佳实践

1. **按需导入**：只导入你需要的服务，而不是整个API
2. **使用类型**：充分利用TypeScript的类型系统
3. **错误处理**：总是检查响应中的 `success` 字段
4. **依赖注入**：考虑在大型应用中使用依赖注入模式

## 示例

### 在组件中使用新服务

```typescript
import React, { useEffect, useState } from 'react';
import { articleService } from '../services/articleService';
import { Article } from '../types';

const ArticleList: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      const response = await articleService.getArticles();
      if (response.success && response.data) {
        setArticles(response.data);
      }
      setLoading(false);
    };

    fetchArticles();
  }, []);

  if (loading) return <div>加载中...</div>;

  return (
    <div>
      {articles.map(article => (
        <div key={article.id}>{article.title}</div>
      ))}
    </div>
  );
};

export default ArticleList;
```

### 在Hooks中使用新服务

```typescript
// hooks/useCustomArticles.ts
import { useQuery } from '@tanstack/react-query';
import { articleService } from '../services/articleService';

export const useCustomArticles = (params?: any) => {
  return useQuery({
    queryKey: ['articles', 'custom', params],
    queryFn: () => articleService.getArticles(params),
  });
};
```

## 故障排除

### 常见问题

1. **导入错误**：确保从正确的路径导入服务
2. **类型错误**：检查类型定义是否匹配
3. **向后兼容性**：如果现有代码出现问题，暂时使用 `api.ts`

### 获取帮助

如果遇到任何问题，请检查：
1. 服务文件是否正确导出
2. 类型定义是否完整
3. 编译错误信息

## 更新日志

### v0.3.0 (2026-03-31)
- 重构API服务为模块化架构
- 创建7个独立的服务文件
- 保持向后兼容性
- 添加完整的类型定义
- 创建服务索引文件

---

*本文档最后更新：2026年3月31日*