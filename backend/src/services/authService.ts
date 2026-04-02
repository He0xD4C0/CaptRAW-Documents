import {
  getUserById,
  getUserByEmail,
  getUserByFediverseId,
  createUser,
  updateUser,
  verifyUserLogin,
  getUserByUuid,
  UserRecord,
  CreateUserInput,
  UpdateUserInput,
  LoginCredentials,
} from '../database/users';

// 简单的JWT模拟（实际应该使用jsonwebtoken库）
interface TokenPayload {
  user_uuid: string;
  user_id: string;
  role: string;
  exp: number;
}

export class AuthService {
  private readonly jwtSecret = 'captraw-documents-secret-key'; // 应该从环境变量获取
  
  /**
   * 用户注册
   */
  async register(userData: CreateUserInput) {
    // 检查用户是否已存在
    const existingByUserId = await getUserById(userData.user_id);
    if (existingByUserId) {
      throw new Error('用户ID已存在');
    }
    
    if (userData.email) {
      const existingByEmail = await getUserByEmail(userData.email);
      if (existingByEmail) {
        throw new Error('邮箱已存在');
      }
    }
    
    if (userData.fediverse_user_id) {
      const existingByFedId = await getUserByFediverseId(userData.fediverse_user_id);
      if (existingByFedId) {
        throw new Error('联邦身份ID已存在');
      }
    }
    
    // 创建用户
    const user = await createUser(userData);
    
    // 生成JWT令牌
    const token = this.generateToken(user);
    
    return {
      user: this.sanitizeUser(user),
      token,
    };
  }
  
  /**
   * 用户登录
   */
  async login(credentials: LoginCredentials) {
    const user = await verifyUserLogin(credentials);
    
    if (!user) {
      throw new Error('用户名或密码错误');
    }
    
    if (!user.is_active) {
      throw new Error('用户账户已被禁用');
    }
    
    // 生成JWT令牌
    const token = this.generateToken(user);
    
    return {
      user: this.sanitizeUser(user),
      token,
    };
  }
  
  /**
   * 联邦用户登录（如果用户不存在则自动创建）
   */
  async fediverseLogin(fediverseUserId: string, hostName: string, nickname: string, avatarLocation?: string) {
    let user = await getUserByFediverseId(fediverseUserId);
    
    if (!user) {
      // 自动创建联邦用户
      const userId = fediverseUserId.split('@')[1]; // 从@user@host提取用户名
      
      user = await createUser({
        fediverse_user_id: fediverseUserId,
        user_id: userId,
        host_name: hostName,
        nickname,
        avatar_location: avatarLocation,
        role: 'user',
      });
    }
    
    // 更新用户信息（如果有变化）
    if (user.nickname !== nickname || user.avatar_location !== avatarLocation) {
      await updateUser(user.user_uuid, {
        nickname,
        avatar_location: avatarLocation,
      });
    }
    
    // 生成JWT令牌
    const token = this.generateToken(user);
    
    return {
      user: this.sanitizeUser(user),
      token,
    };
  }
  
  /**
   * 获取当前用户信息
   */
  async getCurrentUser(userUuid: string) {
    const user = await getUserByUuid(userUuid);
    
    if (!user) {
      throw new Error('用户不存在');
    }
    
    return this.sanitizeUser(user);
  }
  
  /**
   * 更新用户资料
   */
  async updateProfile(userUuid: string, updateData: UpdateUserInput) {
    const user = await updateUser(userUuid, updateData);
    
    if (!user) {
      throw new Error('用户不存在');
    }
    
    return this.sanitizeUser(user);
  }
  
  /**
   * 验证JWT令牌
   */
  async verifyToken(token: string): Promise<UserRecord | null> {
    try {
      // 简单的令牌验证（实际应该使用jsonwebtoken.verify）
      // 这里只做基础演示
      if (!token.startsWith('Bearer ')) {
        return null;
      }
      
      const tokenValue = token.replace('Bearer ', '');
      
      // 简单的令牌解析（实际应该验证签名和过期时间）
      const payloadStr = Buffer.from(tokenValue.split('.')[1], 'base64').toString();
      const payload = JSON.parse(payloadStr) as TokenPayload;
      
      // 检查令牌是否过期
      if (Date.now() >= payload.exp * 1000) {
        return null;
      }
      
      const user = await getUserByUuid(payload.user_uuid);
      return user;
    } catch (error) {
      console.error('令牌验证失败:', error);
      return null;
    }
  }
  
  /**
   * 生成JWT令牌
   */
  private generateToken(user: UserRecord): string {
    const payload: TokenPayload = {
      user_uuid: user.user_uuid,
      user_id: user.user_id,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7), // 7天过期
    };
    
    // 简单的令牌生成（实际应该使用jsonwebtoken.sign）
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
    const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64');
    const signature = 'mock-signature'; // 实际应该使用HMAC SHA256
    
    return `Bearer ${header}.${payloadBase64}.${signature}`;
  }
  
  /**
   * 清理用户信息（移除敏感数据）
   */
  private sanitizeUser(user: UserRecord) {
    const { password_hash, ...sanitizedUser } = user;
    return sanitizedUser;
  }
}

// 导出默认实例
export const authService = new AuthService();