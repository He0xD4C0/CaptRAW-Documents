import { query } from './index';

export interface ServerInfoRecord {
  info_key: string;
  info_value: any; // JSONB类型
  description: string | null;
  is_public: boolean;
  category: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface ServerInfoInput {
  info_key: string;
  info_value: any;
  description?: string;
  is_public?: boolean;
  category?: string;
}

/**
 * 获取服务器信息配置
 */
export async function getServerInfo(key: string): Promise<ServerInfoRecord | null> {
  const result = await query<ServerInfoRecord>(
    'SELECT * FROM server_info WHERE info_key = $1 LIMIT 1',
    [key]
  );
  return result.rows[0] || null;
}

/**
 * 获取多个服务器信息配置
 */
export async function getServerInfos(keys: string[]): Promise<ServerInfoRecord[]> {
  if (keys.length === 0) return [];
  
  const result = await query<ServerInfoRecord>(
    'SELECT * FROM server_info WHERE info_key = ANY($1)',
    [keys]
  );
  return result.rows;
}

/**
 * 根据分类获取服务器信息
 */
export async function getServerInfoByCategory(category: string): Promise<ServerInfoRecord[]> {
  const result = await query<ServerInfoRecord>(
    'SELECT * FROM server_info WHERE category = $1 AND is_public = true ORDER BY info_key',
    [category]
  );
  return result.rows;
}

/**
 * 获取所有公开的服务器信息
 */
export async function getAllPublicServerInfo(): Promise<ServerInfoRecord[]> {
  const result = await query<ServerInfoRecord>(
    'SELECT * FROM server_info WHERE is_public = true ORDER BY category, info_key'
  );
  return result.rows;
}

/**
 * 设置服务器信息配置
 */
export async function setServerInfo(info: ServerInfoInput): Promise<ServerInfoRecord> {
  const {
    info_key,
    info_value,
    description = null,
    is_public = true,
    category = null,
  } = info;

  const result = await query<ServerInfoRecord>(
    `INSERT INTO server_info (info_key, info_value, description, is_public, category)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (info_key) DO UPDATE SET
       info_value = EXCLUDED.info_value,
       description = EXCLUDED.description,
       is_public = EXCLUDED.is_public,
       category = EXCLUDED.category,
       updated_at = CURRENT_TIMESTAMP
     RETURNING *`,
    [info_key, JSON.stringify(info_value), description, is_public, category]
  );
  return result.rows[0];
}

/**
 * 批量设置服务器信息配置
 */
export async function batchSetServerInfo(infos: ServerInfoInput[]): Promise<ServerInfoRecord[]> {
  if (infos.length === 0) return [];
  
  const client = await import('./index').then(m => m.getTransactionClient());
  try {
    const inserted: ServerInfoRecord[] = [];
    for (const info of infos) {
      const result = await client.query<ServerInfoRecord>(
        `INSERT INTO server_info (info_key, info_value, description, is_public, category)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (info_key) DO UPDATE SET
           info_value = EXCLUDED.info_value,
           description = EXCLUDED.description,
           is_public = EXCLUDED.is_public,
           category = EXCLUDED.category,
           updated_at = CURRENT_TIMESTAMP
         RETURNING *`,
        [
          info.info_key,
          JSON.stringify(info.info_value),
          info.description || null,
          info.is_public !== undefined ? info.is_public : true,
          info.category || null,
        ]
      );
      inserted.push(result.rows[0]);
    }
    await import('./index').then(m => m.commitTransaction(client));
    return inserted;
  } catch (error) {
    await import('./index').then(m => m.rollbackTransaction(client));
    throw error;
  }
}

/**
 * 删除服务器信息配置
 */
export async function deleteServerInfo(key: string): Promise<boolean> {
  const result = await query(
    'DELETE FROM server_info WHERE info_key = $1 RETURNING info_key',
    [key]
  );
  return (result.rowCount || 0) > 0;
}

/**
 * 同步配置到数据库（从config.yaml到server_info表）
 */
export async function syncConfigToDatabase(config: any): Promise<ServerInfoRecord[]> {
  const serverInfos: ServerInfoInput[] = [];
  
  // 基本服务器信息
  serverInfos.push(
    {
      info_key: 'server_name',
      info_value: 'CaptRAW Documents',
      description: '网站名称',
      is_public: true,
      category: 'general',
    },
    {
      info_key: 'server_intro',
      info_value: '一个专注于技术分享和文档管理的社区平台',
      description: '网站介绍',
      is_public: true,
      category: 'general',
    },
    {
      info_key: 'server_admin',
      info_value: '@He0xD4C0@hub.captraw.com',
      description: '管理员联邦身份',
      is_public: false,
      category: 'admin',
    },
    {
      info_key: 'server_opensrc_location',
      info_value: 'https://github.com/captraw-community/CaptRAW-Documents',
      description: '开源仓库地址',
      is_public: true,
      category: 'technical',
    }
  );
  
  // 从config.yaml同步的配置
  if (config.api?.baseUrl) {
    serverInfos.push({
      info_key: 'api_base_url',
      info_value: config.api.baseUrl,
      description: 'API基础地址',
      is_public: true,
      category: 'api',
    });
  }
  
  if (config.assets?.strategy) {
    serverInfos.push({
      info_key: 'assets_strategy',
      info_value: config.assets.strategy,
      description: '资产策略（signedUrl/publicPrefix）',
      is_public: true,
      category: 'assets',
    });
  }
  
  if (config.assets?.publicBaseUrl) {
    serverInfos.push({
      info_key: 'assets_public_base_url',
      info_value: config.assets.publicBaseUrl,
      description: '资产公共基础URL',
      is_public: true,
      category: 'assets',
    });
  }
  
  if (config.community?.url) {
    serverInfos.push({
      info_key: 'community_url',
      info_value: config.community.url,
      description: '社区地址',
      is_public: true,
      category: 'community',
    });
  }
  
  return await batchSetServerInfo(serverInfos);
}

/**
 * 获取服务器配置的Map形式
 */
export async function getServerInfoMap(): Promise<Map<string, any>> {
  const infos = await getAllPublicServerInfo();
  const map = new Map<string, any>();
  
  for (const info of infos) {
    map.set(info.info_key, info.info_value);
  }
  
  return map;
}