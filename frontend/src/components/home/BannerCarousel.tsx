import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useBanners } from '../../hooks/useBanners';
import { Banner } from '../../types';
import AssetImage from '../ui/AssetImage';

const BannerCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  // 使用React Query获取横幅数据
  const { data: bannersResponse, isLoading, error } = useBanners();
  
  const banners = bannersResponse?.data || [];
  const bannersLength = banners.length;

  const nextSlide = useCallback(() => {
    if (bannersLength === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % bannersLength);
  }, [bannersLength]);

  const prevSlide = () => {
    if (bannersLength === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex - 1 + bannersLength) % bannersLength);
  };

  // 自动轮播
  useEffect(() => {
    if (isPaused || bannersLength === 0) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 3000); // 3秒轮换

    return () => clearInterval(interval);
  }, [currentIndex, isPaused, nextSlide, bannersLength]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  const getTypeBadge = (type: Banner['type']) => {
    const badges = {
      article: { label: '文章', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
      notice: { label: '公告', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
      user: { label: '用户', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' }
    };
    return badges[type];
  };

  // 加载状态
  if (isLoading) {
    return (
      <div className="relative overflow-hidden rounded-xl shadow-lg h-64 md:h-80 bg-gray-200 dark:bg-gray-800 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-500 dark:text-gray-400">加载横幅中...</div>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="relative overflow-hidden rounded-xl shadow-lg h-64 md:h-80 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-red-600 dark:text-red-400 text-center p-4">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>加载横幅失败</p>
            <p className="text-sm mt-1">请稍后重试</p>
          </div>
        </div>
      </div>
    );
  }

  // 无数据状态
  if (bannersLength === 0) {
    return (
      <div className="relative overflow-hidden rounded-xl shadow-lg h-64 md:h-80 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-500 dark:text-gray-400 text-center">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p>暂无横幅内容</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative overflow-hidden rounded-xl shadow-lg"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 横幅容器 */}
      <div className="relative h-64 md:h-80">
        {banners.map((banner, index) => (
          <Link
            key={banner.id}
            to={banner.link}
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="relative h-full">
              {/* 背景图片 */}
              <AssetImage
                kind="banner"
                assetUuid={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              
              {/* 渐变遮罩 */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
              
              {/* 内容 */}
              <div className="absolute inset-0 flex items-center p-8">
                <div className="max-w-2xl">
                  {/* 类型标签 */}
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${getTypeBadge(banner.type).color}`}>
                    {getTypeBadge(banner.type).label}
                  </span>
                  
                  {/* 标题 */}
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {banner.title}
                  </h3>
                  
                  {/* 副标题 */}
                  <p className="text-lg text-gray-200">
                    {banner.subtitle}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 导航按钮 */}
      {bannersLength > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-colors"
            aria-label="上一个横幅"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-colors"
            aria-label="下一个横幅"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* 指示器 */}
      {bannersLength > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-white w-4' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`跳转到横幅 ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* 暂停指示器 */}
      {isPaused && bannersLength > 1 && (
        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          已暂停
        </div>
      )}
    </div>
  );
};

export default BannerCarousel;