import { BaseService, simulateDelay } from './baseService';
import { 
  ApiResponse, 
  LoginFormData, 
  RegisterFormData, 
  SimpleUser 
} from '../types';

export interface AuthResponse {
  token: string;
  user: SimpleUser;
}

export class AuthService extends BaseService {
  async login(data: LoginFormData): Promise<ApiResponse<AuthResponse>> {
    await simulateDelay();
    
    // 模拟登录成功
    if (data.email === 'test@example.com' && data.password === 'password') {
      const token = 'mock-jwt-token-' + Date.now();
      localStorage.setItem('token', token);

      return this.successResponse({
        token,
        user: {
          id: 'current_user',
          name: '测试用户',
          avatar: 'current_user_avatar',
        },
      }, '登录成功');
    }

    return this.errorResponse('邮箱或密码错误');
  }

  async register(data: RegisterFormData): Promise<ApiResponse<AuthResponse>> {
    await simulateDelay();
    
    // 模拟注册成功
    const token = 'mock-jwt-token-' + Date.now();
    localStorage.setItem('token', token);

    return this.successResponse({
      token,
      user: {
        id: 'new_user_' + Date.now(),
        name: data.name,
        avatar: 'new_user_avatar',
      },
    }, '注册成功');
  }

  async logout(): Promise<ApiResponse<void>> {
    localStorage.removeItem('token');
    return this.successResponse(undefined, '登出成功');
  }

  async getCurrentUser(): Promise<ApiResponse<SimpleUser>> {
    await simulateDelay();
    
    const token = localStorage.getItem('token');
    if (!token) {
      return this.errorResponse('未登录');
    }

    return this.successResponse({
      id: 'current_user',
      name: '测试用户',
      avatar: 'current_user_avatar',
    });
  }
}

// 导出默认实例
export const authService = new AuthService();
