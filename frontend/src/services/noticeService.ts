import { BaseService, simulateDelay } from './baseService';
import { Notice, ApiResponse, QueryParams } from '../types';

export class NoticeService extends BaseService {
  async getNotices(params?: QueryParams): Promise<ApiResponse<Notice[]>> {
    await simulateDelay();
    
    const notices = await import('../data/notices.json');
    let filteredNotices = notices.default as Notice[];

    // 过滤过期公告
    const now = new Date();
    filteredNotices = filteredNotices.filter(notice => {
      if (!notice.expiresAt) return true;
      return new Date(notice.expiresAt) > now;
    });

    // 应用排序（按优先级和创建时间）
    filteredNotices.sort((a, b) => {
      const priorityOrder: Record<'high' | 'medium' | 'low', number> = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // 应用分页
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return this.paginatedResponse(
      filteredNotices.slice(startIndex, endIndex),
      page,
      limit,
      filteredNotices.length
    );
  }
}

// 导出默认实例
export const noticeService = new NoticeService();
