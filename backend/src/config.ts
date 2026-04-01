import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export type AssetKind = 'user' | 'article' | 'notice' | 'banner';

export interface BackendConfig {
  api: {
    port: number;
    baseUrl: string;
  };
  assets: {
    publicBaseUrl: string;
    sign: {
      mode: 'real' | 'mock';
      expiresSeconds: number;
    };
  };
  objectStorage: {
    endpoint: string;
    port: number;
    bucket: string;
    accessKey: string;
    secretKey: string;
    region: string;
    secure: boolean;
  };
  database: {
    url: string;
  };
}

const DEFAULT_CONFIG: BackendConfig = {
  api: {
    port: 3001,
    baseUrl: 'http://localhost:3001/api',
  },
  assets: {
    publicBaseUrl: 'https://via.placeholder.com',
    sign: {
      mode: 'real',
      expiresSeconds: 300,
    },
  },
  objectStorage: {
    endpoint: 'localhost',
    port: 9000,
    bucket: 'capt-docs-storage',
    accessKey: 'Capt-Docs',
      secretKey: '12345678',
    region: 'us-east-1',
    secure: false,
  },
  database: {
    url: 'postgresql://captraw_user:captraw_password@localhost:5432/captraw_db',
  },
};

let cachedConfig: BackendConfig | null = null;

export function getConfig(): BackendConfig {
  if (cachedConfig) return cachedConfig;

  const configPath = path.resolve(process.cwd(), '../config.yaml');
  if (!fs.existsSync(configPath)) {
    cachedConfig = DEFAULT_CONFIG;
    return cachedConfig;
  }

  const raw = yaml.load(fs.readFileSync(configPath, 'utf8')) as any;
  cachedConfig = {
    api: {
      port: raw?.api?.port || DEFAULT_CONFIG.api.port,
      baseUrl: raw?.api?.baseUrl || DEFAULT_CONFIG.api.baseUrl,
    },
    assets: {
      publicBaseUrl: raw?.assets?.publicBaseUrl || DEFAULT_CONFIG.assets.publicBaseUrl,
      sign: {
        mode: raw?.assets?.sign?.mode || DEFAULT_CONFIG.assets.sign.mode,
        expiresSeconds:
          raw?.assets?.sign?.expiresSeconds || DEFAULT_CONFIG.assets.sign.expiresSeconds,
      },
    },
    objectStorage: {
      endpoint: raw?.objectStorage?.endpoint || DEFAULT_CONFIG.objectStorage.endpoint,
      port: raw?.objectStorage?.port || DEFAULT_CONFIG.objectStorage.port,
      bucket: raw?.objectStorage?.bucket || DEFAULT_CONFIG.objectStorage.bucket,
      accessKey: raw?.objectStorage?.accessKey || DEFAULT_CONFIG.objectStorage.accessKey,
      secretKey: raw?.objectStorage?.secretKey || DEFAULT_CONFIG.objectStorage.secretKey,
      region: raw?.objectStorage?.region || DEFAULT_CONFIG.objectStorage.region,
      secure:
        typeof raw?.objectStorage?.secure === 'boolean'
          ? raw.objectStorage.secure
          : DEFAULT_CONFIG.objectStorage.secure,
    },
    database: {
      url: raw?.database?.url || DEFAULT_CONFIG.database.url,
    },
  };
  return cachedConfig;
}

