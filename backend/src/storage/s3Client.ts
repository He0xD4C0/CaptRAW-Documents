import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { AssetKind, getConfig } from '../config';
import { encodeFediverseUsername } from '../assetRegistry';

export interface S3Config {
  endpoint: string;
  port: number;
  bucket: string;
  accessKey: string;
  secretKey: string;
  region: string;
  secure: boolean;
}

export class S3StorageClient {
  private client: S3Client;
  private config: S3Config;
  
  constructor(config: S3Config) {
    this.config = config;
    
    // 构建完整的端点URL
    const endpoint = config.secure ? `https://${config.endpoint}:${config.port}` : `http://${config.endpoint}:${config.port}`;
    
    this.client = new S3Client({
      endpoint: endpoint,
      region: config.region,
      credentials: {
        accessKeyId: config.accessKey,
        secretAccessKey: config.secretKey,
      },
      forcePathStyle: true, // MinIO需要
      apiVersion: '2006-03-01',
    });
  }
  
  /**
   * 生成预签名URL
   */
  async generateSignedUrl(bucket: string, key: string, expiresIn: number = 300): Promise<string> {
    const command = new GetObjectCommand({ Bucket: bucket, Key: key });
    return getSignedUrl(this.client, command, { expiresIn });
  }
  
  /**
   * 上传对象
   */
  async uploadObject(bucket: string, key: string, body: Buffer | Uint8Array, contentType?: string): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    });
    await this.client.send(command);
  }
  
  /**
   * 删除对象
   */
  async deleteObject(bucket: string, key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    await this.client.send(command);
  }
  
  /**
   * 列出对象
   */
  async listObjects(bucket: string, prefix?: string): Promise<string[]> {
    const command = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix,
    });
    const response = await this.client.send(command);
    return response.Contents?.map(obj => obj.Key || '') || [];
  }
  
  /**
   * 检查对象是否存在
   */
  async objectExists(bucket: string, key: string): Promise<boolean> {
    try {
      // 尝试获取对象元数据
      await this.client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
      return true;
    } catch (error: any) {
      if (error.name === 'NoSuchKey' || error.name === 'NotFound') {
        return false;
      }
      throw error;
    }
  }
}

// 从配置创建S3客户端实例的单例
let s3ClientInstance: S3StorageClient | null = null;

export function getS3Client(): S3StorageClient {
  if (!s3ClientInstance) {
    const config = getConfig();
    s3ClientInstance = new S3StorageClient(config.objectStorage);
  }
  return s3ClientInstance;
}

// 工具函数：构建对象键
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

// 兼容性包装函数（用于逐步替换）
export async function generateSignedUrl(objectKey: string, expiresSeconds: number = 300): Promise<string> {
  const client = getS3Client();
  const config = getConfig();
  return client.generateSignedUrl(config.objectStorage.bucket, objectKey, expiresSeconds);
}