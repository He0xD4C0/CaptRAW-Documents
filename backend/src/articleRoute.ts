import { Router, Request, Response } from 'express';
import { articleService } from './services/articleService';

export function createArticleRouter(): Router {
  const router = Router();

  /**
   * 获取文章列表
   * GET /api/articles
   * Query params: 
   * - limit (default: 10)
   * - offset (default: 0)
   * - search (optional)
   * - tags (optional, comma separated)
   * - status (optional, default: published)
   * - is_featured (optional)
   * - sortBy (optional: release_time, views, likes, created_at)
   * - sortOrder (optional: asc, desc)
   */
  router.get('/', async (req: Request, res: Response) => {
    try {
      const {
        limit = '10',
        offset = '0',
        search,
        tags,
        status = 'published',
        is_featured,
        sortBy = 'release_time',
        sortOrder = 'desc',
      } = req.query;

      // 解析查询参数
      const params = {
        limit: parseInt(limit as string, 10),
        offset: parseInt(offset as string, 10),
        search: search as string | undefined,
        tags: tags ? (tags as string).split(',') : undefined,
        status: status as string,
        is_featured: is_featured !== undefined ? is_featured === 'true' : undefined,
        sortBy: sortBy as 'release_time' | 'views' | 'likes' | 'created_at',
        sortOrder: sortOrder as 'asc' | 'desc',
      };

      const result = await articleService.getArticles(params);
      
      res.json({
        success: true,
        data: result.articles,
        pagination: result.pagination,
      });
    } catch (error) {
      console.error('获取文章列表失败:', error);
      res.status(500).json({ success: false, error: '获取文章列表失败' });
    }
  });

  /**
   * 获取文章详情
   * GET /api/articles/:id
   */
  router.get('/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const articleId = Array.isArray(id) ? id[0] : id;
      const article = await articleService.getArticle(articleId);

      if (!article) {
        return res.status(404).json({ success: false, error: '文章不存在' });
      }

      res.json({ success: true, data: article });
    } catch (error) {
      console.error('获取文章详情失败:', error);
      res.status(500).json({ success: false, error: '获取文章详情失败' });
    }
  });

  /**
   * 创建文章（需要认证）
   * POST /api/articles
   */
  router.post('/', async (req: Request, res: Response) => {
    try {
      // 简单的权限检查（后续可替换为JWT验证）
      const isAuthenticated = req.headers['x-user-id'] !== undefined;
      if (!isAuthenticated) {
        return res.status(401).json({ success: false, error: '需要登录后才能创建文章' });
      }

      const articleData = req.body;
      
      // 验证必需字段
      if (!articleData.article_title || !articleData.article_content || !articleData.author_id) {
        return res.status(400).json({ 
          success: false, 
          error: '文章标题、内容和作者ID是必填项' 
        });
      }

      // 设置默认值
      const fullArticleData = {
        ...articleData,
        release_time: articleData.release_time || new Date().toISOString(),
        status: articleData.status || 'draft',
        read_time: articleData.read_time || Math.ceil(articleData.article_content.length / 1000),
        is_featured: articleData.is_featured || false,
        tags: articleData.tags || [],
      };

      const article = await articleService.createArticle(fullArticleData);
      res.status(201).json({ success: true, data: article, message: '文章创建成功' });
    } catch (error) {
      console.error('创建文章失败:', error);
      res.status(500).json({ success: false, error: '创建文章失败' });
    }
  });

  /**
   * 更新文章（需要认证）
   * PUT /api/articles/:id
   */
  router.put('/:id', async (req: Request, res: Response) => {
    try {
      // 简单的权限检查
      const isAuthenticated = req.headers['x-user-id'] !== undefined;
      if (!isAuthenticated) {
        return res.status(401).json({ success: false, error: '需要登录后才能更新文章' });
      }

      const { id } = req.params;
      const articleId = Array.isArray(id) ? id[0] : id;
      const articleData = req.body;

      const article = await articleService.updateArticle(articleId, articleData);

      if (!article) {
        return res.status(404).json({ success: false, error: '文章不存在' });
      }

      res.json({ success: true, data: article, message: '文章更新成功' });
    } catch (error) {
      console.error('更新文章失败:', error);
      res.status(500).json({ success: false, error: '更新文章失败' });
    }
  });

  /**
   * 删除文章（需要认证）
   * DELETE /api/articles/:id
   */
  router.delete('/:id', async (req: Request, res: Response) => {
    try {
      // 简单的权限检查
      const isAuthenticated = req.headers['x-user-id'] !== undefined;
      if (!isAuthenticated) {
        return res.status(401).json({ success: false, error: '需要登录后才能删除文章' });
      }

      const { id } = req.params;
      const articleId = Array.isArray(id) ? id[0] : id;
      const deleted = await articleService.deleteArticle(articleId);

      if (!deleted) {
        return res.status(404).json({ success: false, error: '文章不存在' });
      }

      res.json({ success: true, message: '文章删除成功' });
    } catch (error) {
      console.error('删除文章失败:', error);
      res.status(500).json({ success: false, error: '删除文章失败' });
    }
  });

  /**
   * 点赞文章（需要认证）
   * POST /api/articles/:id/like
   */
  router.post('/:id/like', async (req: Request, res: Response) => {
    try {
      // 简单的权限检查
      const isAuthenticated = req.headers['x-user-id'] !== undefined;
      if (!isAuthenticated) {
        return res.status(401).json({ success: false, error: '需要登录后才能点赞文章' });
      }

      const { id } = req.params;
      const articleId = Array.isArray(id) ? id[0] : id;
      const { like = true } = req.body;

      const result = await articleService.likeArticle(articleId, like);

      if (!result.success) {
        return res.status(404).json({ success: false, error: '文章不存在' });
      }

      res.json({ 
        success: true, 
        message: like ? '点赞成功' : '取消点赞成功',
        delta: result.delta,
      });
    } catch (error) {
      console.error('点赞文章失败:', error);
      res.status(500).json({ success: false, error: '点赞文章失败' });
    }
  });

  /**
   * 获取热门文章
   * GET /api/articles/popular
   */
  router.get('/popular', async (req: Request, res: Response) => {
    try {
      const { limit = '5' } = req.query;
      const articles = await articleService.getPopularArticles(parseInt(limit as string, 10));
      
      res.json({ success: true, data: articles });
    } catch (error) {
      console.error('获取热门文章失败:', error);
      res.status(500).json({ success: false, error: '获取热门文章失败' });
    }
  });

  /**
   * 获取精选文章
   * GET /api/articles/featured
   */
  router.get('/featured', async (req: Request, res: Response) => {
    try {
      const { limit = '5' } = req.query;
      const articles = await articleService.getFeaturedArticles(parseInt(limit as string, 10));
      
      res.json({ success: true, data: articles });
    } catch (error) {
      console.error('获取精选文章失败:', error);
      res.status(500).json({ success: false, error: '获取精选文章失败' });
    }
  });

  /**
   * 根据标签获取文章
   * GET /api/articles/tag/:tag
   */
  router.get('/tag/:tag', async (req: Request, res: Response) => {
    try {
      const { tag } = req.params;
      const tagStr = Array.isArray(tag) ? tag[0] : tag;
      const { limit = '10' } = req.query;
      const articles = await articleService.getArticlesByTag(tagStr, parseInt(limit as string, 10));
      
      res.json({ success: true, data: articles });
    } catch (error) {
      console.error('根据标签获取文章失败:', error);
      res.status(500).json({ success: false, error: '根据标签获取文章失败' });
    }
  });

  /**
   * 搜索文章
   * GET /api/articles/search
   */
  router.get('/search', async (req: Request, res: Response) => {
    try {
      const { q, limit = '10' } = req.query;

      if (!q || (q as string).trim() === '') {
        return res.status(400).json({ success: false, error: '搜索关键词不能为空' });
      }

      const articles = await articleService.searchArticles(q as string, parseInt(limit as string, 10));
      
      res.json({ success: true, data: articles });
    } catch (error) {
      console.error('搜索文章失败:', error);
      res.status(500).json({ success: false, error: '搜索文章失败' });
    }
  });

  return router;
}