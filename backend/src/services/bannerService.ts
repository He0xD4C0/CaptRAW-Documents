import {
  getBanners,
  getBannerById,
  getActiveBannersCount,
  createBanner,
  updateBanner,
  deleteBanner,
  getAllBanners,
  updateBannerOrder,
  BannerRecord,
  BannerQueryParams,
} from '../database/banners';

export class BannerService {
  /**
   * 获取横幅列表（默认为活跃横幅）
   */
  async getBanners(params: BannerQueryParams = {}) {
    const banners = await getBanners(params);
    return banners;
  }

  /**
   * 获取所有横幅（包括非活跃的）
   */
  async getAllBanners(limit: number = 50, offset: number = 0) {
    const banners = await getAllBanners(limit, offset);
    const total = await this.getTotalBannersCount();
    
    return {
      banners,
      pagination: {
        total,
        page: Math.floor(offset / limit) + 1,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * 根据ID获取横幅
   */
  async getBanner(bannerId: string) {
    return await getBannerById(bannerId);
  }

  /**
   * 创建横幅
   */
  async createBanner(bannerData: Omit<BannerRecord, 'banner_id' | 'created_at' | 'updated_at'>) {
    return await createBanner(bannerData);
  }

  /**
   * 更新横幅
   */
  async updateBanner(bannerId: string, bannerData: Partial<Omit<BannerRecord, 'banner_id' | 'created_at' | 'updated_at'>>) {
    return await updateBanner(bannerId, bannerData);
  }

  /**
   * 删除横幅
   */
  async deleteBanner(bannerId: string) {
    return await deleteBanner(bannerId);
  }

  /**
   * 获取活跃横幅数量
   */
  async getActiveBannersCount() {
    return await getActiveBannersCount();
  }

  /**
   * 获取所有横幅数量
   */
  async getTotalBannersCount(): Promise<number> {
    const result = await import('../database/index').then(m => 
      m.query<{ count: string }>('SELECT COUNT(*) as count FROM banners')
    );
    return parseInt(result.rows[0].count, 10);
  }

  /**
   * 更新横幅显示顺序
   */
  async updateBannerOrder(bannerId: string, displayOrder: number) {
    return await updateBannerOrder(bannerId, displayOrder);
  }

  /**
   * 批量更新横幅顺序
   */
  async updateBannersOrder(orderUpdates: Array<{ bannerId: string; displayOrder: number }>) {
    const results = [];
    
    for (const update of orderUpdates) {
      const success = await updateBannerOrder(update.bannerId, update.displayOrder);
      results.push({
        bannerId: update.bannerId,
        success,
      });
    }
    
    return results;
  }

  /**
   * 获取当前可显示的横幅（用于首页轮播）
   */
  async getDisplayBanners(limit: number = 10) {
    const banners = await getBanners({
      limit,
      is_active: true,
      current_time: new Date(),
    });
    return banners;
  }

  /**
   * 激活/停用横幅
   */
  async toggleBannerActive(bannerId: string, active: boolean) {
    const banner = await getBannerById(bannerId);
    
    if (!banner) {
      throw new Error('横幅不存在');
    }
    
    const updatedBanner = await updateBanner(bannerId, { is_active: active });
    return updatedBanner;
  }
}

// 导出默认实例
export const bannerService = new BannerService();