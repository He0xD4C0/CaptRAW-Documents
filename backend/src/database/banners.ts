import { query } from './index';

export interface BannerRecord {
  banner_id: string;
  title: string;
  image_location: string;
  link_url: string | null;
  description: string | null;
  is_active: boolean;
  display_order: number;
  start_time: Date;
  end_time: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface BannerQueryParams {
  limit?: number;
  offset?: number;
  is_active?: boolean;
  current_time?: Date;
}

/**
 * 获取横幅列表
 */
export async function getBanners(params: BannerQueryParams = {}): Promise<BannerRecord[]> {
  const {
    limit,
    offset = 0,
    is_active = true,
    current_time = new Date(),
  } = params;

  let queryText = `
    SELECT * FROM banners 
    WHERE is_active = $1 
    AND start_time <= $2
    AND (end_time IS NULL OR end_time > $2)
    ORDER BY display_order ASC, created_at DESC
  `;

  const queryParams: any[] = [is_active, current_time];
  let paramCount = 2;

  // 添加分页
  if (limit !== undefined) {
    paramCount++;
    queryText += ` LIMIT $${paramCount}`;
    queryParams.push(limit);
  }

  if (offset !== 0) {
    paramCount++;
    queryText += ` OFFSET $${paramCount}`;
    queryParams.push(offset);
  }

  const result = await query<BannerRecord>(queryText, queryParams);
  return result.rows;
}

/**
 * 根据ID获取横幅
 */
export async function getBannerById(bannerId: string): Promise<BannerRecord | null> {
  const result = await query<BannerRecord>(
    'SELECT * FROM banners WHERE banner_id = $1 LIMIT 1',
    [bannerId]
  );
  return result.rows[0] || null;
}

/**
 * 获取活跃横幅总数
 */
export async function getActiveBannersCount(): Promise<number> {
  const result = await query<{ count: string }>(
    `SELECT COUNT(*) as count FROM banners 
     WHERE is_active = true 
     AND start_time <= CURRENT_TIMESTAMP
     AND (end_time IS NULL OR end_time > CURRENT_TIMESTAMP)`
  );
  return parseInt(result.rows[0].count, 10);
}

/**
 * 创建横幅
 */
export async function createBanner(bannerData: Omit<BannerRecord, 'banner_id' | 'created_at' | 'updated_at'>): Promise<BannerRecord> {
  const {
    title,
    image_location,
    link_url,
    description,
    is_active,
    display_order,
    start_time,
    end_time,
  } = bannerData;

  const result = await query<BannerRecord>(
    `INSERT INTO banners (
      title, image_location, link_url, description,
      is_active, display_order, start_time, end_time
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *`,
    [
      title,
      image_location,
      link_url,
      description,
      is_active !== undefined ? is_active : true,
      display_order !== undefined ? display_order : 0,
      start_time || new Date(),
      end_time,
    ]
  );
  return result.rows[0];
}

/**
 * 更新横幅
 */
export async function updateBanner(bannerId: string, bannerData: Partial<Omit<BannerRecord, 'banner_id' | 'created_at' | 'updated_at'>>): Promise<BannerRecord | null> {
  const fields: string[] = [];
  const values: any[] = [];
  let paramCount = 1;

  // 动态构建更新字段
  Object.entries(bannerData).forEach(([key, value]) => {
    if (value !== undefined) {
      fields.push(`${key} = $${paramCount}`);
      values.push(value);
      paramCount++;
    }
  });

  if (fields.length === 0) {
    return null;
  }

  values.push(bannerId);
  
  const result = await query<BannerRecord>(
    `UPDATE banners SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
     WHERE banner_id = $${paramCount}
     RETURNING *`,
    values
  );
  return result.rows[0] || null;
}

/**
 * 删除横幅
 */
export async function deleteBanner(bannerId: string): Promise<boolean> {
  const result = await query(
    'DELETE FROM banners WHERE banner_id = $1 RETURNING banner_id',
    [bannerId]
  );
  return (result.rowCount || 0) > 0;
}

/**
 * 获取所有横幅（包括非活跃的）
 */
export async function getAllBanners(limit: number = 50, offset: number = 0): Promise<BannerRecord[]> {
  const result = await query<BannerRecord>(
    'SELECT * FROM banners ORDER BY display_order ASC, created_at DESC LIMIT $1 OFFSET $2',
    [limit, offset]
  );
  return result.rows;
}

/**
 * 更新横幅显示顺序
 */
export async function updateBannerOrder(bannerId: string, displayOrder: number): Promise<boolean> {
  const result = await query(
    'UPDATE banners SET display_order = $2 WHERE banner_id = $1 RETURNING banner_id',
    [bannerId, displayOrder]
  );
  return (result.rowCount || 0) > 0;
}