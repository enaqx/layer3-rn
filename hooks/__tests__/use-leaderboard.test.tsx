import React, { useEffect } from 'react';
import { act, render, waitFor } from '@testing-library/react-native';

import { useLeaderboard } from '../use-leaderboard';
import { fetchLeaderboardUsers, type LeaderboardUser } from '@/lib/api/layer3';
import { cacheLeaderboardUsers, getCachedLeaderboard } from '@/lib/leaderboard-store';

jest.mock('@/lib/api/layer3', () => ({
  fetchLeaderboardUsers: jest.fn(),
}));

jest.mock('@/lib/leaderboard-store', () => ({
  cacheLeaderboardUsers: jest.fn(),
  getCachedLeaderboard: jest.fn(),
}));

type HookState = ReturnType<typeof useLeaderboard>;

const mockFetchLeaderboardUsers = fetchLeaderboardUsers as jest.MockedFunction<
  typeof fetchLeaderboardUsers
>;
const mockCacheLeaderboardUsers = cacheLeaderboardUsers as jest.MockedFunction<
  typeof cacheLeaderboardUsers
>;
const mockGetCachedLeaderboard = getCachedLeaderboard as jest.MockedFunction<
  typeof getCachedLeaderboard
>;

function HookProbe({ onRender }: { onRender: (state: HookState) => void }) {
  const state = useLeaderboard();
  useEffect(() => {
    onRender(state);
  }, [state, onRender]);

  return null;
}

afterEach(() => {
  jest.clearAllMocks();
});

describe('useLeaderboard', () => {
  const users: LeaderboardUser[] = [
    { rank: 1, address: '0x1', avatarCid: null, username: 'alpha', gmStreak: 3, xp: 100, level: 5 },
    { rank: 2, address: '0x2', avatarCid: null, username: 'beta', gmStreak: 2, xp: 90, level: 4 },
  ];

  it('loads users when cache empty and updates state', async () => {
    mockGetCachedLeaderboard.mockReturnValue([]);
    mockFetchLeaderboardUsers.mockResolvedValue(users);

    const onRender = jest.fn();
    render(<HookProbe onRender={onRender} />);

    await waitFor(() => {
      expect(onRender).toHaveBeenCalled();
      const latest = onRender.mock.calls[onRender.mock.calls.length - 1][0];
      expect(latest.isLoading).toBe(false);
      expect(latest.users).toEqual(users);
    });

    expect(mockFetchLeaderboardUsers).toHaveBeenCalledTimes(1);
    expect(mockCacheLeaderboardUsers).toHaveBeenCalledWith(users);
  });

  it('starts from cached users without triggering load', async () => {
    mockGetCachedLeaderboard.mockReturnValue(users);

    const onRender = jest.fn();
    render(<HookProbe onRender={onRender} />);

    const initialState = await waitFor(() => {
      expect(onRender).toHaveBeenCalled();
      return onRender.mock.calls[onRender.mock.calls.length - 1][0] as HookState;
    });
    expect(initialState.users).toEqual(users);
    expect(initialState.isLoading).toBe(false);
    expect(mockFetchLeaderboardUsers).not.toHaveBeenCalled();
  });

  it('exposes refresh that toggles isRefreshing and handles errors', async () => {
    mockGetCachedLeaderboard.mockReturnValue([]);
    const error = new Error('fail');
    mockFetchLeaderboardUsers.mockRejectedValueOnce(error).mockResolvedValueOnce(users);

    const onRender = jest.fn();
    render(<HookProbe onRender={onRender} />);

    await waitFor(() => {
      const latest = onRender.mock.calls[onRender.mock.calls.length - 1][0] as HookState;
      expect(latest.error).toBe(error);
      expect(latest.isLoading).toBe(false);
    });

    const latestState = onRender.mock.calls[onRender.mock.calls.length - 1][0] as HookState;

    await act(async () => {
      await latestState.refresh();
    });

    await waitFor(() => {
      const refreshed = onRender.mock.calls[onRender.mock.calls.length - 1][0] as HookState;
      expect(refreshed.users).toEqual(users);
      expect(refreshed.isRefreshing).toBe(false);
      expect(refreshed.error).toBeUndefined();
    });

    expect(mockFetchLeaderboardUsers).toHaveBeenCalledTimes(2);
  });
});
