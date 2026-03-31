import React from 'react';
import { COMMUNITY_URL } from '../../config/urls';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 dark:bg-gray-900 text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="text-center">
          {/* 网站名称 */}
          <h2 className="text-2xl font-bold mb-4">CaptRAW Documents</h2>
          
          {/* 合作信息 */}
          <p className="text-gray-300 mb-4">
            Cooperated with CaptRAW Community
          </p>
          
          {/* 创建者信息 */}
          <p className="text-gray-400 mb-6">
            Created by @He0xD4C0@hub.captraw.com
          </p>
          
          {/* 社区链接 */}
          <div className="mb-6">
            <p className="text-gray-300 mb-2">Also See:</p>
            <a 
              href={COMMUNITY_URL} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              访问我们的Misskey社区
            </a>
          </div>
          
          {/* 版权信息 */}
          <div className="border-t border-gray-700 pt-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} CaptRAW Documents. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Built with React, TypeScript, and Tailwind CSS
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;