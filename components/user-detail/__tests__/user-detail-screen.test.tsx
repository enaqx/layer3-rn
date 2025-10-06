import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { UserDetailScreen } from '../user-detail-screen';
import { useOnchainProfile } from '@/hooks/use-onchain-profile';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { LeaderboardUser } from '@/lib/api/layer3';
import type { OnchainProfile } from '@/lib/api/onchain';

jest.mock('@/hooks/use-onchain-profile', () => ({
  useOnchainProfile: jest.fn(),
}));

jest.mock('@/hooks/use-theme-color', () => ({
  useThemeColor: jest.fn(),
}));

jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: jest.fn(),
}));

const mockedUseOnchainProfile = useOnchainProfile as jest.MockedFunction<typeof useOnchainProfile>;
const mockedUseThemeColor = useThemeColor as jest.MockedFunction<typeof useThemeColor>;
const mockedUseColorScheme = useColorScheme as jest.MockedFunction<typeof useColorScheme>;

const user: LeaderboardUser = {
  rank: 1,
  address: '0xuser',
  avatarCid: null,
  username: 'gm_user',
  gmStreak: 7,
  xp: 12345,
  level: 10,
};

const profile: OnchainProfile = {
  ethBalance: 2.5,
  totalValueUsd: 5000,
  tokenHoldings: [],
  transactionCount: 1,
  recentTransactions: [
    {
      hash: '0xabc',
      timestamp: 1,
      from: '0xfrom',
      to: '0xto',
      value: 1,
      tokenSymbol: 'ETH',
    },
  ],
};

beforeEach(() => {
  mockedUseThemeColor.mockImplementation(
    (props, colorName) => props.light ?? props.dark ?? `mock-${colorName}`
  );
  mockedUseColorScheme.mockReturnValue('light');
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('UserDetailScreen', () => {
  it('shows loading state while fetching', () => {
    mockedUseOnchainProfile.mockReturnValue({
      profile: undefined,
      isLoading: true,
      error: undefined,
      refetch: jest.fn(),
    });

    const { getByText } = render(<UserDetailScreen user={user} />);

    expect(getByText('Loading on-chain data...')).toBeTruthy();
  });

  it('renders error state when loading fails without cached profile', () => {
    const refetch = jest.fn();
    const error = new Error('Network down');
    mockedUseOnchainProfile.mockReturnValue({
      profile: undefined,
      isLoading: false,
      error,
      refetch,
    });

    const { getByText } = render(<UserDetailScreen user={user} />);

    expect(getByText('Something went wrong')).toBeTruthy();
    expect(getByText('Network down')).toBeTruthy();

    fireEvent.press(getByText('Try Again'));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it('renders profile sections when data available', () => {
    mockedUseOnchainProfile.mockReturnValue({
      profile,
      isLoading: false,
      error: undefined,
      refetch: jest.fn(),
    });

    const { getByText } = render(<UserDetailScreen user={user} />);

    expect(getByText('Portfolio Balance')).toBeTruthy();
    expect(getByText('Recent Transactions')).toBeTruthy();
  });

  it('shows cached warning when both profile and error present', () => {
    mockedUseOnchainProfile.mockReturnValue({
      profile,
      isLoading: false,
      error: new Error('Stale'),
      refetch: jest.fn(),
    });

    const { getByText } = render(<UserDetailScreen user={user} />);

    expect(getByText('⚠️ Using cached data')).toBeTruthy();
  });
});
