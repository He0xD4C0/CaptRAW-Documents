# CaptRAW Documents - 前端项目

## 项目概述
这是一个基于React + TypeScript + Tailwind CSS的博客系统前端项目。

## 已完成的功能

### 第1天：项目初始化与基础架构 ✅
- [x] 创建项目结构
- [x] 初始化React TypeScript项目
- [x] 安装核心依赖：
  - react-router-dom
  - axios
  - @tanstack/react-query
  - tailwindcss v4
  - postcss
  - autoprefixer
- [x] 配置Tailwind CSS v4
- [x] 创建项目目录结构

### 第2天：布局组件开发 ✅
- [x] 创建Layout组件
- [x] 创建Header组件
  - 基于伪代码实现导航栏
  - 深色/浅色主题切换按钮
  - 用户头像下拉菜单
  - 响应式设计
- [x] 创建Footer组件
  - 页脚内容
  - 版权信息
  - 社区链接
- [x] 创建主题切换功能
  - 主题上下文
  - 本地存储主题偏好

### 第3天：主页组件开发 ✅
- [x] 创建HomePage组件
- [x] 创建BannerCarousel组件
  - 自动轮播（3秒）
  - 左右翻页按钮
  - 横幅卡片
  - 支持暂停轮播
- [x] 创建NoticeBoard组件
  - 公告卡片列表
  - 用户头像显示
  - 点击跳转
  - 懒加载功能
- [x] 创建ArticleTimeline组件
  - 文章卡片网格
  - 分页加载
  - 标签显示
  - 懒加载功能

## 技术栈
- **前端框架**: React 18 + TypeScript
- **路由**: React Router DOM
- **样式**: Tailwind CSS v4
- **状态管理**: React Query (TanStack Query)
- **构建工具**: Create React App
- **HTTP客户端**: Axios

## 项目结构
```
frontend/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── ui/
│   │   │   ├── ThemeToggle.tsx
│   │   │   └── UserAvatar.tsx
│   │   └── home/
│   │       ├── BannerCarousel.tsx
│   │       ├── NoticeBoard.tsx
│   │       └── ArticleTimeline.tsx
│   ├── pages/
│   │   └── HomePage.tsx
│   ├── hooks/
│   ├── services/
│   ├── utils/
│   ├── types/
│   ├── assets/
│   ├── App.tsx
│   └── index.css
├── public/
├── tailwind.config.js
├── postcss.config.js
└── package.json
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

### 第4天：文章相关页面
- [ ] 创建ArticlePage组件
- [ ] 创建ArticleCard组件
- [ ] 创建MarkdownRenderer组件
- [ ] 创建CommentSection组件

### 第5天：用户认证页面
- [ ] 创建LoginPage组件
- [ ] 创建RegisterPage组件
- [ ] 创建ProfilePage组件
- [ ] 创建SettingsPage组件

### 第6天：管理页面
- [ ] 创建AdminDashboard组件
- [ ] 创建ArticleManagement组件
- [ ] 创建NoticeManagement组件
- [ ] 创建BannerManagement组件

### 第7天：投稿与搜索功能
- [ ] 创建SubmitArticlePage组件
- [ ] 创建DirectoryPage组件
- [ ] 创建SearchPage组件
- [ ] 创建404页面和加载状态

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