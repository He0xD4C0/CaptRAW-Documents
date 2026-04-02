import {
  getArticles,
  getArticleById,
  getArticlesCount,
  incrementArticleViews,
  updateArticleLikes,
  createArticle,
  updateArticle,
  deleteArticle,
  ArticleRecord,
  ArticleWithAuthor,
  ArticleQueryParams,
} from '../database/articles';

export class ArticleService {
  /**
   * 获取文章列表（带分页）
   */
  async getArticles(params: ArticleQueryParams = {}) {
    const articles = await getArticles(params);
    const total = await getArticlesCount(params);
    
    return {
      articles,
      pagination: {
        total,
        page: Math.floor((params.offset || 0) / (params.limit || 10)) + 1,
        limit: params.limit || 10,
        totalPages: Math.ceil(total / (params.limit || 10)),
      },
    };
  }

  /**
   * 获取单篇文章详情
   */
  async getArticle(articleUuid: string) {
    const article = await getArticleById(articleUuid);
    
    if (article) {
      // 增加阅读量
      await incrementArticleViews(articleUuid);
    }
    
    return article;
  }

  /**
   * 创建文章
   */
  async createArticle(articleData: Omit<ArticleRecord, 'article_uuid' | 'created_at' | 'updated_at' | 'views' | 'likes' | 'comments_count'>) {
    return await createArticle(articleData);
  }

  /**
   * 更新文章
   */
  async updateArticle(articleUuid: string, articleData: Partial<Omit<ArticleRecord, 'article_uuid' | 'created_at' | 'updated_at' | 'author_id'>>) {
    return await updateArticle(articleUuid, articleData);
  }

  /**
   * 删除文章
   */
  async deleteArticle(articleUuid: string) {
    return await deleteArticle(articleUuid);
  }

  /**
   * 点赞/取消点赞文章
   */
  async likeArticle(articleUuid: string, like: boolean = true) {
    const delta = like ? 1 : -1;
    const success = await updateArticleLikes(articleUuid, delta);
    return { success, delta };
  }

  /**
   * 获取热门文章
   */
  async getPopularArticles(limit: number = 5) {
    const articles = await getArticles({
      limit,
      sortBy: 'views',
      sortOrder: 'desc',
    });
    return articles;
  }

  /**
   * 获取精选文章
   */
  async getFeaturedArticles(limit: number = 5) {
    const articles = await getArticles({
      limit,
      is_featured: true,
    });
    return articles;
  }

  /**
   * 根据标签获取文章
   */
  async getArticlesByTag(tag: string, limit: number = 10) {
    const articles = await getArticles({
      limit,
      tags: [tag],
    });
    return articles;
  }

  /**
   * 搜索文章
   */
  async searchArticles(query: string, limit: number = 10) {
    const articles = await getArticles({
      limit,
      search: query,
    });
    return articles;
  }
}

// 导出默认实例
export const articleService = new ArticleService();