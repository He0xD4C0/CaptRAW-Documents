// 集中管理前端用到的各类 URL/baseUrl
// 当前先写死，后续可以由 config.yaml 或环境变量生成/注入

export const COMMUNITY_URL = 'https://hub.captraw.com';

// 占位图基础地址（目前用于 mock 头像、封面图等）
export const PLACEHOLDER_BASE_URL = 'https://via.placeholder.com';

export function buildPlaceholderUrl(path: string): string {
  if (!path) return path;

  // 已经是完整 URL 或 data URI 时直接返回
  if (/^https?:\/\//.test(path) || path.startsWith('data:')) {
    return path;
  }

  const normalized = path.replace(/^\/+/, '');
  return `${PLACEHOLDER_BASE_URL}/${normalized}`;
}

