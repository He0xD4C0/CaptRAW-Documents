# 页面组件目录说明

此目录包含 CaptRAW Documents 前端应用的页面级 React 组件。

## 当前页面

### `HomePage.tsx` - 首页
应用的主页，展示核心内容和功能入口。

**功能特性：**
- 横幅轮播展示（BannerCarousel）
- 公告板显示最新公告（NoticeBoard）
- 文章时间线展示最新文章（ArticleTimeline）
- 响应式布局适配不同设备

**路由路径：** `/`

**使用示例：**
```tsx
import { HomePage } from './pages/HomePage';

// 在路由配置中使用
<Route path="/" element={<HomePage />} />
```

## 页面设计原则

### 1. 页面 vs 组件
- **页面**：对应路由的顶级组件，管理页面级状态和布局
- **组件**：可复用的 UI 元素，不直接绑定路由

### 2. 职责划分
- 页面负责数据获取和状态管理
- 页面协调子组件的组合和交互
- 页面处理路由参数和查询字符串

### 3. 性能优化
- 使用懒加载减少初始包大小
- 实现代码分割按需加载
- 预加载关键资源

## 页面开发指南

### 基础页面结构
```tsx
import React from 'react';
import { Layout } from '../components/layout/Layout';
import { PageHeader } from '../components/ui/PageHeader';

interface HomePageProps {
  // 页面 Props 定义
}

const HomePage: React.FC<HomePageProps> = () => {
  // 页面状态和逻辑
  
  return (
    <Layout>
      <PageHeader 
        title="首页" 
        description="欢迎来到 CaptRAW Documents"
      />
      
      {/* 页面内容 */}
      <main className="container mx-auto px-4 py-8">
        {/* 子组件组合 */}
      </main>
    </Layout>
  );
};

export default HomePage;
```

### 数据获取模式
```tsx
import { useArticles, useBanners, useNotices } from '../hooks';

const HomePage: React.FC = () => {
  // 使用自定义 Hooks 获取数据
  const { data: articles, isLoading: articlesLoading } = useArticles();
  const { data: banners } = useBanners();
  const { data: notices } = useNotices();

  if (articlesLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Layout>
      {/* 渲染数据 */}
    </Layout>
  );
};
```

## 路由集成

### 路由配置示例
```tsx
import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ArticlePage from './pages/ArticlePage';
import LoginPage from './pages/LoginPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'articles/:id',
        element: <ArticlePage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
    ],
  },
]);
```

### 路由参数处理
```tsx
import { useParams } from 'react-router-dom';

const ArticlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // 使用文章 ID 获取数据
  const { data: article } = useArticle(id!);
  
  return (
    // 页面内容
  );
};
```

## 状态管理

### 页面级状态
```tsx
import { useState, useEffect } from 'react';

const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // 搜索逻辑
  const handleSearch = async () => {
    setIsSearching(true);
    const results = await searchService.search(searchQuery);
    setSearchResults(results);
    setIsSearching(false);
  };

  return (
    // 页面内容
  );
};
```

### 上下文共享
```tsx
import { createContext, useContext, useState } from 'react';

// 创建页面上下文
const PageContext = createContext<PageContextType>(null);

const PageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pageState, setPageState] = useState<PageState>(initialState);

  return (
    <PageContext.Provider value={{ pageState, setPageState }}>
      {children}
    </PageContext.Provider>
  );
};

// 在页面中使用
const MyPage: React.FC = () => {
  return (
    <PageProvider>
      <PageContent />
    </PageProvider>
  );
};
```

## 错误处理

### 错误边界集成
```tsx
import { ErrorBoundary } from '../components/shared/ErrorBoundary';

const App: React.FC = () => {
  return (
    <ErrorBoundary fallback={<ErrorPage />}>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
};

// 页面级错误处理
const ArticlePage: React.FC = () => {
  const { id } = useParams();
  const { data: article, error, isLoading } = useArticle(id!);

  if (error) {
    return <ErrorState message="加载文章失败" />;
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    // 正常渲染
  );
};
```

## 性能优化

### 懒加载页面
```tsx
import { lazy, Suspense } from 'react';

// 懒加载页面组件
const ArticlePage = lazy(() => import('./pages/ArticlePage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));

// 使用 Suspense 包装
<Suspense fallback={<LoadingSpinner />}>
  <ArticlePage />
</Suspense>
```

### 预加载策略
```tsx
// 鼠标悬停时预加载
const handleMouseEnter = () => {
  import('./pages/ArticlePage');
};

<Link 
  to="/articles" 
  onMouseEnter={handleMouseEnter}
>
  查看文章
</Link>
```

## 测试策略

### 页面测试要点
```typescript
describe('HomePage', () => {
  test('应该渲染主要组件', () => {
    render(<HomePage />);
    
    expect(screen.getByTestId('banner-carousel')).toBeInTheDocument();
    expect(screen.getByTestId('notice-board')).toBeInTheDocument();
    expect(screen.getByTestId('article-timeline')).toBeInTheDocument();
  });

  test('应该显示加载状态', () => {
    // 模拟加载状态
    jest.spyOn(hooks, 'useArticles').mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    render(<HomePage />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
});
```

## 待开发页面

根据项目规划，以下页面有待开发：

### 文章相关页面
- `ArticlePage.tsx` - 文章详情页
- `ArticleListPage.tsx` - 文章列表页
- `SubmitArticlePage.tsx` - 投稿页面

### 用户相关页面
- `LoginPage.tsx` - 登录页面
- `RegisterPage.tsx` - 注册页面
- `ProfilePage.tsx` - 用户资料页
- `SettingsPage.tsx` - 设置页面

### 功能页面
- `SearchPage.tsx` - 搜索页面
- `DirectoryPage.tsx` - 目录页面
- `TagPage.tsx` - 标签页面

### 管理页面
- `AdminDashboard.tsx` - 管理仪表板
- `ArticleManagementPage.tsx` - 文章管理
- `UserManagementPage.tsx` - 用户管理

## 页面模板

### 基础页面模板
```tsx
import React from 'react';
import { Layout } from '../components/layout/Layout';

interface TemplatePageProps {
  title: string;
  children: React.ReactNode;
}

const TemplatePage: React.FC<TemplatePageProps> = ({ title, children }) => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{title}</h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          {children}
        </div>
      </div>
    </Layout>
  );
};

export default TemplatePage;
```

### 表单页面模板
```tsx
import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { Form, Input, Button } from '../components/ui/FormElements';

const FormPageTemplate: React.FC = () => {
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // 提交逻辑
    setIsSubmitting(false);
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto py-8">
        <Form onSubmit={handleSubmit}>
          {/* 表单字段 */}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? '提交中...' : '提交'}
          </Button>
        </Form>
      </div>
    </Layout>
  );
};
```

## 样式指南

### 页面样式约定
- 使用 Tailwind CSS 工具类
- 保持一致的间距和排版
- 遵循响应式设计原则
- 支持深色/浅色主题

### 容器布局
```tsx
// 标准页面容器
<div className="container mx-auto px-4 py-8">
  {/* 页面内容 */}
</div>

// 全宽页面
<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
  {/* 全宽内容 */}
</div>
```

## 无障碍访问

### 页面语义化
```tsx
<main role="main">
  <h1>页面标题</h1>
  <section aria-labelledby="section-title">
    <h2 id="section-title">分区标题</h2>
    {/* 分区内容 */}
  </section>
</main>
```

### 键盘导航
- 确保所有交互元素可通过键盘访问
- 提供清晰的焦点状态
- 实现跳过导航链接