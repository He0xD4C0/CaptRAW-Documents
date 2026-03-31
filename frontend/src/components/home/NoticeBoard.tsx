import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import UserAvatar from '../ui/UserAvatar';
import { useLatestNotices } from '../../hooks/useNotices';
import { Notice } from '../../types';

const NoticeBoard: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // 使用React Query获取公告数据
  const { data: noticesResponse, isLoading: initialLoading, error } = useLatestNotices(3);
  
  // 初始化数据
  useEffect(() => {
    if (noticesResponse?.success && noticesResponse.data) {
      setNotices(noticesResponse.data);
    }
  }, [noticesResponse]);

  // 检查时效性
  const isExpired = (expiresAt?: string) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  // 加载更多公告
  const loadMoreNotices = useCallback(async () => {
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
        const nextNotices: Notice[] = [];
        
        if (nextNotices.length === 0) {
          setHasMore(false);
        } else {
          setNotices(prev => [...prev, ...nextNotices]);
          setPage(nextPage);
        }
        
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('加载更多公告失败:', error);
      setLoading(false);
    }
  }, [hasMore, loading, page]);

  // 设置Intersection Observer
  useEffect(() => {
    if (!loadMoreRef.current || !hasMore || loading) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreNotices();
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
  }, [hasMore, loading, loadMoreNotices]);

  // 初始加载状态
  if (initialLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700 animate-pulse">
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-3 w-3/4"></div>
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
              </div>
            </div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-3 w-full"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="space-y-4">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <svg className="w-12 h-12 text-red-500 dark:text-red-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-2">加载公告失败</h3>
          <p className="text-red-600 dark:text-red-400 mb-4">无法加载公告信息，请稍后重试</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            重新加载
          </button>
        </div>
      </div>
    );
  }

  // 无数据状态
  if (notices.length === 0) {
    return (
      <div className="space-y-4">
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
          <svg className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">暂无公告</h3>
          <p className="text-gray-600 dark:text-gray-400">当前没有可显示的公告信息</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notices.map((notice) => (
        <Link
          key={notice.id}
          to={notice.link}
          className="block group"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 border border-gray-200 dark:border-gray-700">
            {/* 标题和时效性 */}
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                {notice.title}
              </h3>
              {notice.expiresAt && (
                <span className={`text-xs px-2 py-1 rounded-full ${
                  isExpired(notice.expiresAt)
                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                }`}>
                  {isExpired(notice.expiresAt) ? '已过期' : '有效中'}
                </span>
              )}
            </div>

            {/* 作者信息 */}
            <div className="flex items-center space-x-3 mb-3">
              <UserAvatar 
                src={notice.author.avatar} 
                alt={notice.author.name}
                size="sm"
              />
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {notice.author.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  @{notice.author.id}
                </p>
              </div>
            </div>

            {/* 公告内容 */}
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
              {notice.content}
            </p>

            {/* 发布时间 */}
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>发布时间: {notice.createdAt}</span>
              {notice.expiresAt && (
                <span>有效期至: {notice.expiresAt}</span>
              )}
            </div>
          </div>
        </Link>
      ))}

      {/* 加载更多指示器 */}
      <div ref={loadMoreRef} className="text-center py-4">
        {loading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600 dark:text-gray-400">加载中...</span>
          </div>
        ) : hasMore ? (
          <button
            onClick={loadMoreNotices}
            className="text-primary-600 dark:text-primary-400 hover:underline text-sm"
          >
            点击加载更多公告
          </button>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            没有更多公告了
          </p>
        )}
      </div>

      {/* 查看全部按钮 */}
      <div className="text-center pt-2">
        <Link
          to="/notices"
          className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium"
        >
          查看全部公告
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default NoticeBoard;