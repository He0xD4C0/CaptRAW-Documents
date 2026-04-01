-- ============================================
-- 示例数据填充
-- ============================================

-- 注意：此文件用于填充示例数据，应在数据库初始化后运行
-- 生产环境应使用真实数据替换

-- ============================================
-- 服务器信息配置（从config.yaml同步）
-- ============================================

-- 基本服务器信息
INSERT INTO server_info (info_key, info_value, description, is_public, category) VALUES
  ('server_name', '"CaptRAW Documents"', '网站名称', true, 'general'),
  ('server_intro', '"一个专注于技术分享和文档管理的社区平台"', '网站介绍', true, 'general'),
  ('server_admin', '"@He0xD4C0@hub.captraw.com"', '管理员联邦身份', false, 'admin'),
  ('server_contact', '"contact@captraw.com"', '联系邮箱', true, 'contact'),
  ('server_version', '"1.0.0"', '系统版本', true, 'technical'),
  ('server_opensrc_location', '"https://github.com/captraw-community/CaptRAW-Documents"', '开源仓库地址', true, 'technical'),
  ('server_rule', '{"code_of_conduct": "尊重他人，保持友善", "content_policy": "禁止发布违法、侵权、骚扰等内容", "privacy_policy": "保护用户隐私，不泄露个人信息"}', '社区规则（JSON格式）', true, 'policy');

-- API配置（从config.yaml同步）
INSERT INTO server_info (info_key, info_value, description, is_public, category) VALUES
  ('api_base_url', '"http://localhost:3001/api"', 'API基础地址', true, 'api'),
  ('assets_strategy', '"signedUrl"', '资产策略（signedUrl/publicPrefix）', true, 'assets'),
  ('assets_public_base_url', '"https://via.placeholder.com"', '资产公共基础URL', true, 'assets'),
  ('community_url', '"https://hub.captraw.com"', '社区地址', true, 'community');

-- ============================================
-- 示例用户数据（支持联邦身份）
-- ============================================

-- 管理员用户
INSERT INTO users (fediverse_user_id, user_id, host_name, nickname, avatar_location, email, role) VALUES
  ('@He0xD4C0@hub.captraw.com', 'he0xd4c0', 'hub.captraw.com', 'He0xD4C0', 'user_menu_avatar', 'he0xd4c0@captraw.com', 'admin'),
  ('@admin@hub.captraw.com', 'admin', 'hub.captraw.com', '管理员', 'user_menu_avatar', 'admin@captraw.com', 'admin');

-- 示例作者用户
INSERT INTO users (fediverse_user_id, user_id, host_name, nickname, avatar_location, bio) VALUES
  ('@react_dev@hub.captraw.com', 'react_dev', 'hub.captraw.com', 'React开发者', 'article_1_author_avatar', '专注于React和前端开发'),
  ('@ts_master@hub.captraw.com', 'ts_master', 'hub.captraw.com', 'TypeScript专家', 'article_2_author_avatar', 'TypeScript类型系统专家'),
  ('@css_wizard@hub.captraw.com', 'css_wizard', 'hub.captraw.com', 'CSS魔法师', 'article_3_author_avatar', 'CSS和Tailwind CSS爱好者'),
  ('@node_guru@hub.captraw.com', 'node_guru', 'hub.captraw.com', 'Node.js大师', 'article_4_author_avatar', 'Node.js性能优化专家'),
  ('@devops_pro@hub.captraw.com', 'devops_pro', 'hub.captraw.com', 'DevOps专家', 'article_5_author_avatar', 'Docker和DevOps实践者');

-- ============================================
-- 示例文章数据
-- ============================================

-- 获取作者UUID用于关联
DO $$
DECLARE
  react_author UUID;
  ts_author UUID;
  css_author UUID;
  node_author UUID;
  devops_author UUID;
BEGIN
  SELECT user_uuid INTO react_author FROM users WHERE user_id = 'react_dev';
  SELECT user_uuid INTO ts_author FROM users WHERE user_id = 'ts_master';
  SELECT user_uuid INTO css_author FROM users WHERE user_id = 'css_wizard';
  SELECT user_uuid INTO node_author FROM users WHERE user_id = 'node_guru';
  SELECT user_uuid INTO devops_author FROM users WHERE user_id = 'devops_pro';

  -- 插入文章数据
  INSERT INTO articles (article_title, article_intro, article_content, author_id, article_asset_location, tags, status, views, likes, comments_count, read_time, is_featured) VALUES
    (
      'React Hooks深度解析',
      '深入理解React Hooks的工作原理和最佳实践',
      '# React Hooks深度解析\n\nReact Hooks是React 16.8引入的革命性特性，它让函数组件拥有了状态和生命周期等能力。\n\n## useState详解\n\nuseState是最基础的Hook，用于在函数组件中添加状态...\n\n## useEffect使用指南\n\neffect Hook可以让你在函数组件中执行副作用操作...\n\n## 自定义Hooks\n\n通过自定义Hook，可以将组件逻辑提取到可重用的函数中...',
      react_author,
      'article_1_cover',
      ARRAY['React', 'JavaScript', '前端'],
      'published',
      1250,
      89,
      24,
      8,
      true
    ),
    (
      'TypeScript类型系统进阶',
      '掌握TypeScript高级类型和泛型编程',
      '# TypeScript类型系统进阶\n\nTypeScript的类型系统是其最强大的特性之一，提供了静态类型检查和丰富的类型操作能力。\n\n## 泛型编程\n\n泛型允许我们创建可重用的组件...\n\n## 条件类型\n\n条件类型允许我们根据输入类型来推断输出类型...\n\n## 映射类型\n\n映射类型允许我们将一个类型映射到另一个类型...',
      ts_author,
      'article_2_cover',
      ARRAY['TypeScript', '编程', '类型安全'],
      'published',
      980,
      67,
      18,
      12,
      true
    ),
    (
      'Tailwind CSS实用技巧',
      '提高开发效率的Tailwind CSS技巧和模式',
      '# Tailwind CSS实用技巧\n\nTailwind CSS是一个功能类优先的CSS框架，通过组合实用类来构建自定义设计。\n\n## 响应式设计\n\nTailwind的响应式设计系统基于移动优先的理念...\n\n## 自定义配置\n\nTailwind支持通过配置文件进行深度定制...\n\n## 实用类组合\n\n掌握实用类的组合技巧可以大幅提高开发效率...',
      css_author,
      'article_3_cover',
      ARRAY['CSS', 'Tailwind', '前端'],
      'published',
      1560,
      112,
      32,
      6,
      true
    ),
    (
      'Node.js性能优化',
      '提升Node.js应用性能的实用方法',
      '# Node.js性能优化\n\nNode.js作为JavaScript运行时，在服务器端应用开发中非常流行。性能优化是Node.js应用开发中的重要环节。\n\n## 内存管理\n\nNode.js使用V8引擎的内存管理机制...\n\n## 异步编程\n\n合理的异步编程模式可以显著提升性能...\n\n## 集群模式\n\n使用集群模式充分利用多核CPU...',
      node_author,
      'article_4_cover',
      ARRAY['Node.js', '后端', '性能'],
      'published',
      890,
      54,
      15,
      10,
      false
    ),
    (
      'Docker容器化部署',
      '使用Docker部署Web应用的最佳实践',
      '# Docker容器化部署\n\nDocker是一个开源的应用容器引擎，让开发者可以打包应用及其依赖包到一个可移植的容器中。\n\n## Dockerfile编写\n\nDockerfile是构建Docker镜像的配置文件...\n\n## 多阶段构建\n\n多阶段构建可以减小镜像体积...\n\n## 容器编排\n\n使用Docker Compose进行容器编排...',
      devops_author,
      'article_5_cover',
      ARRAY['Docker', 'DevOps', '部署'],
      'published',
      2100,
      145,
      42,
      15,
      true
    );
END $$;

-- ============================================
-- 示例公告数据
-- ============================================

DO $$
DECLARE
  admin_author UUID;
  he0xd4c0_author UUID;
BEGIN
  SELECT user_uuid INTO admin_author FROM users WHERE user_id = 'admin';
  SELECT user_uuid INTO he0xd4c0_author FROM users WHERE user_id = 'he0xd4c0';

  INSERT INTO announcements (announce_title, announce_intro, announce_content, author_id, ann_asset_location, priority, is_active, end_time) VALUES
    (
      '系统维护通知',
      '为了提供更好的服务，我们将在本周六凌晨进行系统维护',
      '为了提供更好的服务，我们将在本周六凌晨2:00-4:00进行系统维护。在此期间，网站可能会暂时无法访问。请提前安排好您的工作，感谢您的理解与支持。',
      admin_author,
      'notice_1_author_avatar',
      10,
      true,
      CURRENT_TIMESTAMP + INTERVAL '7 days'
    ),
    (
      '新功能上线',
      '我们新增了文章投稿功能，欢迎大家积极投稿分享知识！',
      '我们新增了文章投稿功能，欢迎大家积极投稿分享知识！投稿功能支持Markdown编辑、图片上传、标签分类等功能。优秀文章将有机会被推荐到首页。',
      he0xd4c0_author,
      'notice_2_author_avatar',
      5,
      true,
      CURRENT_TIMESTAMP + INTERVAL '30 days'
    );
END $$;

-- ============================================
-- 示例横幅数据
-- ============================================

INSERT INTO banners (title, image_location, link_url, description, display_order, is_active, end_time) VALUES
  (
    '欢迎来到CaptRAW Documents',
    'banner_1_image',
    '/welcome',
    '加入我们的技术社区，分享知识，共同成长',
    1,
    true,
    CURRENT_TIMESTAMP + INTERVAL '90 days'
  ),
  (
    'React最佳实践指南',
    'banner_2_image',
    '/articles/react-best-practices',
    '从基础到高级，全面掌握React开发技巧',
    2,
    true,
    CURRENT_TIMESTAMP + INTERVAL '90 days'
  ),
  (
    'Tailwind CSS v4新特性',
    'banner_3_image',
    '/articles/tailwind-v4',
    '了解Tailwind CSS v4的新功能和改进',
    3,
    true,
    CURRENT_TIMESTAMP + INTERVAL '90 days'
  ),
  (
    '社区用户He0xD4C0',
    'banner_4_image',
    '/u/he0xd4c0',
    '关注活跃用户，获取最新技术分享',
    4,
    true,
    CURRENT_TIMESTAMP + INTERVAL '90 days'
  ),
  (
    'TypeScript进阶教程',
    'banner_5_image',
    '/articles/typescript-advanced',
    '深入学习TypeScript的高级特性',
    5,
    true,
    CURRENT_TIMESTAMP + INTERVAL '90 days'
  ),
  (
    'Node.js性能优化',
    'banner_6_image',
    '/articles/nodejs-performance',
    '学习Node.js应用的性能优化技巧',
    6,
    true,
    CURRENT_TIMESTAMP + INTERVAL '90 days'
  );

-- ============================================
-- 数据验证查询
-- ============================================

-- 查看插入的数据
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Articles', COUNT(*) FROM articles
UNION ALL
SELECT 'Announcements', COUNT(*) FROM announcements
UNION ALL
SELECT 'Banners', COUNT(*) FROM banners
UNION ALL
SELECT 'Server Info', COUNT(*) FROM server_info;

-- 查看服务器配置
SELECT info_key, info_value::text, description FROM server_info ORDER BY category, info_key;

-- 查看文章示例
SELECT a.article_title, u.nickname as author, a.tags, a.views, a.likes 
FROM articles a 
JOIN users u ON a.author_id = u.user_uuid 
ORDER BY a.release_time DESC 
LIMIT 5;