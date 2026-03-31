import React from 'react';
import { Link } from 'react-router-dom';
import UserAvatar from '../ui/UserAvatar';
import { Article } from '../../types';
import AssetImage from '../ui/AssetImage';

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'compact' | 'featured';
  showExcerpt?: boolean;
  showHeadings?: boolean;
  showTags?: boolean;
  className?: string;
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  variant = 'default',
  showExcerpt = true,
  showHeadings = false,
  showTags = true,
  className = '',
}) => {
  // 格式化时间
  const formatTime = (timeString: string) => {
    return timeString.split(' ')[0];
  };

  // 渲染标题结构
  const renderHeadings = (headings: Article['headings']) => {
    if (headings.length === 0) return null;

    return (
      <div className="space-y-1 text-sm mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          文章结构：
        </h4>
        {headings.slice(0, 3).map((heading, index) => (
          <div 
            key={index} 
            className={`flex items-start ${
              heading.level === 1 ? 'font-medium text-gray-800 dark:text-gray-200' : 
              heading.level === 2 ? 'ml-4 text-gray-600 dark:text-gray-400' : 
              'ml-8 text-gray-500 dark:text-gray-500'
            }`}
          >
            <span className="mr-2">•</span>
            <span className="truncate">{heading.text}</span>
          </div>
        ))}
        {headings.length > 3 && (
          <div className="text-gray-500 dark:text-gray-400 text-sm ml-4">
            ...还有{headings.length - 3}个章节
          </div>
        )}
      </div>
    );
  };

  // 紧凑模式
  if (variant === 'compact') {
    return (
      <Link
        to={`/articles/${article.id}`}
        className={`block group ${className}`}
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-start space-x-4">
            {article.coverImage && (
              <div className="flex-shrink-0">
                <AssetImage
                  kind="article"
                  assetUuid={article.coverImage}
                  alt={article.title}
                  className="w-20 h-20 object-cover rounded"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 truncate mb-1">
                {article.title}
              </h3>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                <UserAvatar 
                  src={article.author.avatar} 
                  alt={article.author.name}
                  size="xs"
                />
                <span className="ml-2">{article.author.name}</span>
                <span className="mx-2">•</span>
                <span>{formatTime(article.createdAt)}</span>
              </div>
              {showExcerpt && (
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                  {article.excerpt}
                </p>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // 特色模式
  if (variant === 'featured') {
    return (
      <Link
        to={`/articles/${article.id}`}
        className={`block group ${className}`}
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
          {article.coverImage && (
            <div className="relative h-48 overflow-hidden">
              <AssetImage
                kind="article"
                assetUuid={article.coverImage}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          )}
          <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 mb-3">
              {article.title}
            </h3>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
              <UserAvatar 
                src={article.author.avatar} 
                alt={article.author.name}
                size="sm"
              />
              <div className="ml-3">
                <p className="font-medium">{article.author.name}</p>
                <p className="text-xs">{formatTime(article.createdAt)} • {article.readTime}分钟阅读</p>
              </div>
            </div>
            {showExcerpt && (
              <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                {article.excerpt}
              </p>
            )}
            {showTags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {article.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-full text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
                {article.tags.length > 3 && (
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs">
                    +{article.tags.length - 3}
                  </span>
                )}
              </div>
            )}
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>{article.views} 次阅读</span>
              <span>{article.likes} 个赞</span>
              <span>{article.commentsCount} 条评论</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // 默认模式
  return (
    <Link
      to={`/articles/${article.id}`}
      className={`block group ${className}`}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="md:flex">
          {/* 封面图片 */}
          {article.coverImage && (
            <div className="md:w-1/3">
              <div className="h-48 md:h-full relative overflow-hidden">
                <AssetImage
                  kind="article"
                  assetUuid={article.coverImage}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </div>
          )}

          {/* 文章内容 */}
          <div className={`p-6 ${article.coverImage ? 'md:w-2/3' : 'w-full'}`}>
            {/* 标题和元数据 */}
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 mb-2">
                {article.title}
              </h3>
              
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mb-3">
                <div className="flex items-center space-x-2">
                  <UserAvatar 
                    src={article.author.avatar} 
                    alt={article.author.name}
                    size="sm"
                  />
                  <span>{article.author.name}</span>
                </div>
                <span>•</span>
                <span>{formatTime(article.createdAt)}</span>
                <span>•</span>
                <span>{article.readTime}分钟阅读</span>
              </div>
            </div>

            {/* 标签 */}
            {showTags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-full text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* 摘要 */}
            {showExcerpt && (
              <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                {article.excerpt}
              </p>
            )}

            {/* 文章结构 */}
            {showHeadings && renderHeadings(article.headings)}

            {/* 统计数据 */}
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {article.views}
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  {article.likes}
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {article.commentsCount}
                </span>
              </div>
              <span className="text-primary-600 dark:text-primary-400 font-medium">
                阅读全文 →
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;