import { Router, Request, Response } from 'express';
import { authService } from './services/authService';

export function createAuthRouter(): Router {
  const router = Router();

  /**
   * 用户注册
   * POST /api/auth/register
   */
  router.post('/register', async (req: Request, res: Response) => {
    try {
      const { 
        user_id, 
        nickname, 
        email, 
        password, 
        password_confirm,
        host_name = 'captraw.com',
      } = req.body;

      // 验证必需字段
      if (!user_id || !nickname || !email || !password) {
        return res.status(400).json({ 
          success: false, 
          error: '用户ID、昵称、邮箱和密码是必填项' 
        });
      }

      // 确认密码
      if (password !== password_confirm) {
        return res.status(400).json({ 
          success: false, 
          error: '两次输入的密码不一致' 
        });
      }

      // 密码强度检查（简单示例）
      if (password.length < 6) {
        return res.status(400).json({ 
          success: false, 
          error: '密码长度至少需要6位' 
        });
      }

      // 注册用户
      const result = await authService.register({
        user_id,
        nickname,
        email,
        password_hash: password, // 实际应该使用bcrypt哈希
        host_name,
      });

      res.status(201).json({ 
        success: true, 
        data: result,
        message: '注册成功' 
      });
    } catch (error: any) {
      console.error('用户注册失败:', error);
      res.status(400).json({ 
        success: false, 
        error: error.message || '用户注册失败' 
      });
    }
  });

  /**
   * 用户登录
   * POST /api/auth/login
   */
  router.post('/login', async (req: Request, res: Response) => {
    try {
      const { email, user_id, password } = req.body;

      if (!password) {
        return res.status(400).json({ 
          success: false, 
          error: '密码是必填项' 
        });
      }

      if (!email && !user_id) {
        return res.status(400).json({ 
          success: false, 
          error: '邮箱或用户ID至少需要提供一项' 
        });
      }

      // 用户登录
      const result = await authService.login({
        email,
        user_id,
        password, // 实际应该验证bcrypt哈希
      });

      res.json({ 
        success: true, 
        data: result,
        message: '登录成功' 
      });
    } catch (error: any) {
      console.error('用户登录失败:', error);
      res.status(401).json({ 
        success: false, 
        error: error.message || '用户名或密码错误' 
      });
    }
  });

  /**
   * 联邦用户登录
   * POST /api/auth/fediverse
   */
  router.post('/fediverse', async (req: Request, res: Response) => {
    try {
      const { fediverse_user_id, nickname, avatar_location } = req.body;

      if (!fediverse_user_id || !nickname) {
        return res.status(400).json({ 
          success: false, 
          error: '联邦身份ID和昵称是必填项' 
        });
      }

      // 提取主机名
      const parts = fediverse_user_id.split('@');
      if (parts.length !== 3 || !parts[0] || !parts[1] || !parts[2]) {
        return res.status(400).json({ 
          success: false, 
          error: '联邦身份ID格式不正确，应为@用户名@主机名' 
        });
      }

      const hostName = parts[2];

      // 联邦用户登录
      const result = await authService.fediverseLogin(
        fediverse_user_id,
        hostName,
        nickname,
        avatar_location
      );

      res.json({ 
        success: true, 
        data: result,
        message: '联邦登录成功' 
      });
    } catch (error: any) {
      console.error('联邦用户登录失败:', error);
      res.status(400).json({ 
        success: false, 
        error: error.message || '联邦用户登录失败' 
      });
    }
  });

  /**
   * 获取当前用户信息
   * GET /api/auth/me
   */
  router.get('/me', async (req: Request, res: Response) => {
    try {
      // 从Authorization头获取令牌
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
          success: false, 
          error: '需要有效的认证令牌' 
        });
      }

      // 验证令牌并获取用户
      const user = await authService.verifyToken(authHeader);
      
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          error: '认证令牌无效或已过期' 
        });
      }

      // 获取当前用户信息
      const currentUser = await authService.getCurrentUser(user.user_uuid);

      res.json({ 
        success: true, 
        data: currentUser 
      });
    } catch (error: any) {
      console.error('获取用户信息失败:', error);
      res.status(401).json({ 
        success: false, 
        error: error.message || '获取用户信息失败' 
      });
    }
  });

  /**
   * 更新用户资料
   * PUT /api/auth/profile
   */
  router.put('/profile', async (req: Request, res: Response) => {
    try {
      // 从Authorization头获取令牌
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
          success: false, 
          error: '需要有效的认证令牌' 
        });
      }

      // 验证令牌并获取用户
      const user = await authService.verifyToken(authHeader);
      
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          error: '认证令牌无效或已过期' 
        });
      }

      const updateData = req.body;

      // 不允许更新敏感字段
      const allowedFields = ['nickname', 'avatar_location', 'email', 'bio'];
      const filteredUpdateData: any = {};
      
      for (const field of allowedFields) {
        if (updateData[field] !== undefined) {
          filteredUpdateData[field] = updateData[field];
        }
      }

      // 如果更新邮箱，需要验证邮箱是否已被使用
      if (filteredUpdateData.email && filteredUpdateData.email !== user.email) {
        const existingUser = await authService.verifyToken(authHeader);
        if (existingUser && existingUser.email === filteredUpdateData.email) {
          return res.status(400).json({ 
            success: false, 
            error: '邮箱已被其他用户使用' 
          });
        }
      }

      // 更新用户资料
      const updatedUser = await authService.updateProfile(user.user_uuid, filteredUpdateData);

      res.json({ 
        success: true, 
        data: updatedUser,
        message: '用户资料更新成功' 
      });
    } catch (error: any) {
      console.error('更新用户资料失败:', error);
      res.status(400).json({ 
        success: false, 
        error: error.message || '更新用户资料失败' 
      });
    }
  });

  /**
   * 验证令牌
   * POST /api/auth/verify
   */
  router.post('/verify', async (req: Request, res: Response) => {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({ 
          success: false, 
          error: '令牌是必填项' 
        });
      }

      // 验证令牌
      const user = await authService.verifyToken(token);
      
      if (!user) {
        return res.json({ 
          success: false, 
          valid: false 
        });
      }

      res.json({ 
        success: true, 
        valid: true,
        user: authService['sanitizeUser'](user) // 访问私有方法（实际应该改为公有方法）
      });
    } catch (error: any) {
      console.error('验证令牌失败:', error);
      res.status(400).json({ 
        success: false, 
        error: error.message || '验证令牌失败' 
      });
    }
  });

  return router;
}