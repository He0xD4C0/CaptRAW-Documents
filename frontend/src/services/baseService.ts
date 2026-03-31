import axios, { AxiosInstance } from 'axios';
import { ApiResponse } from '../types';
import { getRuntimeConfig } from '../config/runtimeConfig';

// 模拟API延迟（用于开发环境）
export const simulateDelay = () => new Promise(resolve => setTimeout(resolve, 300));

export class BaseService {
  protected client: AxiosInstance;
  protected baseURL: string;

  constructor() {
    this.baseURL = getRuntimeConfig().api.baseUrl;
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // 请求拦截器
    this.client.interceptors.request.use(
      (config) => {
        config.baseURL = getRuntimeConfig().api.baseUrl;
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // 通用成功响应
  protected successResponse<T>(data: T, message?: string): ApiResponse<T> {
    return {
      success: true,
      data,
      message,
    };
  }

  // 通用错误响应
  protected errorResponse<T>(error: string): ApiResponse<T> {
    return {
      success: false,
      error,
    };
  }

  // 带分页的成功响应
  protected paginatedResponse<T>(
    data: T[], 
    page: number, 
    limit: number, 
    total: number
  ): ApiResponse<T[]> {
    const totalPages = Math.ceil(total / limit);
    const hasNext = page * limit < total;
    const hasPrev = page > 1;

    return {
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext,
        hasPrev,
      },
    };
  }
}