# 组件目录说明

此目录包含 CaptRAW Documents 前端应用的所有 React 组件。

## 目录结构

### `layout/` - 布局组件
- `Layout.tsx` - 应用主布局，包含 Header 和 Footer
- `Header.tsx` - 顶部导航栏，包含主题切换和用户菜单
- `Footer.tsx` - 页脚组件，显示版权信息和社区链接

### `home/` - 首页组件
- `BannerCarousel.tsx` - 横幅轮播组件，支持自动轮播和手动控制
- `NoticeBoard.tsx` - 公告板组件，显示最新公告列表
- `ArticleTimeline.tsx` - 文章时间线组件，分页显示文章卡片

### `ui/` - 通用 UI 组件
- `AssetImage.tsx` - 资产图片组件，支持签名 URL 和占位图
- `ThemeToggle.tsx` - 主题切换按钮（深色/浅色模式）
- `UserAvatar.tsx` - 用户头像组件，显示用户头像和联邦信息

### `articles/` - 文章相关组件
- `ArticleCard.tsx` - 文章卡片组件，显示文章摘要信息

### `shared/` - 共享组件
- （当前为空）预留目录，用于跨组件共享的 UI 元素

## 组件设计原则

1. **单一职责**：每个组件只负责一个特定的功能
2. **可复用性**：组件设计时应考虑在不同场景下的复用
3. **类型安全**：所有组件都使用 TypeScript 类型定义
4. **响应式设计**：支持移动端和桌面端显示
5. **无障碍访问**：遵循 WAI-ARIA 标准，支持键盘导航

## 组件使用示例

### 布局组件

```tsx
import { Layout } from './layout/Layout';

function App() {
  return (
    <Layout>
      {/* 页面内容 */}
    </Layout>
  );
}
```

### 主题切换

```tsx
import { ThemeToggle } from './ui/ThemeToggle';

function Header() {
  return (
    <header>
      <ThemeToggle />
    </header>
  );
}
```

### 资产图片

```tsx
import { AssetImage } from './ui/AssetImage';

function UserProfile() {
  return (
    <AssetImage
      kind="user"
      uuid="user_menu_avatar"
      alt="用户头像"
      className="rounded-full"
    />
  );
}
```

## 组件开发指南

1. **创建新组件**：
   - 在合适的目录中创建组件文件
   - 使用 `.tsx` 扩展名
   - 使用函数式组件和 Hooks

2. **组件结构**：
   - 导入必要的依赖
   - 定义 Props 接口
   - 实现组件逻辑
   - 导出组件

3. **样式约定**：
   - 使用 Tailwind CSS 类名
   - 避免内联样式
   - 支持通过 `className` prop 传递自定义样式

## 数据流

- 组件通过 Props 接收数据
- 使用 Context API 传递主题状态
- 通过自定义 Hooks 获取远程数据
- 使用 React Query 管理服务端状态

## 测试

- 每个组件都应包含单元测试
- 使用 React Testing Library
- 测试交互行为和渲染输出

## 性能优化

- 使用 `React.memo` 避免不必要的重渲染
- 懒加载大型组件
- 虚拟滚动长列表
- 图片懒加载和优化