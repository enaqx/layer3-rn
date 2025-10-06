const FALLBACK_IPFS_GATEWAY = 'https://l3img-secondary.b-cdn.net/ipfs/';
const FALLBACK_IMAGE_QUERY = 'width=208&optimizer=image';

function getDefaultIpfsGateway() {
  return process.env.EXPO_PUBLIC_IPFS_GATEWAY?.trim() || FALLBACK_IPFS_GATEWAY;
}

function getDefaultImageQuery() {
  const value = process.env.EXPO_PUBLIC_IPFS_IMAGE_QUERY;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed.length > 0) {
      return trimmed;
    }
  }
  return FALLBACK_IMAGE_QUERY;
}

export function buildAvatarUrl(
  cid?: string | null,
  gateway: string = getDefaultIpfsGateway(),
  imageQuery: string = getDefaultImageQuery()
) {
  if (!cid) {
    return undefined;
  }

  const trimmedCid = cid.trim();
  const normalizedCid = trimmedCid.replace(/^ipfs:\/\//, '').trim();

  if (!normalizedCid) {
    return undefined;
  }

  let url = `${gateway}${normalizedCid}`;

  if (imageQuery) {
    const separator = url.includes('?') ? '&' : '?';
    url = `${url}${separator}${imageQuery}`;
  }

  return url;
}
