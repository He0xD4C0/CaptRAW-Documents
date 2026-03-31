import { Router, Request } from 'express';
import { AssetKind, getConfig } from './config';
import { canAccessAsset, findAssetRecord } from './assetRegistry';
import { buildObjectKey, generateSignedUrl } from './minioClient';
import { ASSET_MOCK_PATH_MAP } from './assetMockMap';

interface SignRequestItem {
  kind: AssetKind;
  uuid: string;
}

function getUserId(req: Request): string | undefined {
  const fromHeader = req.header('x-user-id');
  if (fromHeader) return fromHeader;
  return undefined;
}

function parseSingle(req: Request): SignRequestItem | null {
  const kind = req.query.kind as AssetKind | undefined;
  const uuid = req.query.uuid as string | undefined;
  if (!kind || !uuid) return null;
  return { kind, uuid };
}

function parseBatch(req: Request): SignRequestItem[] {
  const items = req.body?.items;
  if (!Array.isArray(items)) return [];
  return items
    .filter((item) => item?.kind && item?.uuid)
    .map((item) => ({ kind: item.kind as AssetKind, uuid: String(item.uuid) }));
}

async function signOne(item: SignRequestItem, userId?: string) {
  const record = findAssetRecord(item.kind, item.uuid);
  if (!record) {
    return { kind: item.kind, uuid: item.uuid, error: 'not_found', status: 404 };
  }

  if (!canAccessAsset(record, userId)) {
    return { kind: item.kind, uuid: item.uuid, error: 'forbidden', status: 403 };
  }

  const cfg = getConfig();
  const expires = cfg.assets.sign.expiresSeconds || 300;
  if (cfg.assets.sign.mode === 'mock') {
    const path = ASSET_MOCK_PATH_MAP[item.uuid] || item.uuid;
    const base = cfg.assets.publicBaseUrl.replace(/\/+$/, '');
    const normalized = path.replace(/^\/+/, '');
    return {
      kind: item.kind,
      uuid: item.uuid,
      signedUrl: `${base}/${normalized}`,
      expiresIn: expires,
    };
  }

  const objectKey = buildObjectKey({
    kind: record.kind,
    uuid: record.uuid,
    username: record.username,
    hostname: record.hostname,
  });

  const signedUrl = await generateSignedUrl(objectKey, expires);
  return {
    kind: item.kind,
    uuid: item.uuid,
    signedUrl,
    expiresIn: expires,
  };
}

export function createAssetSignRouter(): Router {
  const router = Router();

  router.get('/sign', async (req, res) => {
    const item = parseSingle(req);
    if (!item) {
      return res.status(400).json({ success: false, error: 'kind and uuid are required' });
    }

    try {
      const result = await signOne(item, getUserId(req));
      if ('error' in result) {
        const status = result.status || 403;
        return res.status(status).json({ success: false, error: result.error, kind: result.kind, uuid: result.uuid });
      }
      return res.json({ success: true, data: result });
    } catch (error) {
      return res.status(500).json({ success: false, error: 'sign_failed', detail: String(error) });
    }
  });

  router.post('/sign', async (req, res) => {
    const items = parseBatch(req);
    if (!items.length) {
      return res.status(400).json({ success: false, error: 'items are required' });
    }

    try {
      const signed = await Promise.all(items.map((item) => signOne(item, getUserId(req))));
      return res.json({ success: true, data: signed });
    } catch (error) {
      return res.status(500).json({ success: false, error: 'batch_sign_failed', detail: String(error) });
    }
  });

  return router;
}

