import { AssetKind } from './config';

export interface AssetRecord {
  kind: AssetKind;
  uuid: string;
  visibility: 'public' | 'private';
  ownerId?: string;
  username?: string;
  hostname?: string;
}

// 临时兼容层：从数据库查询资产记录
// 数据库没有记录时回退到硬编码数据（迁移期间）
const LEGACY_ASSET_REGISTRY: AssetRecord[] = [
  { kind: 'user', uuid: 'user_menu_avatar', visibility: 'public', username: 'He0xD4C0', hostname: 'hub.captraw.com' },
  { kind: 'user', uuid: 'current_user_avatar', visibility: 'public', ownerId: 'current_user', username: 'He0xD4C0', hostname: 'hub.captraw.com' },
  { kind: 'user', uuid: 'new_user_avatar', visibility: 'public', ownerId: 'new_user', username: 'new_user', hostname: 'hub.captraw.com' },
  { kind: 'article', uuid: 'article_1_cover', visibility: 'public' },
  { kind: 'article', uuid: 'article_2_cover', visibility: 'public' },
  { kind: 'article', uuid: 'article_3_cover', visibility: 'public' },
  { kind: 'article', uuid: 'article_4_cover', visibility: 'public' },
  { kind: 'article', uuid: 'article_5_cover', visibility: 'public' },
  { kind: 'banner', uuid: 'banner_1_image', visibility: 'public' },
  { kind: 'banner', uuid: 'banner_2_image', visibility: 'public' },
  { kind: 'banner', uuid: 'banner_3_image', visibility: 'public' },
  { kind: 'banner', uuid: 'banner_4_image', visibility: 'public' },
  { kind: 'banner', uuid: 'banner_5_image', visibility: 'public' },
  { kind: 'banner', uuid: 'banner_6_image', visibility: 'public' },
  { kind: 'notice', uuid: 'notice_1_author_avatar', visibility: 'public' },
  { kind: 'notice', uuid: 'notice_2_author_avatar', visibility: 'public' },
  { kind: 'notice', uuid: 'notice_3_author_avatar', visibility: 'public' },
  { kind: 'notice', uuid: 'notice_4_author_avatar', visibility: 'public' },
  { kind: 'notice', uuid: 'notice_5_author_avatar', visibility: 'public' },
  { kind: 'notice', uuid: 'notice_6_author_avatar', visibility: 'private', ownerId: 'admin' },
  { kind: 'notice', uuid: 'notice_7_author_avatar', visibility: 'public' },
];

export async function findAssetRecord(kind: AssetKind, uuid: string): Promise<AssetRecord | undefined> {
  // 临时解决方案：完全使用硬编码数据
  // TODO: 在第三阶段重构，与业务表（用户、文章、公告）集成
  const record = LEGACY_ASSET_REGISTRY.find((item) => item.kind === kind && item.uuid === uuid);
  
  if (!record) {
    console.warn(`Asset not found in legacy registry: ${kind}/${uuid}, please add to LEGACY_ASSET_REGISTRY`);
    // 返回一个默认的公共记录，避免API错误
    return {
      kind,
      uuid,
      visibility: 'public',
    };
  }
  
  return record;
}

export function canAccessAsset(record: AssetRecord, userId?: string): boolean {
  if (record.visibility === 'public') return true;
  if (!userId) return false;
  return record.ownerId === userId;
}

export function encodeFediverseUsername(username: string, hostname: string): string {
  return encodeURIComponent(`@${username}@${hostname}`);
}

