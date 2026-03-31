import React from 'react';
import { AssetKind } from '../../utils/assetUrl';
import AssetImage from './AssetImage';

interface UserAvatarProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  assetKind?: AssetKind;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ 
  src, 
  alt = '用户头像', 
  size = 'md',
  className = '',
  assetKind = 'user',
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10',
    lg: 'w-12 h-12 text-lg'
  };

  const fallbackInitials = alt.charAt(0).toUpperCase();

  return (
    <div className={`relative ${className}`}>
      {src ? (
        <AssetImage
          kind={assetKind}
          assetUuid={src}
          alt={alt}
          className={`${sizeClasses[size]} rounded-full object-cover border-2 border-gray-200 dark:border-gray-700`}
        />
      ) : (
        <div 
          className={`${sizeClasses[size]} rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center border-2 border-gray-200 dark:border-gray-700`}
        >
          <span className="text-primary-600 dark:text-primary-400 font-semibold">
            {fallbackInitials}
          </span>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;