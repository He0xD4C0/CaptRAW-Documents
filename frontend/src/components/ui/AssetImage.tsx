import React from 'react';
import { useAssetUrl } from '../../hooks/useAssetUrl';
import { AssetKind } from '../../utils/assetUrl';

interface AssetImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  kind: AssetKind;
  assetUuid?: string;
}

const AssetImage: React.FC<AssetImageProps> = ({ kind, assetUuid, alt = '', ...imgProps }) => {
  const { data: src } = useAssetUrl(kind, assetUuid);

  if (!src) {
    return <div className={imgProps.className} aria-hidden="true" />;
  }

  return <img {...imgProps} src={src} alt={alt} />;
};

export default AssetImage;

