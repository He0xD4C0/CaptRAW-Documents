import { query } from './index';

export interface ArticleRecord {
  article_uuid: string;
  article_title: string;
  article_intro: string;
  article_content: string;
  release_time: Date;
  author_id: string;
  article_asset_location: string | null;
  tags: string[] | null;
  status: string;
  views: number;
  likes: number;
  comments_count: number;
  read_time: number;
  is_featured: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface ArticleWithAuthor extends ArticleRecord {
  author_nickname: string;
  author_fediverse_user_id: string;
  author_avatar_location: string | null;
}

export interface ArticleQueryParams {
  limit?: number;
  offset?: number;
  search?: string;
  tags?: string[];
  status?: string;
  is_featured?: boolean;
  sortBy?: 'release_time' | 'views' | 'likes' | 'created_at';
  sortOrder?: 'asc' | 'desc';
}

/**
 * 获取文章列表（带作者信息）
 */
export async function getArticles(params: ArticleQueryParams = {}): Promise<ArticleWithAuthor[]> {
  const {
    limit = 10,
    offset = 0,
    search,
    tags,
    status = 'published',
    is_featured,
    sortBy = 'release_time',
    sortOrder = 'desc',
  } = params;

  let queryText = `
    SELECT 
      a.*,
      u.nickname as author_nickname,
      u.fediverse_user_id as author_fediverse_user_id,
      u.avatar_location as author_avatar_location
    FROM articles a
    JOIN users u ON a.author_id = u.user_uuid
    WHERE a.status = $1
  `;

  const queryParams: any[] = [status];
  let paramCount = 1;

  // 添加搜索条件
  if (search) {
    paramCount++;
    queryText += ` AND (
      a.article_title ILIKE $${paramCount} OR 
      a.article_intro ILIKE $${paramCount} OR
      a.article_content ILIKE $${paramCount}
    )`;
    queryParams.push(`%${search}%`);
  }

  // 添加标签条件
  if (tags && tags.length > 0) {
    paramCount++;
    queryText += ` AND a.tags && $${paramCount}`;
    queryParams.push(tags);
  }

  // 添加精选条件
  if (is_featured !== undefined) {
    paramCount++;
    queryText += ` AND a.is_featured = $${paramCount}`;
    queryParams.push(is_featured);
  }

  // 添加排序
  const validSortFields = ['release_time', 'views', 'likes', 'created_at'];
  const sortField = validSortFields.includes(sortBy) ? sortBy : 'release_time';
  const order = sortOrder === 'asc' ? 'ASC' : 'DESC';
  
  queryText += ` ORDER BY a.${sortField} ${order}`;

  // 添加分页
  paramCount++;
  queryText += ` LIMIT $${paramCount}`;
  queryParams.push(limit);

  paramCount++;
  queryText += ` OFFSET $${paramCount}`;
  queryParams.push(offset);

  const result = await query<ArticleWithAuthor>(queryText, queryParams);
  return result.rows;
}

/**
 * 根据ID获取单篇文章
 */
export async function getArticleById(articleUuid: string): Promise<ArticleWithAuthor | null> {
  const result = await query<ArticleWithAuthor>(
    `SELECT 
      a.*,
      u.nickname as author_nickname,
      u.fediverse_user_id as author_fediverse_user_id,
      u.avatar_location as author_avatar_location
    FROM articles a
    JOIN users u ON a.author_id = u.user_uuid
    WHERE a.article_uuid = $1
    LIMIT 1`,
    [articleUuid]
  );
  return result.rows[0] || null;
}

/**
 * 获取文章总数（用于分页）
 */
export async function getArticlesCount(params: Omit<ArticleQueryParams, 'limit' | 'offset' | 'sortBy' | 'sortOrder'> = {}): Promise<number> {
  const { search, tags, status = 'published', is_featured } = params;

  let queryText = `SELECT COUNT(*) as count FROM articles a WHERE a.status = $1`;
  const queryParams: any[] = [status];
  let paramCount = 1;

  if (search) {
    paramCount++;
    queryText += ` AND (
      a.article_title ILIKE $${paramCount} OR 
      a.article_intro ILIKE $${paramCount} OR
      a.article_content ILIKE $${paramCount}
    )`;
    queryParams.push(`%${search}%`);
  }

  if (tags && tags.length > 0) {
    paramCount++;
    queryText += ` AND a.tags && $${paramCount}`;
    queryParams.push(tags);
  }

  if (is_featured !== undefined) {
    paramCount++;
    queryText += ` AND a.is_featured = $${paramCount}`;
    queryParams.push(is_featured);
  }

  const result = await query<{ count: string }>(queryText, queryParams);
  return parseInt(result.rows[0].count, 10);
}

/**
 * 增加文章阅读量
 */
export async function incrementArticleViews(articleUuid: string): Promise<boolean> {
  const result = await query(
    'UPDATE articles SET views = views + 1 WHERE article_uuid = $1 RETURNING article_uuid',
    [articleUuid]
  );
  return (result.rowCount || 0) > 0;
}

/**
 * 更新文章点赞数
 */
export async function updateArticleLikes(articleUuid: string, delta: number): Promise<boolean> {
  const result = await query(
    'UPDATE articles SET likes = GREATEST(likes + $2, 0) WHERE article_uuid = $1 RETURNING article_uuid',
    [articleUuid, delta]
  );
  return (result.rowCount || 0) > 0;
}

/**
 * 创建文章
 */
export async function createArticle(articleData: Omit<ArticleRecord, 'article_uuid' | 'created_at' | 'updated_at' | 'views' | 'likes' | 'comments_count'>): Promise<ArticleRecord> {
  const {
    article_title,
    article_intro,
    article_content,
    release_time,
    author_id,
    article_asset_location,
    tags,
    status,
    read_time,
    is_featured,
  } = articleData;

  const result = await query<ArticleRecord>(
    `INSERT INTO articles (
      article_title, article_intro, article_content, release_time, author_id,
      article_asset_location, tags, status, read_time, is_featured
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *`,
    [
      article_title,
      article_intro,
      article_content,
      release_time,
      author_id,
      article_asset_location,
      tags || [],
      status || 'draft',
      read_time || 0,
      is_featured || false,
    ]
  );
  return result.rows[0];
}

/**
 * 更新文章
 */
export async function updateArticle(articleUuid: string, articleData: Partial<Omit<ArticleRecord, 'article_uuid' | 'created_at' | 'updated_at' | 'author_id'>>): Promise<ArticleRecord | null> {
  const fields: string[] = [];
  const values: any[] = [];
  let paramCount = 1;

  // 动态构建更新字段
  Object.entries(articleData).forEach(([key, value]) => {
    if (value !== undefined) {
      fields.push(`${key} = $${paramCount}`);
      values.push(value);
      paramCount++;
    }
  });

  if (fields.length === 0) {
    return null;
  }

  values.push(articleUuid);
  
  const result = await query<ArticleRecord>(
    `UPDATE articles SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
     WHERE article_uuid = $${paramCount}
     RETURNING *`,
    values
  );
  return result.rows[0] || null;
}

/**
 * 删除文章
 */
export async function deleteArticle(articleUuid: string): Promise<boolean> {
  const result = await query(
    'DELETE FROM articles WHERE article_uuid = $1 RETURNING article_uuid',
    [articleUuid]
  );
  return (result.rowCount || 0) > 0;
}