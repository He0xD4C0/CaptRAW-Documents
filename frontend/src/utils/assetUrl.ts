import { getRuntimeConfig } from '../config/runtimeConfig';
import { ASSET_MOCK_PATH_MAP } from '../data/assetMockMap';

export type AssetKind = 'user' | 'article' | 'notice' | 'banner';

interface CacheEntry {
  url: string;
  expiresAtMs: number;
}
export interface AssetRequestItem {
  kind: AssetKind;
  assetUuid: string;
}

const signedUrlCache = new Map<string, CacheEntry>();

const ABSOLUTE_URL_RE = /^https?:\/\//i;

function cacheKey(kind: AssetKind, assetUuid: string): string {
  return `${kind}:${assetUuid}`;
}

function isAbsoluteAssetUrl(assetUuid: string): boolean {
  return ABSOLUTE_URL_RE.test(assetUuid) || assetUuid.startsWith('data:');
}

function getSignedFromCache(kind: AssetKind, assetUuid: string): string | undefined {
  const entry = signedUrlCache.get(cacheKey(kind, assetUuid));
  if (!entry) return undefined;
  if (entry.expiresAtMs <= Date.now()) {
    signedUrlCache.delete(cacheKey(kind, assetUuid));
    return undefined;
  }
  return entry.url;
}

function setSignedCache(kind: AssetKind, assetUuid: string, url: string, expiresAtMs: number): void {
  signedUrlCache.set(cacheKey(kind, assetUuid), { url, expiresAtMs });
}

function buildPublicAssetUrl(assetUuid: string): string {
  if (isAbsoluteAssetUrl(assetUuid)) return assetUuid;
  const base = getRuntimeConfig().assets.publicBaseUrl.replace(/\/+$/, '');
  const mapped = ASSET_MOCK_PATH_MAP[assetUuid] || assetUuid;
  const path = mapped.replace(/^\/+/, '');
  return `${base}/${path}`;
}

async function requestSignedUrl(kind: AssetKind, assetUuid: string): Promise<string> {
  const cfg = getRuntimeConfig();
  const query = new URLSearchParams({ kind, uuid: assetUuid });
  const response = await fetch(`${cfg.api.baseUrl}/assets/sign?${query.toString()}`);
  if (!response.ok) {
    throw new Error(`sign failed: ${response.status}`);
  }

  const body = await response.json();
  const signedUrl: string | undefined =
    body?.data?.signedUrl ?? body?.data?.url ?? body?.signedUrl ?? body?.url;

  if (!signedUrl) {
    throw new Error('signed url missing');
  }

  const expiresSeconds = cfg.assets.sign.expiresSeconds || 300;
  setSignedCache(kind, assetUuid, signedUrl, Date.now() + expiresSeconds * 1000);
  return signedUrl;
}

async function requestBatchSignedUrls(items: AssetRequestItem[]): Promise<Record<string, string>> {
  const cfg = getRuntimeConfig();
  const response = await fetch(`${cfg.api.baseUrl}/assets/sign`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: items.map((item) => ({ kind: item.kind, uuid: item.assetUuid })),
    }),
  });
  if (!response.ok) {
    throw new Error(`batch sign failed: ${response.status}`);
  }

  const body = await response.json();
  const list: Array<any> = body?.data || [];
  const out: Record<string, string> = {};
  const expiresSeconds = cfg.assets.sign.expiresSeconds || 300;

  for (const item of list) {
    if (!item?.signedUrl || !item?.kind || !item?.uuid) continue;
    const key = cacheKey(item.kind as AssetKind, String(item.uuid));
    out[key] = String(item.signedUrl);
    setSignedCache(item.kind as AssetKind, String(item.uuid), String(item.signedUrl), Date.now() + expiresSeconds * 1000);
  }
  return out;
}

export async function resolveAssetUrl(kind: AssetKind, assetUuid?: string): Promise<string | undefined> {
  if (!assetUuid) return undefined;
  if (isAbsoluteAssetUrl(assetUuid)) return assetUuid;

  const cfg = getRuntimeConfig();
  if (cfg.assets.strategy === 'publicPrefix') {
    return buildPublicAssetUrl(assetUuid);
  }

  const cached = getSignedFromCache(kind, assetUuid);
  if (cached) return cached;

  try {
    return await requestSignedUrl(kind, assetUuid);
  } catch {
    // 后端未就绪时，回退到 publicPrefix 保证开发可用
    return buildPublicAssetUrl(assetUuid);
  }
}

export async function resolveAssetUrlsBatch(
  items: AssetRequestItem[]
): Promise<Record<string, string | undefined>> {
  const cfg = getRuntimeConfig();
  const result: Record<string, string | undefined> = {};
  const unresolved: AssetRequestItem[] = [];

  for (const item of items) {
    const key = cacheKey(item.kind, item.assetUuid);
    if (!item.assetUuid) {
      result[key] = undefined;
      continue;
    }
    if (cfg.assets.strategy === 'publicPrefix' || isAbsoluteAssetUrl(item.assetUuid)) {
      result[key] = buildPublicAssetUrl(item.assetUuid);
      continue;
    }
    const cached = getSignedFromCache(item.kind, item.assetUuid);
    if (cached) {
      result[key] = cached;
      continue;
    }
    unresolved.push(item);
  }

  if (!unresolved.length) return result;

  try {
    const signed = await requestBatchSignedUrls(unresolved);
    for (const item of unresolved) {
      const key = cacheKey(item.kind, item.assetUuid);
      result[key] = signed[key] || buildPublicAssetUrl(item.assetUuid);
    }
  } catch {
    for (const item of unresolved) {
      result[cacheKey(item.kind, item.assetUuid)] = buildPublicAssetUrl(item.assetUuid);
    }
  }

  return result;
}

export function clearAssetUrlCache(): void {
  signedUrlCache.clear();
}

