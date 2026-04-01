# CaptRAW Documents - 前端项目

## 项目概述
这是一个基于React + TypeScript + Tailwind CSS的博客系统前端项目。

## 已完成的功能

### ✅ 项目基础架构
- 完整的monorepo项目结构
- React 19 + TypeScript开发环境
- Tailwind CSS v3.4样式系统
- 模块化的API服务架构
- 统一的YAML配置管理

### ✅ 布局系统
- Layout组件（Header + Footer + 主内容区）
- Header组件：导航栏、主题切换、用户菜单
- Footer组件：版权信息、社区链接
- 响应式设计，支持移动端和桌面端
- 深色/浅色主题系统，支持系统主题检测

### ✅ 主页功能模块
- HomePage：集成所有主页组件
- BannerCarousel：自动轮播（3秒间隔）、手动控制、暂停功能
- NoticeBoard：公告列表、用户头像显示、懒加载
- ArticleTimeline：文章卡片网格、分页加载、标签显示

### ✅ 配置管理系统
- 运行时配置加载（window.runtimeConfig）
- 类型安全的配置访问（runtimeConfig.ts）
- URL配置管理（urls.ts）
- 配置同步脚本（scripts/sync-config.js）
- ConfigGate组件：配置加载状态管理

### ✅ 数据层和服务架构
- 模块化API服务（articleService, noticeService, bannerService等）
- 基础服务类（BaseService）
- React Query集成，支持缓存和状态管理
- 自定义Hooks（useArticles, useAssetUrl, useBanners等）

### ✅ UI组件库
- AssetImage：智能资产图片组件，支持签名URL和占位图
- ThemeToggle：主题切换按钮
- UserAvatar：用户头像组件，支持联邦用户名显示
- 文章卡片组件（ArticleCard）

### ✅ 资产管理系统
- 资产URL工具函数（assetUrl.ts）
- 支持签名URL和公共URL两种策略
- 开发模式占位图支持
- 与后端资产签名服务集成

## 技术栈
- **前端框架**: React 19.2.4 + TypeScript 4.9.5
- **路由**: React Router DOM 7.13.2
- **状态管理**: @tanstack/react-query 5.95.2
- **样式**: Tailwind CSS 3.4.19
- **HTTP客户端**: Axios 1.14.0
- **构建工具**: Create React App 5.0.1
- **配置管理**: js-yaml 4.1.1
- **测试**: React Testing Library, Jest

## 项目结构
```
frontend/
├── src/
│   ├── components/
│   │   ├── layout/           # 布局组件
│   │   │   ├── Layout.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── ui/              # 通用UI组件
│   │   │   ├── AssetImage.tsx
│   │   │   ├── ThemeToggle.tsx
│   │   │   └── UserAvatar.tsx
│   │   ├── home/            # 主页组件
│   │   │   ├── BannerCarousel.tsx
│   │   │   ├── NoticeBoard.tsx
│   │   │   └── ArticleTimeline.tsx
│   │   ├── articles/        # 文章组件
│   │   │   └── ArticleCard.tsx
│   │   └── shared/          # 共享组件（预留）
│   ├── pages/              # 页面组件
│   │   └── HomePage.tsx
│   ├── hooks/              # 自定义Hooks
│   │   ├── useArticles.ts
│   │   ├── useAssetUrl.ts
│   │   ├── useBanners.ts
│   │   ├── useNotices.ts
│   │   └── useTags.ts
│   ├── services/           # API服务
│   │   ├── baseService.ts
│   │   ├── articleService.ts
│   │   ├── noticeService.ts
│   │   ├── bannerService.ts
│   │   ├── tagService.ts
│   │   ├── authService.ts
│   │   ├── fileService.ts
│   │   ├── api.ts
│   │   └── index.ts
│   ├── config/             # 配置模块
│   │   ├── runtimeConfig.ts
│   │   └── urls.ts
│   ├── data/               # 静态数据
│   │   ├── articles.json
│   │   ├── banners.json
│   │   ├── notices.json
│   │   └── assetMockMap.ts
│   ├── types/              # TypeScript类型定义
│   │   └── index.ts
│   ├── utils/              # 工具函数
│   │   └── assetUrl.ts
│   ├── App.tsx             # 应用根组件
│   ├── App.css
│   ├── index.tsx           # 入口文件
│   └── index.css
├── public/                 # 静态资源
├── scripts/                # 构建脚本
│   └── sync-config.js      # 配置同步脚本
├── tailwind.config.js      # Tailwind配置
├── postcss.config.js       # PostCSS配置
└── package.json            # 依赖配置
```

## 运行项目

### 开发环境
```bash
npm start
```
应用将在 http://localhost:3000 启动

### 生产构建
```bash
npm run build
```

### 测试
```bash
npm test
```

## 核心特性

### 1. 主题系统
- 支持深色/浅色主题切换
- 主题偏好保存在localStorage
- 自动检测系统主题偏好

### 2. 响应式设计
- 移动端友好的导航菜单
- 自适应布局
- 断点优化

### 3. 性能优化
- 图片懒加载
- 组件懒加载
- 虚拟滚动（计划中）
- 代码分割

### 4. 用户体验
- 平滑的动画过渡
- 直观的导航结构
- 无障碍访问支持
- 键盘导航支持

## 下一步计划

### 文章系统
- [ ] ArticlePage：文章详情页面，支持Markdown渲染
- [ ] ArticleListPage：文章列表页面，支持筛选和排序
- [ ] MarkdownRenderer：Markdown渲染组件，支持语法高亮
- [ ] CommentSection：评论组件，支持嵌套评论和反应

### 用户认证
- [ ] LoginPage：登录页面，支持OAuth2
- [ ] RegisterPage：注册页面
- [ ] ProfilePage：用户个人资料页面
- [ ] SettingsPage：用户设置页面

### 搜索和发现
- [ ] SearchPage：搜索页面，支持全文搜索
- [ ] DirectoryPage：目录页面，按分类浏览
- [ ] TagPage：标签页面，显示标签相关文章

### 管理功能
- [ ] AdminDashboard：管理员仪表板
- [ ] ArticleManagement：文章管理界面
- [ ] UserManagement：用户管理界面
- [ ] ContentManagement：内容管理界面

### 增强功能
- [ ] 404页面和错误处理
- [ ] 加载状态和骨架屏
- [ ] 离线支持
- [ ] PWA功能
- [ ] 多语言支持

## 开发规范
- 使用TypeScript进行类型检查
- 遵循React Hooks最佳实践
- 使用ESLint进行代码质量检查
- 组件使用函数式组件
- 样式使用Tailwind CSS工具类

## 许可证
本项目采用MIT许可证。

---

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).