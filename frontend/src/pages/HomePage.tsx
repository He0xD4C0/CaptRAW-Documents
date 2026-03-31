import React from 'react';
import BannerCarousel from '../components/home/BannerCarousel';
import NoticeBoard from '../components/home/NoticeBoard';
import ArticleTimeline from '../components/home/ArticleTimeline';

const HomePage: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* 横幅轮播 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">精选内容</h2>
        <BannerCarousel />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左边栏：公告 */}
        <section className="lg:col-span-1">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">公告</h2>
          <NoticeBoard />
        </section>

        {/* 正文：文章时间线 */}
        <section className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">最新文章</h2>
          <ArticleTimeline />
        </section>
      </div>
    </div>
  );
};

export default HomePage;