import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../ui/ThemeToggle';
import UserAvatar from '../ui/UserAvatar';

const Header: React.FC = () => {
  const [isDirectoryOpen, setIsDirectoryOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-md">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* 左侧：Logo和主题切换 */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              CaptRAW Documents
            </Link>
            <ThemeToggle />
          </div>

          {/* 中间：导航菜单 */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              主页
            </Link>
            
            {/* 目录下拉菜单 */}
            <div 
              className="relative"
              onMouseEnter={() => setIsDirectoryOpen(true)}
              onMouseLeave={() => setIsDirectoryOpen(false)}
            >
              <button className="flex items-center text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                目录
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isDirectoryOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-2 z-10">
                  <Link 
                    to="/catalog" 
                    className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    目录总览
                  </Link>
                  <Link 
                    to="/catalog/search" 
                    className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    目录搜索
                  </Link>
                </div>
              )}
            </div>

            <Link 
              to="/submit" 
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              投稿
            </Link>
          </div>

          {/* 右侧：用户菜单 */}
          <div 
            className="relative"
            onMouseEnter={() => setIsUserMenuOpen(true)}
            onMouseLeave={() => setIsUserMenuOpen(false)}
          >
            <button className="flex items-center space-x-2">
              <UserAvatar 
                src="user_menu_avatar" 
                alt="用户头像" 
                size="md"
              />
              <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isUserMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-2 z-10">
                <Link 
                  to="/profile" 
                  className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  个人主页
                </Link>
                <Link 
                  to="/settings/security" 
                  className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  账号安全设置
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* 移动端菜单 */}
        <div className="md:hidden mt-4">
          <div className="flex flex-col space-y-2">
            <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
              主页
            </Link>
            <Link to="/catalog" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
              目录总览
            </Link>
            <Link to="/catalog/search" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
              目录搜索
            </Link>
            <Link to="/submit" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
              投稿
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;