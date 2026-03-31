export type AssetStrategy = 'publicPrefix' | 'signedUrl';

export interface RuntimeConfig {
  api: {
    baseUrl: string;
  };
  assets: {
    strategy: AssetStrategy;
    publicBaseUrl: string;
    sign: {
      mode: 'real' | 'mock';
      expiresSeconds: number;
    };
  };
  community: {
    url: string;
  };
}

const DEFAULT_RUNTIME_CONFIG: RuntimeConfig = {
  api: {
    baseUrl: 'http://localhost:3001/api',
  },
  assets: {
    strategy: 'signedUrl',
    publicBaseUrl: 'https://via.placeholder.com',
    sign: {
      mode: 'mock',
      expiresSeconds: 300,
    },
  },
  community: {
    url: 'https://hub.captraw.com',
  },
};

let runtimeConfig: RuntimeConfig = DEFAULT_RUNTIME_CONFIG;
let hasLoadedConfig = false;

function mergeConfig(raw: any): RuntimeConfig {
  return {
    api: {
      baseUrl: raw?.api?.baseUrl || DEFAULT_RUNTIME_CONFIG.api.baseUrl,
    },
    assets: {
      strategy: raw?.assets?.strategy || DEFAULT_RUNTIME_CONFIG.assets.strategy,
      publicBaseUrl: raw?.assets?.publicBaseUrl || DEFAULT_RUNTIME_CONFIG.assets.publicBaseUrl,
      sign: {
        mode: raw?.assets?.sign?.mode || DEFAULT_RUNTIME_CONFIG.assets.sign.mode,
        expiresSeconds:
          raw?.assets?.sign?.expiresSeconds || DEFAULT_RUNTIME_CONFIG.assets.sign.expiresSeconds,
      },
    },
    community: {
      url: raw?.community?.url || DEFAULT_RUNTIME_CONFIG.community.url,
    },
  };
}

async function fetchYamlConfig(): Promise<string> {
  const response = await fetch('/config.yaml', { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Failed to load /config.yaml: ${response.status}`);
  }
  return response.text();
}

function parseSimpleYaml(yamlText: string): any {
  // Minimal parser for this project's flat/nested config shape.
  const result: any = {};
  const stack: Array<{ indent: number; obj: any }> = [{ indent: -1, obj: result }];

  const lines = yamlText.split('\n');
  for (const rawLine of lines) {
    const line = rawLine.replace(/\t/g, '  ');
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const indent = line.length - line.trimStart().length;
    while (stack.length > 1 && indent <= stack[stack.length - 1].indent) {
      stack.pop();
    }

    const current = stack[stack.length - 1].obj;
    const [rawKey, ...rest] = trimmed.split(':');
    const key = rawKey.trim();
    const rawValue = rest.join(':').trim();

    if (!rawValue) {
      current[key] = {};
      stack.push({ indent, obj: current[key] });
      continue;
    }

    let value: any = rawValue;
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    } else if (value === 'true' || value === 'false') {
      value = value === 'true';
    } else if (!Number.isNaN(Number(value))) {
      value = Number(value);
    }
    current[key] = value;
  }

  return result;
}

export async function loadRuntimeConfig(): Promise<RuntimeConfig> {
  if (hasLoadedConfig) return runtimeConfig;
  try {
    const yamlText = await fetchYamlConfig();
    runtimeConfig = mergeConfig(parseSimpleYaml(yamlText));
  } catch {
    runtimeConfig = DEFAULT_RUNTIME_CONFIG;
  } finally {
    hasLoadedConfig = true;
  }
  return runtimeConfig;
}

export function getRuntimeConfig(): RuntimeConfig {
  return runtimeConfig;
}

