import React, { useEffect } from 'react';
import { act, render, waitFor } from '@testing-library/react-native';

import { useOnchainProfile } from '../use-onchain-profile';
import { fetchOnchainProfile, type OnchainProfile } from '@/lib/api/onchain';

jest.mock('@/lib/api/onchain', () => ({
  fetchOnchainProfile: jest.fn(),
}));

type HookState = ReturnType<typeof useOnchainProfile>;

const mockFetchOnchainProfile = fetchOnchainProfile as jest.MockedFunction<
  typeof fetchOnchainProfile
>;

function HookProbe({
  address,
  onRender,
}: {
  address: string;
  onRender: (state: HookState) => void;
}) {
  const state = useOnchainProfile(address);
  useEffect(() => {
    onRender(state);
  }, [state, onRender]);

  return null;
}

afterEach(() => {
  jest.clearAllMocks();
});

describe('useOnchainProfile', () => {
  const baseProfile: OnchainProfile = {
    ethBalance: 1,
    totalValueUsd: 2000,
    tokenHoldings: [],
    transactionCount: 0,
    recentTransactions: [],
  };

  it('loads profile on mount and exposes state', async () => {
    mockFetchOnchainProfile.mockResolvedValue(baseProfile);

    const onRender = jest.fn();
    render(<HookProbe address="0xabc" onRender={onRender} />);

    await waitFor(() => {
      expect(onRender).toHaveBeenCalled();
      const latest = onRender.mock.calls[onRender.mock.calls.length - 1][0] as HookState;
      expect(latest.profile).toEqual(baseProfile);
      expect(latest.isLoading).toBe(false);
      expect(latest.error).toBeUndefined();
    });

    expect(mockFetchOnchainProfile).toHaveBeenCalledWith('0xabc');
  });

  it('captures errors and allows refetch to recover', async () => {
    const error = new Error('boom');
    mockFetchOnchainProfile.mockRejectedValueOnce(error).mockResolvedValueOnce(baseProfile);

    const onRender = jest.fn();
    render(<HookProbe address="0xdef" onRender={onRender} />);

    await waitFor(() => {
      const latest = onRender.mock.calls[onRender.mock.calls.length - 1][0] as HookState;
      expect(latest.error).toBe(error);
      expect(latest.isLoading).toBe(false);
    });

    const latestState = onRender.mock.calls[onRender.mock.calls.length - 1][0] as HookState;

    await act(async () => {
      await latestState.refetch();
    });

    await waitFor(() => {
      const refreshed = onRender.mock.calls[onRender.mock.calls.length - 1][0] as HookState;
      expect(refreshed.profile).toEqual(baseProfile);
      expect(refreshed.error).toBeUndefined();
      expect(refreshed.isLoading).toBe(false);
    });

    expect(mockFetchOnchainProfile).toHaveBeenCalledTimes(2);
  });
});
