// 用户相关类型
export interface User {
  id: string;
  name: string;
  email?: string;
  avatar: string;
  bio?: string;
  role: 'user' | 'admin' | 'moderator';
  createdAt: string;
  updatedAt: string;
}

// 简化的用户类型（用于文章、公告等）
export interface SimpleUser {
  id: string;
  name: string;
  avatar: string;
}

// 文章相关类型
export interface Article {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: SimpleUser;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  readTime: number;
  coverImage?: string;
  headings: Heading[];
  status: 'draft' | 'published' | 'archived';
  views: number;
  likes: number;
  commentsCount: number;
}

export interface Heading {
  level: number;
  text: string;
}

// 公告相关类型
export interface Notice {
  id: number;
  title: string;
  content: string;
  author: SimpleUser;
  createdAt: string;
  expiresAt?: string;
  link: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
}

// 横幅相关类型
export interface Banner {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  type: 'article' | 'notice' | 'user';
  description?: string;
  order: number;
  isActive: boolean;
  backgroundColor?: string;
}

// 评论相关类型
export interface Comment {
  id: number;
  content: string;
  author: SimpleUser;
  articleId: number;
  parentId?: number;
  createdAt: string;
  updatedAt: string;
  likes: number;
  replies?: Comment[];
}

// 标签相关类型
export interface Tag {
  id: number;
  name: string;
  slug: string;
  description?: string;
  articleCount: number;
}

// API响应类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: Pagination;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// 查询参数类型
export interface QueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  tags?: string[];
  authorId?: string;
  status?: string;
}

// 表单数据类型
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ArticleFormData {
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  coverImage?: string;
  status: 'draft' | 'published';
}

// 主题类型
export type Theme = 'light' | 'dark' | 'system';