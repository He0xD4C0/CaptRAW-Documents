import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import UserAvatar from '../ui/UserAvatar';
import { useLatestArticles } from '../../hooks/useArticles';
import { Article } from '../../types';
import AssetImage from '../ui/AssetImage';

const ArticleTimeline: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // 使用React Query获取文章数据
  const { data: articlesResponse, isLoading: initialLoading, error } = useLatestArticles();
  
  // 初始化数据
  useEffect(() => {
    if (articlesResponse?.success && articlesResponse.data) {
      setArticles(articlesResponse.data);
    }
  }, [articlesResponse]);

  // 格式化时间
  const formatTime = (timeString: string) => {
    return timeString.split(' ')[0];
  };

  // 渲染标题结构
  const renderHeadings = (headings: Article['headings']) => {
    return (
      <div className="space-y-1 text-sm">
        {headings.slice(0, 5).map((heading, index) => (
          <div 
            key={index} 
            className={`flex items-start ${
              heading.level === 1 ? 'font-medium text-gray-800 dark:text-gray-200' : 
              heading.level === 2 ? 'ml-4 text-gray-600 dark:text-gray-400' : 
              'ml-8 text-gray-500 dark:text-gray-500'
            }`}
          >
            <span className="mr-2">•</span>
            <span>{heading.text}</span>
          </div>
        ))}
        {headings.length > 5 && (
          <div className="text-gray-500 dark:text-gray-400 text-sm ml-4">
            ...还有{headings.length - 5}个章节
          </div>
        )}
      </div>
    );
  };

  // 加载更多文章
  const loadMoreArticles = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    
    try {
      // 这里可以调用分页API，目前使用模拟数据
      // 在实际项目中，应该调用带分页参数的API
      const nextPage = page + 1;
      
      // 模拟API调用延迟
      setTimeout(() => {
        // 这里应该调用API获取下一页数据
        // 暂时使用空数组表示没有更多数据
        const nextArticles: Article[] = [];
        
        if (nextArticles.length === 0) {
          setHasMore(false);
        } else {
          setArticles(prev => [...prev, ...nextArticles]);
          setPage(nextPage);
        }
        
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('加载更多文章失败:', error);
      setLoading(false);
    }
  }, [hasMore, loading, page]);

  // 设置Intersection Observer
  useEffect(() => {
    if (!loadMoreRef.current || !hasMore || loading) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreArticles();
        }
      },
      { threshold: 0.5 }
    );

    observerRef.current.observe(loadMoreRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loading, loadMoreArticles]);

  // 初始加载状态
  if (initialLoading) {
    return (
      <div className="space-y-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 animate-pulse">
            <div className="md:flex">
              <div className="md:w-1/3">
                <div className="h-48 md:h-full bg-gray-300 dark:bg-gray-700"></div>
              </div>
              <div className="md:w-2/3 p-6">
                <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded mb-4 w-3/4"></div>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
                  ))}
                </div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-4 w-full"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-4 w-2/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8 text-center">
          <svg className="w-16 h-16 text-red-500 dark:text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-semibold text-red-700 dark:text-red-300 mb-3">加载文章失败</h3>
          <p className="text-red-600 dark:text-red-400 mb-6">无法加载文章信息，请稍后重试</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
          >
            重新加载
          </button>
        </div>
      </div>
    );
  }

  // 无数据状态
  if (articles.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center">
          <svg className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">暂无文章</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">当前没有可显示的文章，快来发表你的第一篇吧！</p>
          <Link
            to="/submit"
            className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            发表文章
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {articles.map((article) => (
        <Link
          key={article.id}
          to={`/articles/${article.id}`}
          className="block group"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
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

                {/* 摘要 */}
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {article.excerpt}
                </p>

                {/* 文章结构 */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    文章结构：
                  </h4>
                  {renderHeadings(article.headings)}
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}

      {/* 加载更多指示器 */}
      <div ref={loadMoreRef} className="text-center py-6">
        {loading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600 dark:text-gray-400">加载更多文章...</span>
          </div>
        ) : hasMore ? (
          <button
            onClick={loadMoreArticles}
            className="inline-flex items-center justify-center px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            加载更多
          </button>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500 dark:text-gray-400 mb-2">
              没有更多文章了
            </p>
            <Link
              to="/catalog"
              className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
            >
              浏览全部文章
              <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleTimeline;