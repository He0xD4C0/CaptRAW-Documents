// 本地开发用：在对象存储/签名接口未完全就绪时，把 assetUuid 映射到占位图路径。
export const ASSET_MOCK_PATH_MAP: Record<string, string> = {
  user_menu_avatar: '40/3b82f6/ffffff?text=U',
  current_user_avatar: '40/3b82f6/ffffff?text=U',
  new_user_avatar: '40/10b981/ffffff?text=N',

  article_1_author_avatar: '40/61dafb/ffffff?text=R',
  article_2_author_avatar: '40/3178c6/ffffff?text=T',
  article_3_author_avatar: '40/06b6d4/ffffff?text=W',
  article_4_author_avatar: '40/339933/ffffff?text=N',
  article_5_author_avatar: '40/2496ed/ffffff?text=D',

  article_1_cover: '300x200/61dafb/ffffff?text=React',
  article_2_cover: '300x200/3178c6/ffffff?text=TS',
  article_3_cover: '300x200/06b6d4/ffffff?text=TW',
  article_4_cover: '300x200/339933/ffffff?text=Node',
  article_5_cover: '300x200/2496ed/ffffff?text=Docker',

  notice_1_author_avatar: '40/3b82f6/ffffff?text=A',
  notice_2_author_avatar: '40/10b981/ffffff?text=H',
  notice_3_author_avatar: '40/8b5cf6/ffffff?text=M',
  notice_4_author_avatar: '40/f59e0b/ffffff?text=O',
  notice_5_author_avatar: '40/ef4444/ffffff?text=D',
  notice_6_author_avatar: '40/8b5cf6/ffffff?text=P',
  notice_7_author_avatar: '40/10b981/ffffff?text=F',

  banner_1_image: '800x400/3b82f6/ffffff?text=Welcome+to+CaptRAW',
  banner_2_image: '800x400/10b981/ffffff?text=React+Best+Practices',
  banner_3_image: '800x400/8b5cf6/ffffff?text=Tailwind+v4',
  banner_4_image: '800x400/f59e0b/ffffff?text=He0xD4C0',
  banner_5_image: '800x400/ef4444/ffffff?text=TypeScript+Advanced',
  banner_6_image: '800x400/06b6d4/ffffff?text=Node.js+Performance',
};

