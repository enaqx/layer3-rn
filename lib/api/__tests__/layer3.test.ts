import { Platform } from 'react-native';

import { fetchLeaderboardUsers, LeaderboardResponse } from '../layer3';

const originalPlatform = Platform.OS;
const originalLayer3Env = process.env.EXPO_PUBLIC_LAYER3_API_URL;

function setPlatform(os: typeof Platform.OS) {
  Object.defineProperty(Platform, 'OS', {
    configurable: true,
    value: os,
  });
}

global.fetch = jest.fn();

describe('fetchLeaderboardUsers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setPlatform('ios');
    if (originalLayer3Env === undefined) {
      delete process.env.EXPO_PUBLIC_LAYER3_API_URL;
    } else {
      process.env.EXPO_PUBLIC_LAYER3_API_URL = originalLayer3Env;
    }
  });

  afterAll(() => {
    setPlatform(originalPlatform);
    if (originalLayer3Env === undefined) {
      delete process.env.EXPO_PUBLIC_LAYER3_API_URL;
    } else {
      process.env.EXPO_PUBLIC_LAYER3_API_URL = originalLayer3Env;
    }
  });

  it('fetches and transforms leaderboard data successfully', async () => {
    const mockResponse: LeaderboardResponse = {
      users: [
        {
          rank: 1,
          address: '0xF222f955Ecced246f3181d14fB4629469cEB7681',
          avatarCid: 'QmTUefEyqzfSugwvbCnTjzRdFvp4L5yA6qjEx1yspsr17z',
          username: 'testuser.eth',
          gmStreak: 100,
          xp: 50000,
          level: 25,
        },
        {
          rank: 2,
          address: '0xABC123',
          avatarCid: null,
          username: null,
          gmStreak: 50,
          xp: 25000,
          level: 15,
        },
      ],
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const users = await fetchLeaderboardUsers();

    expect(users).toHaveLength(2);
    expect(users[0]).toEqual({
      rank: 1,
      address: '0xF222f955Ecced246f3181d14fB4629469cEB7681',
      avatarCid: 'QmTUefEyqzfSugwvbCnTjzRdFvp4L5yA6qjEx1yspsr17z',
      username: 'testuser.eth',
      gmStreak: 100,
      xp: 50000,
      level: 25,
    });
    expect(users[1].avatarCid).toBeNull();
    expect(users[1].username).toBeNull();
  });

  it('throws error when response is not ok', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    await expect(fetchLeaderboardUsers()).rejects.toThrow(
      'Layer3 API request failed with status 404'
    );
  });

  it('throws error when response has unexpected shape', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ invalid: 'data' }),
    });

    await expect(fetchLeaderboardUsers()).rejects.toThrow('Unexpected Layer3 response shape');
  });

  it('throws error when users is not an array', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ users: 'not-an-array' }),
    });

    await expect(fetchLeaderboardUsers()).rejects.toThrow('Unexpected Layer3 response shape');
  });

  it('handles abort signal', async () => {
    const controller = new AbortController();
    const mockResponse: LeaderboardResponse = {
      users: [],
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    await fetchLeaderboardUsers(controller.signal);

    expect(global.fetch).toHaveBeenCalledWith(
      'https://layer3.xyz/api/assignment/users',
      expect.objectContaining({
        signal: controller.signal,
      })
    );
  });

  it('includes correct headers', async () => {
    const mockResponse: LeaderboardResponse = {
      users: [],
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    await fetchLeaderboardUsers();

    expect(global.fetch).toHaveBeenCalledWith(
      'https://layer3.xyz/api/assignment/users',
      expect.objectContaining({
        headers: expect.objectContaining({
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }),
      })
    );
  });

  it('routes through proxy on web', async () => {
    setPlatform('web');

    const mockResponse: LeaderboardResponse = {
      users: [],
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    await fetchLeaderboardUsers();

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/leaderboard',
      expect.objectContaining({
        headers: expect.objectContaining({
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        }),
      })
    );
  });
});
