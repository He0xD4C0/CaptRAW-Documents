import { useQuery } from '@tanstack/react-query';
import apiService from '../services/api';

// 横幅查询keys
export const bannerKeys = {
  all: ['banners'] as const,
  lists: () => [...bannerKeys.all, 'list'] as const,
  list: () => [...bannerKeys.lists()] as const,
};

// 获取横幅列表
export const useBanners = () => {
  return useQuery({
    queryKey: bannerKeys.list(),
    queryFn: () => apiService.getBanners(),
    staleTime: 10 * 60 * 1000, // 10分钟
    gcTime: 30 * 60 * 1000, // 30分钟
  });
};

// 获取活跃横幅
export const useActiveBanners = () => {
  return useQuery({
    queryKey: ['banners', 'active'],
    queryFn: async () => {
      const response = await apiService.getBanners();
      if (response.success && response.data) {
        // 确保只返回活跃的横幅
        return response.data.filter(banner => banner.isActive);
      }
      return [];
    },
    staleTime: 10 * 60 * 1000,
  });
};