# 工具函数目录说明

此目录包含 CaptRAW Documents 前端应用的通用工具函数。

## 当前可用工具

### `assetUrl.ts` - 资产 URL 工具函数
生成和管理资产（图片、文件）的访问 URL。

**主要功能：**
- 根据配置模式（mock/real）生成相应的资产 URL
- 处理签名 URL 的获取和缓存
- 提供占位图 URL 作为后备方案

**核心函数：**
- `getAssetUrl(kind, uuid, options?)` - 获取资产 URL
- `getPlaceholderUrl(options?)` - 获取占位图 URL
- `clearAssetCache()` - 清除 URL 缓存

**使用示例：**
```tsx
import { getAssetUrl } from './utils/assetUrl';

const avatarUrl = getAssetUrl('user', 'user_menu_avatar', {
  width: 100,
  height: 100,
  quality: 80
});

// 在组件中使用
<img src={avatarUrl} alt="用户头像" />
```

## 工具函数设计原则

1. **纯函数**：相同的输入总是产生相同的输出，无副作用
2. **单一职责**：每个函数只做一件事
3. **类型安全**：完整的 TypeScript 类型定义
4. **错误处理**：优雅地处理边界情况
5. **性能优化**：避免不必要的计算和网络请求

## 函数实现模式

### 纯函数示例
```typescript
export function formatDate(date: Date, format: string = 'YYYY-MM-DD'): string {
  // 格式化日期，不依赖外部状态
  // ...
}
```

### 带缓存的函数
```typescript
const cache = new Map<string, string>();

export function getCachedAssetUrl(key: string, fetcher: () => Promise<string>): Promise<string> {
  if (cache.has(key)) {
    return Promise.resolve(cache.get(key)!);
  }
  
  return fetcher().then(url => {
    cache.set(key, url);
    return url;
  });
}
```

## 分类建议

根据项目发展，可以考虑将工具函数按以下分类组织：

### 字符串处理
- `formatString()` - 字符串格式化
- `truncateText()` - 文本截断
- `slugify()` - 生成 URL 友好的 slug

### 日期时间
- `formatDate()` - 日期格式化
- `relativeTime()` - 相对时间（如"2小时前"）
- `isValidDate()` - 验证日期有效性

### 数字处理
- `formatNumber()` - 数字格式化
- `clamp()` - 限制数值范围
- `roundDecimal()` - 小数舍入

### 数组/对象操作
- `deepClone()` - 深拷贝
- `mergeObjects()` - 对象合并
- `groupBy()` - 数组分组

### 验证函数
- `isEmail()` - 邮箱验证
- `isUrl()` - URL 验证
- `isEmpty()` - 空值检查

### 浏览器/环境
- `getBrowserInfo()` - 浏览器信息
- `isMobile()` - 移动端检测
- `getQueryParam()` - 获取 URL 查询参数

### 文件处理
- `formatFileSize()` - 文件大小格式化
- `getFileExtension()` - 获取文件扩展名
- `validateFileType()` - 验证文件类型

## 最佳实践

### 1. 函数设计
- 保持函数小而专注
- 使用明确的函数名
- 提供完整的 JSDoc 注释
- 定义清晰的参数和返回值类型

### 2. 错误处理
- 使用 TypeScript 类型保护
- 提供合理的默认值
- 记录但不抛出非关键错误

### 3. 性能考虑
- 避免在循环中创建函数
- 使用记忆化优化重复计算
- 懒加载重型工具

### 4. 测试策略
- 为每个工具函数编写单元测试
- 测试边界情况和错误场景
- 确保纯函数的确定性

## 扩展指南

### 添加新工具函数
1. 根据功能分类创建文件或添加到现有文件
2. 使用 JSDoc 格式注释
3. 编写完整的类型定义
4. 添加单元测试
5. 更新此 README 文档

### 函数示例模板
```typescript
/**
 * 函数描述
 * 
 * @param param1 - 参数1说明
 * @param param2 - 参数2说明（可选）
 * @returns 返回值说明
 * @example
 * ```typescript
 * const result = functionName(value1, value2);
 * ```
 */
export function functionName(param1: Type1, param2?: Type2): ReturnType {
  // 函数实现
}
```

## 测试指南

### 单元测试结构
```typescript
import { formatDate } from './dateUtils';

describe('formatDate', () => {
  test('应该正确格式化日期', () => {
    const date = new Date('2026-03-31');
    const result = formatDate(date, 'YYYY-MM-DD');
    expect(result).toBe('2026-03-31');
  });

  test('应该处理无效日期', () => {
    const result = formatDate(new Date('invalid'), 'YYYY-MM-DD');
    expect(result).toBe('Invalid Date');
  });
});
```

### 测试覆盖范围
- 正常用例
- 边界用例
- 错误处理
- 性能基准（如有必要）

## 与 React 集成

### 自定义 Hook 包装
```typescript
import { useState, useEffect } from 'react';

export function useFormattedDate(date: Date, format: string) {
  const [formatted, setFormatted] = useState('');

  useEffect(() => {
    const result = formatDate(date, format);
    setFormatted(result);
  }, [date, format]);

  return formatted;
}
```

### 上下文工具
```typescript
import { createContext, useContext } from 'react';

const UtilsContext = createContext<UtilsApi>(null);

export function useUtils() {
  const utils = useContext(UtilsContext);
  if (!utils) {
    throw new Error('useUtils必须在UtilsProvider内使用');
  }
  return utils;
}
```

## 性能监控

### 关键指标
- 函数执行时间
- 内存使用情况
- 调用频率

### 优化建议
- 对频繁调用的函数进行性能分析
- 使用 Web Workers 处理密集型计算
- 实现渐进式增强策略