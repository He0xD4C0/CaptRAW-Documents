import { BaseService, simulateDelay } from './baseService';
import { Tag, ApiResponse } from '../types';

export class TagService extends BaseService {
  async getTags(): Promise<ApiResponse<Tag[]>> {
    await simulateDelay();
    
    const articles = await import('../data/articles.json');
    
    // 从文章中提取标签并统计
    const tagMap = new Map<string, number>();
    (articles.default as any[]).forEach((article: any) => {
      article.tags.forEach((tag: string) => {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
      });
    });

    const tags: Tag[] = Array.from(tagMap.entries()).map(([name, count], index) => ({
      id: index + 1,
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      articleCount: count,
    }));

    return this.successResponse(tags);
  }
}

// 导出默认实例
export const tagService = new TagService();
