#!/usr/bin/env ts-node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const config_1 = require("../src/config");
const s3Client_1 = require("../src/storage/s3Client");
const database_1 = require("../src/database");
// 编码联邦用户名
function encodeFediverseUsername(username, hostname) {
    return encodeURIComponent(`@${username}@${hostname}`);
}
// 从配置构建对象键
function buildObjectKey(kind, uuid, username, hostname) {
    if (kind === 'user') {
        const encoded = encodeFediverseUsername(username || 'unknown', hostname || 'unknown');
        return `user/${encoded}/${uuid}`;
    }
    return `${kind}/${uuid}`;
}
// 加载示例数据
function loadExampleData() {
    const frontendDataPath = path_1.default.resolve(__dirname, '../../frontend/src/data');
    const articles = JSON.parse(fs_1.default.readFileSync(path_1.default.join(frontendDataPath, 'articles.json'), 'utf8'));
    const banners = JSON.parse(fs_1.default.readFileSync(path_1.default.join(frontendDataPath, 'banners.json'), 'utf8'));
    const notices = JSON.parse(fs_1.default.readFileSync(path_1.default.join(frontendDataPath, 'notices.json'), 'utf8'));
    return { articles, banners, notices };
}
// 生成资产元数据
function generateAssetMetadata() {
    const { articles, banners, notices } = loadExampleData();
    const assets = [];
    // 用户资产
    assets.push({
        uuid: 'user_menu_avatar',
        kind: 'user',
        objectKey: buildObjectKey('user', 'user_menu_avatar', 'He0xD4C0', 'hub.captraw.com'),
        visibility: 'public',
        username: 'He0xD4C0',
        hostname: 'hub.captraw.com',
    }, {
        uuid: 'current_user_avatar',
        kind: 'user',
        objectKey: buildObjectKey('user', 'current_user_avatar', 'He0xD4C0', 'hub.captraw.com'),
        visibility: 'public',
        ownerId: 'current_user',
        username: 'He0xD4C0',
        hostname: 'hub.captraw.com',
    }, {
        uuid: 'new_user_avatar',
        kind: 'user',
        objectKey: buildObjectKey('user', 'new_user_avatar', 'new_user', 'hub.captraw.com'),
        visibility: 'public',
        ownerId: 'new_user',
        username: 'new_user',
        hostname: 'hub.captraw.com',
    });
    // 文章封面资产
    articles.forEach((article, index) => {
        const uuid = article.coverImage;
        if (uuid) {
            assets.push({
                uuid,
                kind: 'article',
                objectKey: buildObjectKey('article', uuid),
                visibility: 'public',
            });
        }
        // 文章作者头像
        const authorUuid = article.author.avatar;
        if (authorUuid) {
            assets.push({
                uuid: authorUuid,
                kind: 'user',
                objectKey: buildObjectKey('user', authorUuid, article.author.id, 'hub.captraw.com'),
                visibility: 'public',
                username: article.author.id,
                hostname: 'hub.captraw.com',
            });
        }
    });
    // 横幅资产
    banners.forEach((banner) => {
        const uuid = banner.image;
        if (uuid) {
            assets.push({
                uuid,
                kind: 'banner',
                objectKey: buildObjectKey('banner', uuid),
                visibility: 'public',
            });
        }
    });
    // 公告作者头像资产
    notices.forEach((notice) => {
        const uuid = notice.author.avatar;
        if (uuid) {
            assets.push({
                uuid,
                kind: 'notice',
                objectKey: buildObjectKey('notice', uuid),
                visibility: uuid === 'notice_6_author_avatar' ? 'private' : 'public',
                ownerId: uuid === 'notice_6_author_avatar' ? 'admin' : undefined,
            });
        }
    });
    return assets;
}
// 准备示例图片内容
async function prepareImageContent() {
    // 检查是否有示例图片文件
    const exampleImagePath = path_1.default.resolve(__dirname, '../../Reference/resource/useravatar-1024x1024.png');
    if (fs_1.default.existsSync(exampleImagePath)) {
        console.log(`使用示例图片: ${exampleImagePath}`);
        return fs_1.default.readFileSync(exampleImagePath);
    }
    // 如果没有示例图片，创建一个简单的PNG占位符
    console.log('创建PNG占位符');
    // 创建一个简单的1x1透明PNG
    const pngHeader = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
    const ihdrChunk = Buffer.from([
        0x00, 0x00, 0x00, 0x0D, // 长度
        0x49, 0x48, 0x44, 0x52, // "IHDR"
        0x00, 0x00, 0x00, 0x01, // 宽度
        0x00, 0x00, 0x00, 0x01, // 高度
        0x08, // 位深度
        0x06, // 颜色类型
        0x00, // 压缩方法
        0x00, // 过滤方法
        0x00, // 交错方法
        0xAF, 0xCE, 0x1C, 0xE9, // CRC
    ]);
    const iendChunk = Buffer.from([
        0x00, 0x00, 0x00, 0x00, // 长度
        0x49, 0x45, 0x4E, 0x44, // "IEND"
        0xAE, 0x42, 0x60, 0x82, // CRC
    ]);
    return Buffer.concat([pngHeader, ihdrChunk, iendChunk]);
}
async function main() {
    console.log('=== 开始资产迁移 ===');
    // 获取配置
    const config = (0, config_1.getConfig)();
    console.log(`存储桶: ${config.objectStorage.bucket}`);
    console.log(`数据库URL: ${config.database.url}`);
    // 初始化S3客户端
    const s3Client = new s3Client_1.S3StorageClient(config.objectStorage);
    // 生成资产元数据
    console.log('生成资产元数据...');
    const assets = generateAssetMetadata();
    console.log(`共发现 ${assets.length} 个资产`);
    // 准备图片内容
    console.log('准备图片内容...');
    const imageContent = await prepareImageContent();
    const mimeType = 'image/png';
    const sizeBytes = imageContent.length;
    // 上传资产到MinIO并插入数据库记录
    console.log('开始上传资产...');
    const dbAssets = [];
    for (const asset of assets) {
        console.log(`处理资产: ${asset.kind}/${asset.uuid}`);
        try {
            // 检查对象是否已存在
            const exists = await s3Client.objectExists(config.objectStorage.bucket, asset.objectKey);
            if (!exists) {
                // 上传到MinIO
                console.log(`  上传到: ${asset.objectKey}`);
                await s3Client.uploadObject(config.objectStorage.bucket, asset.objectKey, imageContent, mimeType);
            }
            else {
                console.log(`  已存在: ${asset.objectKey}`);
            }
            // 添加到数据库记录列表
            dbAssets.push({
                uuid: asset.uuid,
                kind: asset.kind,
                object_key: asset.objectKey,
                mime_type: mimeType,
                size_bytes: sizeBytes,
                visibility: asset.visibility,
                owner_id: asset.ownerId || null,
                username: asset.username || null,
                hostname: asset.hostname || null,
            });
        }
        catch (error) {
            console.error(`  处理失败:`, error);
        }
    }
    // 批量插入数据库
    console.log('插入数据库记录...');
    try {
        const inserted = await (0, database_1.batchInsertAssets)(dbAssets);
        console.log(`成功插入 ${inserted.length} 条记录到数据库`);
        // 验证数据库记录
        console.log('\n数据库资产记录:');
        inserted.forEach(record => {
            console.log(`  ${record.kind}/${record.uuid} -> ${record.object_key}`);
        });
    }
    catch (error) {
        console.error('数据库插入失败:', error);
        throw error;
    }
    // 验证MinIO内容
    console.log('\n验证MinIO存储桶内容...');
    try {
        const objects = await s3Client.listObjects(config.objectStorage.bucket);
        console.log(`存储桶中共有 ${objects.length} 个对象:`);
        objects.forEach(obj => console.log(`  ${obj}`));
    }
    catch (error) {
        console.error('验证失败:', error);
    }
    console.log('\n✅ 资产迁移完成!');
    console.log('\n资产映射关系:');
    console.log('===============');
    assets.forEach(asset => {
        console.log(`${asset.uuid} -> ${asset.objectKey}`);
    });
}
// 错误处理
if (require.main === module) {
    main().catch(error => {
        console.error('资产迁移失败:', error);
        process.exit(1);
    });
}
