import { Router, Request, Response } from 'express';
import { serverInfoService } from './services/serverInfoService';

export function createServerInfoRouter(): Router {
  const router = Router();

  /**
   * 获取所有公开的服务器配置
   * GET /api/server-info
   */
  router.get('/', async (_req: Request, res: Response) => {
    try {
      const infos = await serverInfoService.getAllPublic();
      res.json({ success: true, data: infos });
    } catch (error) {
      console.error('获取服务器信息失败:', error);
      res.status(500).json({ success: false, error: '获取服务器信息失败' });
    }
  });

  /**
   * 获取运行时配置（前端使用）
   * GET /api/server-info/runtime-config
   */
  router.get('/runtime-config', async (_req: Request, res: Response) => {
    try {
      const config = await serverInfoService.getRuntimeConfig();
      res.json({ success: true, data: config });
    } catch (error) {
      console.error('获取运行时配置失败:', error);
      res.status(500).json({ success: false, error: '获取运行时配置失败' });
    }
  });

  /**
   * 按分类获取服务器配置
   * GET /api/server-info/category/:category
   */
  router.get('/category/:category', async (req: Request, res: Response) => {
    try {
      const { category } = req.params;
      const categoryStr = Array.isArray(category) ? category[0] : category;
      const infos = await serverInfoService.getByCategory(categoryStr);
      res.json({ success: true, data: infos });
    } catch (error) {
      console.error('按分类获取服务器信息失败:', error);
      res.status(500).json({ success: false, error: '按分类获取服务器信息失败' });
    }
  });

  /**
   * 获取特定配置键
   * GET /api/server-info/key/:key
   */
  router.get('/key/:key', async (req: Request, res: Response) => {
    try {
      const { key } = req.params;
      const keyStr = Array.isArray(key) ? key[0] : key;
      const info = await serverInfoService.get(keyStr);
      
      if (!info) {
        return res.status(404).json({ success: false, error: '配置不存在' });
      }
      
      if (!info.is_public) {
        // 检查权限（简单实现，后续可增强）
        const isAdmin = req.headers['x-admin'] === 'true';
        if (!isAdmin) {
          return res.status(403).json({ success: false, error: '无权访问此配置' });
        }
      }
      
      res.json({ success: true, data: info });
    } catch (error) {
      console.error('获取特定配置失败:', error);
      res.status(500).json({ success: false, error: '获取特定配置失败' });
    }
  });

  /**
   * 验证配置完整性
   * GET /api/server-info/validate
   */
  router.get('/validate', async (_req: Request, res: Response) => {
    try {
      const validation = await serverInfoService.validateConfig();
      res.json({ success: true, data: validation });
    } catch (error) {
      console.error('验证配置失败:', error);
      res.status(500).json({ success: false, error: '验证配置失败' });
    }
  });

  /**
   * 管理接口：设置配置（需要管理员权限）
   * POST /api/server-info/admin/set
   */
  router.post('/admin/set', async (req: Request, res: Response) => {
    try {
      // 简单的权限检查
      const isAdmin = req.headers['x-admin'] === 'true';
      if (!isAdmin) {
        return res.status(403).json({ success: false, error: '需要管理员权限' });
      }
      
      const { info_key, info_value, description, is_public, category } = req.body;
      
      if (!info_key || info_value === undefined) {
        return res.status(400).json({ 
          success: false, 
          error: 'info_key 和 info_value 是必填项' 
        });
      }
      
      const info = await serverInfoService.set({
        info_key,
        info_value,
        description,
        is_public,
        category,
      });
      
      res.json({ success: true, data: info });
    } catch (error) {
      console.error('设置配置失败:', error);
      res.status(500).json({ success: false, error: '设置配置失败' });
    }
  });

  /**
   * 管理接口：批量设置配置（需要管理员权限）
   * POST /api/server-info/admin/batch-set
   */
  router.post('/admin/batch-set', async (req: Request, res: Response) => {
    try {
      const isAdmin = req.headers['x-admin'] === 'true';
      if (!isAdmin) {
        return res.status(403).json({ success: false, error: '需要管理员权限' });
      }
      
      const { items } = req.body;
      
      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ 
          success: false, 
          error: 'items 必须是包含配置项的数组' 
        });
      }
      
      const infos = await serverInfoService.setMultiple(items);
      res.json({ success: true, data: infos });
    } catch (error) {
      console.error('批量设置配置失败:', error);
      res.status(500).json({ success: false, error: '批量设置配置失败' });
    }
  });

  /**
   * 管理接口：删除配置（需要管理员权限）
   * DELETE /api/server-info/admin/:key
   */
  router.delete('/admin/:key', async (req: Request, res: Response) => {
    try {
      const isAdmin = req.headers['x-admin'] === 'true';
      if (!isAdmin) {
        return res.status(403).json({ success: false, error: '需要管理员权限' });
      }
      
      const { key } = req.params;
      const keyStr = Array.isArray(key) ? key[0] : key;
      const deleted = await serverInfoService.delete(keyStr);
      
      if (!deleted) {
        return res.status(404).json({ success: false, error: '配置不存在' });
      }
      
      res.json({ success: true, message: '配置删除成功' });
    } catch (error) {
      console.error('删除配置失败:', error);
      res.status(500).json({ success: false, error: '删除配置失败' });
    }
  });

  /**
   * 管理接口：同步配置文件到数据库（需要管理员权限）
   * POST /api/server-info/admin/sync-config
   */
  router.post('/admin/sync-config', async (req: Request, res: Response) => {
    try {
      const isAdmin = req.headers['x-admin'] === 'true';
      if (!isAdmin) {
        return res.status(403).json({ success: false, error: '需要管理员权限' });
      }
      
      const { config } = req.body;
      
      if (!config) {
        return res.status(400).json({ 
          success: false, 
          error: 'config 是必填项' 
        });
      }
      
      const infos = await serverInfoService.syncConfig(config);
      res.json({ 
        success: true, 
        data: infos,
        message: `成功同步 ${infos.length} 个配置项`
      });
    } catch (error) {
      console.error('同步配置失败:', error);
      res.status(500).json({ success: false, error: '同步配置失败' });
    }
  });

  return router;
}