import {
  getServerInfo,
  getServerInfos,
  getServerInfoByCategory,
  getAllPublicServerInfo,
  setServerInfo,
  batchSetServerInfo,
  deleteServerInfo,
  syncConfigToDatabase,
  getServerInfoMap,
  ServerInfoInput,
} from '../database/serverInfo';

export class ServerInfoService {
  /**
   * 获取单个服务器配置
   */
  async get(key: string) {
    return await getServerInfo(key);
  }

  /**
   * 获取多个服务器配置
   */
  async getMultiple(keys: string[]) {
    return await getServerInfos(keys);
  }

  /**
   * 按分类获取服务器配置
   */
  async getByCategory(category: string) {
    return await getServerInfoByCategory(category);
  }

  /**
   * 获取所有公开的服务器配置
   */
  async getAllPublic() {
    return await getAllPublicServerInfo();
  }

  /**
   * 设置服务器配置
   */
  async set(info: ServerInfoInput) {
    return await setServerInfo(info);
  }

  /**
   * 批量设置服务器配置
   */
  async setMultiple(infos: ServerInfoInput[]) {
    return await batchSetServerInfo(infos);
  }

  /**
   * 删除服务器配置
   */
  async delete(key: string) {
    return await deleteServerInfo(key);
  }

  /**
   * 同步配置文件到数据库
   */
  async syncConfig(config: any) {
    return await syncConfigToDatabase(config);
  }

  /**
   * 获取服务器配置的键值对形式
   */
  async getConfigMap() {
    return await getServerInfoMap();
  }

  /**
   * 获取前端需要的运行时配置
   */
  async getRuntimeConfig() {
    const keys = [
      'server_name',
      'server_intro',
      'api_base_url',
      'assets_strategy',
      'assets_public_base_url',
      'community_url',
      'server_version',
      'server_opensrc_location',
    ];
    
    const infos = await getServerInfos(keys);
    const config: Record<string, any> = {};
    
    for (const info of infos) {
      const key = info.info_key;
      const value = info.info_value;
      
      // 根据键名组织配置结构
      if (key.startsWith('server_')) {
        if (!config.server) config.server = {};
        config.server[key.replace('server_', '')] = value;
      } else if (key.startsWith('api_')) {
        if (!config.api) config.api = {};
        config.api[key.replace('api_', '')] = value;
      } else if (key.startsWith('assets_')) {
        if (!config.assets) config.assets = {};
        config.assets[key.replace('assets_', '')] = value;
      } else if (key.startsWith('community_')) {
        if (!config.community) config.community = {};
        config.community[key.replace('community_', '')] = value;
      } else {
        config[key] = value;
      }
    }
    
    return config;
  }

  /**
   * 验证配置完整性
   */
  async validateConfig() {
    const requiredKeys = [
      'server_name',
      'api_base_url',
      'assets_strategy',
    ];
    
    const missingKeys: string[] = [];
    const presentKeys: string[] = [];
    
    for (const key of requiredKeys) {
      const info = await getServerInfo(key);
      if (info) {
        presentKeys.push(key);
      } else {
        missingKeys.push(key);
      }
    }
    
    return {
      isValid: missingKeys.length === 0,
      presentKeys,
      missingKeys,
      totalConfigs: (await getAllPublicServerInfo()).length,
    };
  }
}

// 导出默认实例
export const serverInfoService = new ServerInfoService();