import { BaseService, simulateDelay } from './baseService';
import { Banner, ApiResponse } from '../types';

export class BannerService extends BaseService {
  async getBanners(): Promise<ApiResponse<Banner[]>> {
    await simulateDelay();
    
    const banners = await import('../data/banners.json');
    const activeBanners = (banners.default as Banner[])
      .filter(banner => banner.isActive)
      .sort((a, b) => a.order - b.order);

    return this.successResponse(activeBanners);
  }
}

// 导出默认实例
export const bannerService = new BannerService();