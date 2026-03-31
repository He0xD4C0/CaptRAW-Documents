import { useQuery } from '@tanstack/react-query';
import apiService from '../services/api';
import { Tag } from '../types';

// 标签查询keys
export const tagKeys = {
  all: ['tags'] as const,
  lists: () => [...tagKeys.all, 'list'] as const,
  list: () => [...tagKeys.lists()] as const,
};

// 获取标签列表
export const useTags = () => {
  return useQuery({
    queryKey: tagKeys.list(),
    queryFn: () => apiService.getTags(),
    staleTime: 30 * 60 * 1000, // 30分钟
    gcTime: 60 * 60 * 1000, // 60分钟
  });
};

// 获取热门标签（按文章数量排序）
export const usePopularTags = (limit: number = 10) => {
  return useQuery({
    queryKey: ['tags', 'popular', limit],
    queryFn: async () => {
      const response = await apiService.getTags();
      if (response.success && response.data) {
        // 按文章数量排序并限制数量
        const sortedTags = [...response.data].sort((a, b) => b.articleCount - a.articleCount);
        return {
          ...response,
          data: sortedTags.slice(0, limit),
        };
      }
      return response;
    },
    staleTime: 30 * 60 * 1000,
  });
};

// 获取标签云数据（用于标签云组件）
export const useTagCloud = () => {
  return useQuery({
    queryKey: ['tags', 'cloud'],
    queryFn: async () => {
      const response = await apiService.getTags();
      if (response.success && response.data) {
        // 计算标签云的大小等级
        const maxCount = Math.max(...response.data.map(tag => tag.articleCount));
        const minCount = Math.min(...response.data.map(tag => tag.articleCount));
        
        const tagsWithSize = response.data.map(tag => {
          // 根据文章数量计算大小等级（1-5级）
          const sizeRange = maxCount - minCount;
          const normalized = sizeRange > 0 
            ? ((tag.articleCount - minCount) / sizeRange) * 4 + 1
            : 3; // 如果所有标签数量相同，使用中等大小
          
          return {
            ...tag,
            size: Math.round(normalized),
          };
        });

        return {
          ...response,
          data: tagsWithSize,
        };
      }
      return response;
    },
    staleTime: 30 * 60 * 1000,
  });
};