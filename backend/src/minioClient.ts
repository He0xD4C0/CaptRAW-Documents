import { Client } from 'minio';
import { AssetKind, getConfig } from './config';
import { encodeFediverseUsername } from './assetRegistry';

const cfg = getConfig();

export const minioClient = new Client({
  endPoint: cfg.objectStorage.endpoint,
  port: cfg.objectStorage.port,
  useSSL: cfg.objectStorage.secure,
  accessKey: cfg.objectStorage.accessKey,
  secretKey: cfg.objectStorage.secretKey,
  region: cfg.objectStorage.region,
});

export function buildObjectKey(params: {
  kind: AssetKind;
  uuid: string;
  username?: string;
  hostname?: string;
}): string {
  const { kind, uuid, username, hostname } = params;
  if (kind === 'user') {
    const encoded = encodeFediverseUsername(username || 'unknown', hostname || 'unknown');
    return `user/${encoded}/${uuid}`;
  }
  return `${kind}/${uuid}`;
}

export async function generateSignedUrl(objectKey: string, expiresSeconds: number): Promise<string> {
  return minioClient.presignedGetObject(cfg.objectStorage.bucket, objectKey, expiresSeconds);
}

