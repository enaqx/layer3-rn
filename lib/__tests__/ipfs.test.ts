import { buildAvatarUrl } from '../ipfs';

describe('buildAvatarUrl', () => {
  const DEFAULT_GATEWAY = 'https://l3img-secondary.b-cdn.net/ipfs/';
  const DEFAULT_QUERY = 'width=208&optimizer=image';

  it('builds URL with CID', () => {
    const cid = 'QmTUefEyqzfSugwvbCnTjzRdFvp4L5yA6qjEx1yspsr17z';
    const url = buildAvatarUrl(cid);
    expect(url).toBe(`${DEFAULT_GATEWAY}${cid}?${DEFAULT_QUERY}`);
  });

  it('returns undefined for null CID', () => {
    expect(buildAvatarUrl(null)).toBeUndefined();
  });

  it('returns undefined for undefined CID', () => {
    expect(buildAvatarUrl(undefined)).toBeUndefined();
  });

  it('returns undefined for empty string CID', () => {
    expect(buildAvatarUrl('')).toBeUndefined();
  });

  it('strips ipfs:// prefix', () => {
    const cid = 'QmTUefEyqzfSugwvbCnTjzRdFvp4L5yA6qjEx1yspsr17z';
    const url = buildAvatarUrl(`ipfs://${cid}`);
    expect(url).toBe(`${DEFAULT_GATEWAY}${cid}?${DEFAULT_QUERY}`);
  });

  it('trims whitespace from CID', () => {
    const cid = 'QmTUefEyqzfSugwvbCnTjzRdFvp4L5yA6qjEx1yspsr17z';
    const url = buildAvatarUrl(`  ${cid}  `);
    expect(url).toBe(`${DEFAULT_GATEWAY}${cid}?${DEFAULT_QUERY}`);
  });

  it('uses custom gateway when provided', () => {
    const cid = 'QmTUefEyqzfSugwvbCnTjzRdFvp4L5yA6qjEx1yspsr17z';
    const customGateway = 'https://ipfs.io/ipfs/';
    const url = buildAvatarUrl(cid, customGateway);
    expect(url).toBe(`${customGateway}${cid}?${DEFAULT_QUERY}`);
  });

  it('returns undefined for whitespace-only CID', () => {
    expect(buildAvatarUrl('   ')).toBeUndefined();
  });

  it('handles ipfs:// prefix with whitespace', () => {
    const cid = 'QmTUefEyqzfSugwvbCnTjzRdFvp4L5yA6qjEx1yspsr17z';
    const url = buildAvatarUrl(`  ipfs://${cid}  `);
    expect(url).toBe(`${DEFAULT_GATEWAY}${cid}?${DEFAULT_QUERY}`);
  });

  it('supports overriding query parameters', () => {
    const cid = 'QmTUefEyqzfSugwvbCnTjzRdFvp4L5yA6qjEx1yspsr17z';
    const customQuery = 'quality=80&width=512';
    const url = buildAvatarUrl(cid, DEFAULT_GATEWAY, customQuery);
    expect(url).toBe(`${DEFAULT_GATEWAY}${cid}?${customQuery}`);
  });

  it('appends additional params when base already includes query', () => {
    const cid = 'QmTUefEyqzfSugwvbCnTjzRdFvp4L5yA6qjEx1yspsr17z';
    const gatewayWithParams = 'https://example.com/ipfs/?token=123';
    const url = buildAvatarUrl(cid, gatewayWithParams, 'width=200');
    expect(url).toBe(`${gatewayWithParams}${cid}&width=200`);
  });
});
