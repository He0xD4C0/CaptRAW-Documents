import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiService from '../services/api';
import { QueryParams, ArticleFormData } from '../types';

// 文章查询keys
export const articleKeys = {
  all: ['articles'] as const,
  lists: () => [...articleKeys.all, 'list'] as const,
  list: (params: QueryParams) => [...articleKeys.lists(), params] as const,
  details: () => [...articleKeys.all, 'detail'] as const,
  detail: (id: number) => [...articleKeys.details(), id] as const,
};

// 获取文章列表
export const useArticles = (params?: QueryParams) => {
  return useQuery({
    queryKey: articleKeys.list(params || {}),
    queryFn: () => apiService.getArticles(params),
    staleTime: 5 * 60 * 1000, // 5分钟
    gcTime: 10 * 60 * 1000, // 10分钟
  });
};

// 获取单篇文章
export const useArticle = (id: number) => {
  return useQuery({
    queryKey: articleKeys.detail(id),
    queryFn: () => apiService.getArticle(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10分钟
  });
};

// 创建文章
export const useCreateArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ArticleFormData) => apiService.createArticle(data),
    onSuccess: () => {
      // 使文章列表缓存失效
      queryClient.invalidateQueries({ queryKey: articleKeys.lists() });
    },
  });
};

// 更新文章
export const useUpdateArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ArticleFormData> }) =>
      apiService.updateArticle(id, data),
    onSuccess: (_, variables) => {
      // 使特定文章和列表缓存失效
      queryClient.invalidateQueries({ queryKey: articleKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: articleKeys.lists() });
    },
  });
};

// 删除文章
export const useDeleteArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiService.deleteArticle(id),
    onSuccess: () => {
      // 使文章列表缓存失效
      queryClient.invalidateQueries({ queryKey: articleKeys.lists() });
    },
  });
};

// 获取热门文章
export const usePopularArticles = () => {
  return useQuery({
    queryKey: ['articles', 'popular'],
    queryFn: () => apiService.getArticles({ 
      sortBy: 'views', 
      sortOrder: 'desc',
      limit: 5 
    }),
    staleTime: 5 * 60 * 1000,
  });
};

// 获取最新文章
export const useLatestArticles = () => {
  return useQuery({
    queryKey: ['articles', 'latest'],
    queryFn: () => apiService.getArticles({ 
      sortBy: 'createdAt', 
      sortOrder: 'desc',
      limit: 5 
    }),
    staleTime: 5 * 60 * 1000,
  });
};