import { Router, Request, Response } from 'express';
import { bannerService } from './services/bannerService';

export function createBannerRouter(): Router {
  const router = Router();

  /**
   * 获取横幅列表（默认为活跃横幅）
   * GET /api/banners
   * Query params:
   * - limit (optional)
   * - offset (optional, default: 0)
   * - is_active (optional, default: true)
   */
  router.get('/', async (req: Request, res: Response) => {
    try {
      const {
        limit,
        offset = '0',
        is_active = 'true',
      } = req.query;

      const params = {
        limit: limit ? parseInt(limit as string, 10) : undefined,
        offset: parseInt(offset as string, 10),
        is_active: is_active === 'true',
      };

      const banners = await bannerService.getBanners(params);
      
      res.json({
        success: true,
        data: banners,
      });
    } catch (error) {
      console.error('获取横幅列表失败:', error);
      res.status(500).json({ success: false, error: '获取横幅列表失败' });
    }
  });

  /**
   * 获取所有横幅（包括非活跃的）
   * GET /api/banners/all
   */
  router.get('/all', async (req: Request, res: Response) => {
    try {
      const { limit = '50', offset = '0' } = req.query;
      
      const result = await bannerService.getAllBanners(
        parseInt(limit as string, 10),
        parseInt(offset as string, 10)
      );
      
      res.json({
        success: true,
        data: result.banners,
        pagination: result.pagination,
      });
    } catch (error) {
      console.error('获取所有横幅失败:', error);
      res.status(500).json({ success: false, error: '获取所有横幅失败' });
    }
  });

  /**
   * 获取横幅详情
   * GET /api/banners/:id
   */
  router.get('/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const bannerId = Array.isArray(id) ? id[0] : id;
      const banner = await bannerService.getBanner(bannerId);

      if (!banner) {
        return res.status(404).json({ success: false, error: '横幅不存在' });
      }

      res.json({ success: true, data: banner });
    } catch (error) {
      console.error('获取横幅详情失败:', error);
      res.status(500).json({ success: false, error: '获取横幅详情失败' });
    }
  });

  /**
   * 创建横幅（需要管理员权限）
   * POST /api/banners
   */
  router.post('/', async (req: Request, res: Response) => {
    try {
      // 简单的权限检查
      const isAdmin = req.headers['x-admin'] === 'true';
      if (!isAdmin) {
        return res.status(403).json({ success: false, error: '需要管理员权限' });
      }

      const bannerData = req.body;
      
      // 验证必需字段
      if (!bannerData.title || !bannerData.image_location) {
        return res.status(400).json({ 
          success: false, 
          error: '横幅标题和图片位置是必填项' 
        });
      }

      // 设置默认值
      const fullBannerData = {
        ...bannerData,
        is_active: bannerData.is_active !== undefined ? bannerData.is_active : true,
        display_order: bannerData.display_order || 0,
        start_time: bannerData.start_time || new Date().toISOString(),
        end_time: bannerData.end_time || null,
      };

      const banner = await bannerService.createBanner(fullBannerData);
      res.status(201).json({ success: true, data: banner, message: '横幅创建成功' });
    } catch (error) {
      console.error('创建横幅失败:', error);
      res.status(500).json({ success: false, error: '创建横幅失败' });
    }
  });

  /**
   * 更新横幅（需要管理员权限）
   * PUT /api/banners/:id
   */
  router.put('/:id', async (req: Request, res: Response) => {
    try {
      // 简单的权限检查
      const isAdmin = req.headers['x-admin'] === 'true';
      if (!isAdmin) {
        return res.status(403).json({ success: false, error: '需要管理员权限' });
      }

      const { id } = req.params;
      const bannerId = Array.isArray(id) ? id[0] : id;
      const bannerData = req.body;

      const banner = await bannerService.updateBanner(bannerId, bannerData);

      if (!banner) {
        return res.status(404).json({ success: false, error: '横幅不存在' });
      }

      res.json({ success: true, data: banner, message: '横幅更新成功' });
    } catch (error) {
      console.error('更新横幅失败:', error);
      res.status(500).json({ success: false, error: '更新横幅失败' });
    }
  });

  /**
   * 删除横幅（需要管理员权限）
   * DELETE /api/banners/:id
   */
  router.delete('/:id', async (req: Request, res: Response) => {
    try {
      // 简单的权限检查
      const isAdmin = req.headers['x-admin'] === 'true';
      if (!isAdmin) {
        return res.status(403).json({ success: false, error: '需要管理员权限' });
      }

      const { id } = req.params;
      const bannerId = Array.isArray(id) ? id[0] : id;
      const deleted = await bannerService.deleteBanner(bannerId);

      if (!deleted) {
        return res.status(404).json({ success: false, error: '横幅不存在' });
      }

      res.json({ success: true, message: '横幅删除成功' });
    } catch (error) {
      console.error('删除横幅失败:', error);
      res.status(500).json({ success: false, error: '删除横幅失败' });
    }
  });

  /**
   * 获取活跃横幅数量
   * GET /api/banners/count/active
   */
  router.get('/count/active', async (_req: Request, res: Response) => {
    try {
      const count = await bannerService.getActiveBannersCount();
      res.json({ success: true, data: { count } });
    } catch (error) {
      console.error('获取活跃横幅数量失败:', error);
      res.status(500).json({ success: false, error: '获取活跃横幅数量失败' });
    }
  });

  /**
   * 更新横幅显示顺序（需要管理员权限）
   * POST /api/banners/order
   */
  router.post('/order', async (req: Request, res: Response) => {
    try {
      // 简单的权限检查
      const isAdmin = req.headers['x-admin'] === 'true';
      if (!isAdmin) {
        return res.status(403).json({ success: false, error: '需要管理员权限' });
      }

      const { orderUpdates } = req.body;

      if (!Array.isArray(orderUpdates) || orderUpdates.length === 0) {
        return res.status(400).json({ 
          success: false, 
          error: 'orderUpdates必须是包含横幅顺序更新的数组' 
        });
      }

      const results = await bannerService.updateBannersOrder(orderUpdates);
      res.json({ success: true, data: results });
    } catch (error) {
      console.error('更新横幅顺序失败:', error);
      res.status(500).json({ success: false, error: '更新横幅顺序失败' });
    }
  });

  /**
   * 激活/停用横幅（需要管理员权限）
   * POST /api/banners/:id/toggle
   */
  router.post('/:id/toggle', async (req: Request, res: Response) => {
    try {
      // 简单的权限检查
      const isAdmin = req.headers['x-admin'] === 'true';
      if (!isAdmin) {
        return res.status(403).json({ success: false, error: '需要管理员权限' });
      }

      const { id } = req.params;
      const bannerId = Array.isArray(id) ? id[0] : id;
      const { active } = req.body;

      if (active === undefined) {
        return res.status(400).json({ 
          success: false, 
          error: 'active字段是必填项' 
        });
      }

      const banner = await bannerService.toggleBannerActive(bannerId, active);

      if (!banner) {
        return res.status(404).json({ success: false, error: '横幅不存在' });
      }

      res.json({ 
        success: true, 
        data: banner,
        message: active ? '横幅已激活' : '横幅已停用'
      });
    } catch (error: any) {
      console.error('切换横幅状态失败:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message || '切换横幅状态失败' 
      });
    }
  });

  /**
   * 获取显示横幅（用于首页轮播）
   * GET /api/banners/display
   */
  router.get('/display', async (req: Request, res: Response) => {
    try {
      const { limit = '10' } = req.query;
      const banners = await bannerService.getDisplayBanners(parseInt(limit as string, 10));
      
      res.json({ success: true, data: banners });
    } catch (error) {
      console.error('获取显示横幅失败:', error);
      res.status(500).json({ success: false, error: '获取显示横幅失败' });
    }
  });

  return router;
}