-- 创建扩展（如果需要）
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 创建时区扩展
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 设置搜索路径
SET search_path TO public;

-- ============================================
-- 核心业务表（取代资产表，实现uuid到资产的映射）
-- ============================================

-- 用户表（联邦身份支持）
CREATE TABLE users (
  user_uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fediverse_user_id VARCHAR(255) NOT NULL UNIQUE,      -- 联邦用户ID @userId@host_name 格式
  user_id VARCHAR(255) NOT NULL UNIQUE,               -- 本地用户ID
  host_name VARCHAR(255) NOT NULL,                    -- 联邦服务器主机名
  nickname VARCHAR(255) NOT NULL,                     -- 显示昵称
  avatar_location VARCHAR(500),                       -- 头像资产位置（MinIO对象键）
  email VARCHAR(255) UNIQUE,                          -- 邮箱（可选，用于本地用户）
  password_hash VARCHAR(255),                         -- 密码哈希（可选，用于本地用户）
  bio TEXT,                                           -- 个人简介
  role VARCHAR(50) DEFAULT 'user',                    -- 角色：user, admin, moderator
  is_active BOOLEAN DEFAULT TRUE,                     -- 是否激活
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 文章表
CREATE TABLE articles (
  article_uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_title VARCHAR(500) NOT NULL,                -- 文章标题
  article_intro TEXT,                                 -- 文章简介
  article_content TEXT NOT NULL,                      -- 文章内容（Markdown格式）
  release_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,   -- 发布时间
  author_id UUID NOT NULL REFERENCES users(user_uuid), -- 作者ID
  article_asset_location VARCHAR(500),                -- 封面图资产位置
  tags VARCHAR(255)[],                                -- 标签数组
  status VARCHAR(50) DEFAULT 'draft',                 -- 状态：draft, published, archived
  views INTEGER DEFAULT 0,                            -- 浏览次数
  likes INTEGER DEFAULT 0,                            -- 点赞数
  comments_count INTEGER DEFAULT 0,                   -- 评论数
  read_time INTEGER,                                  -- 阅读时间（分钟）
  is_featured BOOLEAN DEFAULT FALSE,                  -- 是否精选
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 公告表
CREATE TABLE announcements (
  announce_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  announce_title VARCHAR(500) NOT NULL,               -- 公告标题
  announce_intro TEXT,                                -- 公告简介
  announce_content TEXT NOT NULL,                     -- 公告内容
  author_id UUID NOT NULL REFERENCES users(user_uuid), -- 作者ID
  ann_asset_location VARCHAR(500),                    -- 公告相关资产位置
  priority INTEGER DEFAULT 0,                         -- 优先级（用于排序）
  is_active BOOLEAN DEFAULT TRUE,                     -- 是否有效
  start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,     -- 开始显示时间
  end_time TIMESTAMP,                                 -- 结束显示时间
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 横幅表（保持原有功能）
CREATE TABLE banners (
  banner_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,                        -- 横幅标题
  image_location VARCHAR(500) NOT NULL,               -- 图片资产位置
  link_url VARCHAR(500),                              -- 链接地址
  description TEXT,                                   -- 描述
  is_active BOOLEAN DEFAULT TRUE,                     -- 是否激活
  display_order INTEGER DEFAULT 0,                    -- 显示顺序
  start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,     -- 开始时间
  end_time TIMESTAMP,                                 -- 结束时间
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 服务器信息表（存储服务器相关配置）
CREATE TABLE server_info (
  info_key VARCHAR(255) PRIMARY KEY,                  -- 配置键名
  info_value JSONB NOT NULL DEFAULT '{}'::jsonb,      -- 配置值（JSON格式）
  description TEXT,                                   -- 配置描述
  is_public BOOLEAN DEFAULT TRUE,                     -- 是否公开（前端可访问）
  category VARCHAR(100),                              -- 分类（用于分组）
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 索引创建
-- ============================================

-- 用户表索引
CREATE INDEX idx_users_user_id ON users(user_id);
CREATE INDEX idx_users_fediverse_id ON users(fediverse_user_id);
CREATE INDEX idx_users_host_name ON users(host_name);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);

-- 文章表索引
CREATE INDEX idx_articles_author_id ON articles(author_id);
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_release_time ON articles(release_time);
CREATE INDEX idx_articles_is_featured ON articles(is_featured);
CREATE INDEX idx_articles_views ON articles(views);
CREATE INDEX idx_articles_likes ON articles(likes);
CREATE INDEX idx_articles_tags ON articles USING GIN(tags);
CREATE INDEX idx_articles_created_at ON articles(created_at);

-- 公告表索引
CREATE INDEX idx_announcements_author_id ON announcements(author_id);
CREATE INDEX idx_announcements_is_active ON announcements(is_active);
CREATE INDEX idx_announcements_priority ON announcements(priority);
CREATE INDEX idx_announcements_start_time ON announcements(start_time);
CREATE INDEX idx_announcements_created_at ON announcements(created_at);

-- 横幅表索引
CREATE INDEX idx_banners_is_active ON banners(is_active);
CREATE INDEX idx_banners_display_order ON banners(display_order);
CREATE INDEX idx_banners_start_time ON banners(start_time);
CREATE INDEX idx_banners_created_at ON banners(created_at);

-- 服务器信息表索引
CREATE INDEX idx_server_info_category ON server_info(category);
CREATE INDEX idx_server_info_is_public ON server_info(is_public);
CREATE INDEX idx_server_info_created_at ON server_info(created_at);

-- ============================================
-- 通用更新时间触发器
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为所有表添加更新时间触发器
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at
    BEFORE UPDATE ON articles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at
    BEFORE UPDATE ON announcements
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_banners_updated_at
    BEFORE UPDATE ON banners
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_server_info_updated_at
    BEFORE UPDATE ON server_info
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();