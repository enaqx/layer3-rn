import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { fetchLeaderboardUsers, type LeaderboardUser } from '@/lib/api/layer3';
import { cacheLeaderboardUsers, getCachedLeaderboard } from '@/lib/leaderboard-store';

export type LeaderboardState = {
  users: LeaderboardUser[];
  isLoading: boolean;
  isRefreshing: boolean;
  error?: Error;
  refresh: () => Promise<void>;
};

export function useLeaderboard(): LeaderboardState {
  const [users, setUsers] = useState<LeaderboardUser[]>(() => getCachedLeaderboard());
  const [error, setError] = useState<Error | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(users.length === 0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const abortController = useRef<AbortController | null>(null);

  const loadUsers = useCallback(async (isRefresh: boolean) => {
    abortController.current?.abort();
    const controller = new AbortController();
    abortController.current = controller;

    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const fetchedUsers = await fetchLeaderboardUsers(controller.signal);
      cacheLeaderboardUsers(fetchedUsers);
      setUsers(fetchedUsers);
      setError(undefined);
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        return;
      }
      setError(err as Error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (users.length === 0) {
      loadUsers(false);
    }

    return () => {
      abortController.current?.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refresh = useCallback(async () => {
    await loadUsers(true);
  }, [loadUsers]);

  return useMemo(
    () => ({
      users,
      isLoading,
      isRefreshing,
      error,
      refresh,
    }),
    [users, isLoading, isRefreshing, error, refresh]
  );
}
