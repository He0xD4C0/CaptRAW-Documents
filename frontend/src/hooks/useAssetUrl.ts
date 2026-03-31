import { useQuery } from '@tanstack/react-query';
import { AssetKind, resolveAssetUrl } from '../utils/assetUrl';

export const useAssetUrl = (kind: AssetKind, assetUuid?: string) => {
  return useQuery({
    queryKey: ['asset-url', kind, assetUuid],
    queryFn: () => resolveAssetUrl(kind, assetUuid),
    enabled: Boolean(assetUuid),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

