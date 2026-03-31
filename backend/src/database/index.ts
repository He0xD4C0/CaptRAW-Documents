import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';
import { getConfig } from '../config';

// 数据库连接池单例
let pool: Pool | null = null;

/**
 * 获取数据库连接池实例
 */
export function getPool(): Pool {
  if (!pool) {
    const config = getConfig();
    pool = new Pool({
      connectionString: config.database.url,
      max: 10, // 最大连接数
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    // 连接池事件监听
    pool.on('connect', (client) => {
      console.log('Database client connected');
    });

    pool.on('error', (err, client) => {
      console.error('Unexpected database pool error:', err);
    });
  }
  return pool;
}

/**
 * 执行查询并返回结果
 */
export async function query<T extends QueryResultRow = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
  const pool = getPool();
  return pool.query<T>(text, params);
}

/**
 * 获取事务客户端
 */
export async function getTransactionClient(): Promise<PoolClient> {
  const pool = getPool();
  const client = await pool.connect();
  await client.query('BEGIN');
  return client;
}

/**
 * 提交事务并释放客户端
 */
export async function commitTransaction(client: PoolClient): Promise<void> {
  try {
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

/**
 * 回滚事务并释放客户端
 */
export async function rollbackTransaction(client: PoolClient): Promise<void> {
  try {
    await client.query('ROLLBACK');
  } finally {
    client.release();
  }
}

/**
 * 健康检查
 */
export async function healthCheck(): Promise<boolean> {
  try {
    await query('SELECT 1');
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}

/**
 * 关闭数据库连接池
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
    console.log('Database connection pool closed');
  }
}

// 资产相关查询函数
export interface AssetRecord {
  id: string;
  uuid: string;
  kind: 'user' | 'article' | 'notice' | 'banner';
  object_key: string;
  mime_type: string | null;
  size_bytes: number | null;
  visibility: 'public' | 'private';
  owner_id: string | null;
  username: string | null;
  hostname: string | null;
  created_at: Date;
  updated_at: Date;
}

/**
 * 根据uuid查找资产记录
 */
export async function findAssetByUuid(uuid: string): Promise<AssetRecord | null> {
  const result = await query<AssetRecord>(
    'SELECT * FROM assets WHERE uuid = $1 LIMIT 1',
    [uuid]
  );
  return result.rows[0] || null;
}

/**
 * 根据kind和uuid查找资产记录
 */
export async function findAsset(kind: string, uuid: string): Promise<AssetRecord | null> {
  const result = await query<AssetRecord>(
    'SELECT * FROM assets WHERE kind = $1 AND uuid = $2 LIMIT 1',
    [kind, uuid]
  );
  return result.rows[0] || null;
}

/**
 * 插入资产记录
 */
export async function insertAsset(asset: Omit<AssetRecord, 'id' | 'created_at' | 'updated_at'>): Promise<AssetRecord> {
  const {
    uuid,
    kind,
    object_key,
    mime_type,
    size_bytes,
    visibility,
    owner_id,
    username,
    hostname,
  } = asset;

  const result = await query<AssetRecord>(
    `INSERT INTO assets (
      uuid, kind, object_key, mime_type, size_bytes,
      visibility, owner_id, username, hostname
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *`,
    [uuid, kind, object_key, mime_type, size_bytes, visibility, owner_id, username, hostname]
  );
  return result.rows[0];
}

/**
 * 批量插入资产记录
 */
export async function batchInsertAssets(assets: Omit<AssetRecord, 'id' | 'created_at' | 'updated_at'>[]): Promise<AssetRecord[]> {
  if (assets.length === 0) return [];
  
  const client = await getTransactionClient();
  try {
    const inserted: AssetRecord[] = [];
    for (const asset of assets) {
      const result = await client.query<AssetRecord>(
        `INSERT INTO assets (
          uuid, kind, object_key, mime_type, size_bytes,
          visibility, owner_id, username, hostname
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (uuid) DO UPDATE SET
          updated_at = CURRENT_TIMESTAMP
        RETURNING *`,
        [
          asset.uuid,
          asset.kind,
          asset.object_key,
          asset.mime_type,
          asset.size_bytes,
          asset.visibility,
          asset.owner_id,
          asset.username,
          asset.hostname,
        ]
      );
      inserted.push(result.rows[0]);
    }
    await commitTransaction(client);
    return inserted;
  } catch (error) {
    await rollbackTransaction(client);
    throw error;
  }
}

/**
 * 删除资产记录
 */
export async function deleteAsset(uuid: string): Promise<boolean> {
  const result = await query(
    'DELETE FROM assets WHERE uuid = $1 RETURNING uuid',
    [uuid]
  );
  return (result.rowCount || 0) > 0;
}