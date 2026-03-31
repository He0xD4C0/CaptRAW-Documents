import { useQuery } from '@tanstack/react-query';
import apiService from '../services/api';
import { QueryParams } from '../types';

// 公告查询keys
export const noticeKeys = {
  all: ['notices'] as const,
  lists: () => [...noticeKeys.all, 'list'] as const,
  list: (params: QueryParams) => [...noticeKeys.lists(), params] as const,
};

// 获取公告列表
export const useNotices = (params?: QueryParams) => {
  return useQuery({
    queryKey: noticeKeys.list(params || {}),
    queryFn: () => apiService.getNotices(params),
    staleTime: 2 * 60 * 1000, // 2分钟（公告更新较频繁）
    gcTime: 5 * 60 * 1000, // 5分钟
  });
};

// 获取最新公告
export const useLatestNotices = (limit: number = 5) => {
  return useQuery({
    queryKey: ['notices', 'latest', limit],
    queryFn: () => apiService.getNotices({ 
      limit,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    }),
    staleTime: 2 * 60 * 1000,
  });
};

// 获取高优先级公告
export const useHighPriorityNotices = () => {
  return useQuery({
    queryKey: ['notices', 'high-priority'],
    queryFn: () => apiService.getNotices({ 
      limit: 5,
      sortBy: 'priority',
      sortOrder: 'desc'
    }),
    staleTime: 2 * 60 * 1000,
  });
};