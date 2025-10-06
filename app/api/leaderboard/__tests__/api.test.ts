import { GET } from '../+api';

const DEFAULT_ENDPOINT = 'https://layer3.xyz/api/assignment/users';

describe('GET /api/leaderboard', () => {
  const originalEnv = process.env.EXPO_PUBLIC_LAYER3_API_URL;
  const originalFetch = global.fetch;
  const fetchMock = jest.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    (global as unknown as { fetch: typeof fetch }).fetch = fetchMock as unknown as typeof fetch;
  });

  afterEach(() => {
    process.env.EXPO_PUBLIC_LAYER3_API_URL = originalEnv;
    (global as unknown as { fetch: typeof fetch }).fetch = originalFetch as typeof fetch;
  });

  it('proxies the upstream response using the configured endpoint', async () => {
    process.env.EXPO_PUBLIC_LAYER3_API_URL = ' https://example.com/api ';
    const responseBody = JSON.stringify({ hello: 'world' });
    fetchMock.mockResolvedValue(
      new Response(responseBody, {
        status: 202,
        headers: {
          'content-type': 'application/json',
        },
      })
    );

    const controller = new AbortController();
    const request = new Request('http://localhost', { signal: controller.signal });

    const response = await GET(request);

    expect(fetchMock).toHaveBeenCalledWith(
      'https://example.com/api',
      expect.objectContaining({
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        signal: request.signal,
      })
    );

    expect(response.status).toBe(202);
    expect(await response.text()).toBe(responseBody);
    expect(response.headers.get('Content-Type')).toBe('application/json');
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
  });

  it('falls back to the default endpoint when the environment variable is absent', async () => {
    delete process.env.EXPO_PUBLIC_LAYER3_API_URL;
    fetchMock.mockResolvedValue(
      new Response('[]', {
        status: 200,
        headers: {
          'content-type': 'application/json',
        },
      })
    );

    const request = new Request('http://localhost');
    await GET(request);

    expect(fetchMock).toHaveBeenCalledWith(DEFAULT_ENDPOINT, expect.any(Object));
  });

  it('returns an error response when the upstream request fails', async () => {
    const error = new Error('boom');
    fetchMock.mockRejectedValue(error);
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const request = new Request('http://localhost');
    const response = await GET(request);

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({ error: 'Unable to fetch leaderboard data' });
    expect(consoleSpy).toHaveBeenCalledWith('Failed to proxy leaderboard request', error);

    consoleSpy.mockRestore();
  });
});
