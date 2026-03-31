# 自定义 Hooks 目录说明

此目录包含 CaptRAW Documents 前端应用的自定义 React Hooks。

## 可用 Hooks

### `useArticles.ts` - 文章数据 Hook
管理文章的获取、分页和筛选。

**功能：**
- 获取文章列表
- 支持分页加载
- 按标签筛选文章
- 缓存和重新验证

**使用示例：**
```tsx
const { data: articles, isLoading, error } = useArticles({
  page: 1,
  pageSize: 10,
  tags: ['javascript', 'react']
});
```

### `useAssetUrl.ts` - 资产 URL Hook
获取签名资产 URL，支持开发和生产模式。

**功能：**
- 根据资产类型和 UUID 获取 URL
- 支持开发模式下的占位图
- 自动处理 URL 签名和过期
- 缓存已获取的 URL

**使用示例：**
```tsx
const { url, isLoading, error } = useAssetUrl({
  kind: 'user',
  uuid: 'user_menu_avatar'
});
```

### `useBanners.ts` - 横幅数据 Hook
管理横幅数据的获取和状态。

**功能：**
- 获取横幅列表
- 支持自动轮播控制
- 响应式尺寸适配

**使用示例：**
```tsx
const { data: banners, currentIndex, next, prev } = useBanners({
  autoPlay: true,
  interval: 3000
});
```

### `useNotices.ts` - 公告数据 Hook
管理公告数据的获取和显示。

**功能：**
- 获取公告列表
- 支持懒加载
- 按时间排序

**使用示例：**
```tsx
const { data: notices, loadMore, hasMore } = useNotices({
  limit: 5,
  lazy: true
});
```

### `useTags.ts` - 标签数据 Hook
管理文章标签的获取和使用。

**功能：**
- 获取热门标签
- 获取所有标签
- 标签云生成

**使用示例：**
```tsx
const { data: tags, isLoading } = useTags({
  type: 'popular',
  limit: 20
});
```

## Hook 设计原则

1. **单一职责**：每个 Hook 只解决一个特定问题
2. **可组合性**：Hooks 可以相互组合使用
3. **类型安全**：完整的 TypeScript 类型定义
4. **错误处理**：内置错误状态和恢复机制
5. **性能优化**：避免不必要的重新渲染和网络请求

## Hook 实现模式

### 基础结构
```tsx
import { useState, useEffect } from 'react';

export function useCustomHook(options: HookOptions) {
  const [data, setData] = useState<DataType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // 数据获取逻辑
  }, [options]);

  return { data, isLoading, error };
}
```

### 与 React Query 集成
```tsx
import { useQuery } from '@tanstack/react-query';
import { articleService } from '../services/articleService';

export function useArticles(options: ArticleOptions) {
  return useQuery({
    queryKey: ['articles', options],
    queryFn: () => articleService.getArticles(options),
    staleTime: 5 * 60 * 1000, // 5分钟
  });
}
```

## 最佳实践

1. **命名约定**：使用 `use` 前缀，如 `useArticles`
2. **参数处理**：支持可选参数和默认值
3. **返回值**：返回对象而不是数组，提高可读性
4. **依赖管理**：正确指定 useEffect 的依赖数组
5. **清理操作**：必要时返回清理函数

## 测试策略

- 使用 React Testing Library 测试 Hook
- 模拟服务层依赖
- 测试各种状态（加载、成功、错误）
- 测试用户交互和状态更新

## 扩展指南

### 创建新 Hook
1. 在 `hooks/` 目录下创建新文件
2. 使用 `use` 前缀命名函数
3. 定义完整的 TypeScript 类型
4. 实现 Hook 逻辑
5. 导出 Hook

### Hook 组合示例
```tsx
export function useUserProfile(userId: string) {
  const user = useUser(userId);
  const avatarUrl = useAssetUrl({
    kind: 'user',
    uuid: user?.avatarUuid
  });

  return {
    user,
    avatarUrl,
    isLoading: user.isLoading || avatarUrl.isLoading
  };
}
```

## 性能考虑

1. **记忆化**：使用 `useMemo` 和 `useCallback` 优化性能
2. **懒加载**：只在需要时加载数据
3. **请求去重**：避免重复请求相同数据
4. **缓存策略**：合理设置缓存时间和重新验证策略

## 错误边界

- 每个 Hook 都应提供错误状态
- 支持重试机制
- 提供用户友好的错误信息
- 记录错误到监控系统