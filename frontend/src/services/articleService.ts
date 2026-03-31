import { BaseService, simulateDelay } from './baseService';
import { Article, ApiResponse, QueryParams, ArticleFormData } from '../types';

export class ArticleService extends BaseService {
  async getArticles(params?: QueryParams): Promise<ApiResponse<Article[]>> {
    await simulateDelay();
    
    // 模拟API响应
    const articles = await import('../data/articles.json');
    let filteredArticles = articles.default as Article[];

    // 应用筛选条件
    if (params?.search) {
      const searchTerm = params.search.toLowerCase();
      filteredArticles = filteredArticles.filter(article =>
        article.title.toLowerCase().includes(searchTerm) ||
        article.excerpt.toLowerCase().includes(searchTerm) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    if (params?.tags && params.tags.length > 0) {
      filteredArticles = filteredArticles.filter(article =>
        params.tags!.some(tag => article.tags.includes(tag))
      );
    }

    // 应用排序
    if (params?.sortBy) {
      filteredArticles.sort((a, b) => {
        const order = params.sortOrder === 'desc' ? -1 : 1;
        if (params.sortBy === 'createdAt') {
          return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * order;
        }
        if (params.sortBy === 'views') {
          return (a.views - b.views) * order;
        }
        if (params.sortBy === 'likes') {
          return (a.likes - b.likes) * order;
        }
        return 0;
      });
    }

    // 应用分页
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return this.paginatedResponse(
      filteredArticles.slice(startIndex, endIndex),
      page,
      limit,
      filteredArticles.length
    );
  }

  async getArticle(id: number): Promise<ApiResponse<Article>> {
    await simulateDelay();
    
    const articles = await import('../data/articles.json');
    const rawArticle = (articles.default as Article[]).find(a => a.id === id);

    if (!rawArticle) {
      return this.errorResponse('文章不存在');
    }

    const article: Article = { ...rawArticle };

    return this.successResponse(article);
  }

  async createArticle(data: ArticleFormData): Promise<ApiResponse<Article>> {
    await simulateDelay();
    
    // 模拟创建文章
    const newArticle: Article = {
      id: Date.now(),
      ...data,
      author: {
        id: 'current_user',
        name: '当前用户',
        avatar: 'current_user_avatar',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      headings: [],
      views: 0,
      likes: 0,
      commentsCount: 0,
      readTime: Math.ceil(data.content.length / 1000), // 估算阅读时间
    };

    return this.successResponse(newArticle, '文章创建成功');
  }

  async updateArticle(id: number, data: Partial<ArticleFormData>): Promise<ApiResponse<Article>> {
    await simulateDelay();
    
    const articles = await import('../data/articles.json');
    const articleIndex = (articles.default as Article[]).findIndex(a => a.id === id);

    if (articleIndex === -1) {
      return this.errorResponse('文章不存在');
    }

    const updatedArticle: Article = {
      ...articles.default[articleIndex],
      ...data,
      updatedAt: new Date().toISOString(),
      status: (data.status as Article['status']) || articles.default[articleIndex].status,
    };

    return this.successResponse(updatedArticle, '文章更新成功');
  }

  async deleteArticle(id: number): Promise<ApiResponse<void>> {
    await simulateDelay();
    
    return this.successResponse(undefined, '文章删除成功');
  }
}

// 导出默认实例
export const articleService = new ArticleService();