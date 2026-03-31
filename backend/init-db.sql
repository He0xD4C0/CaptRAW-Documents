-- 创建扩展（如果需要）
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 创建时区扩展
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 设置搜索路径
SET search_path TO public;

-- 创建资产元数据表
CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uuid VARCHAR(255) NOT NULL UNIQUE,      -- 前端使用的 assetUuid
  kind VARCHAR(50) NOT NULL,              -- 'user' | 'article' | 'notice' | 'banner'
  object_key VARCHAR(500) NOT NULL,       -- 存储桶中的对象键
  mime_type VARCHAR(100),                 -- 文件类型
  size_bytes BIGINT,                      -- 文件大小
  visibility VARCHAR(20) DEFAULT 'public', -- 'public' | 'private'
  owner_id VARCHAR(255),                  -- 所有者ID（用户ID）
  username VARCHAR(255),                  -- 联邦用户名（fediverse username）
  hostname VARCHAR(255),                  -- 联邦主机名（fediverse hostname）
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX idx_assets_uuid ON assets(uuid);
CREATE INDEX idx_assets_kind ON assets(kind);
CREATE INDEX idx_assets_owner ON assets(owner_id);
CREATE INDEX idx_assets_visibility ON assets(visibility);
CREATE INDEX idx_assets_username_hostname ON assets(username, hostname);

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_assets_updated_at
    BEFORE UPDATE ON assets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();