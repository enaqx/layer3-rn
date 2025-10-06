import React from 'react';
import { render } from '@testing-library/react-native';

import { BalanceSection } from '../balance-section';
import { useThemeColor } from '@/hooks/use-theme-color';

jest.mock('@/hooks/use-theme-color', () => ({
  useThemeColor: jest.fn(),
}));

type MockProfile = Parameters<typeof BalanceSection>[0]['profile'];

const mockedUseThemeColor = useThemeColor as jest.MockedFunction<typeof useThemeColor>;

beforeEach(() => {
  mockedUseThemeColor.mockImplementation(
    (props, colorName) => props.light ?? props.dark ?? `mock-${colorName}`
  );
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('BalanceSection', () => {
  const baseProfile: MockProfile = {
    ethBalance: 1.2345,
    totalValueUsd: 1234.567,
    tokenHoldings: [],
    recentTransactions: [],
    transactionCount: 0,
  };

  it('renders portfolio balance and token holdings when provided', () => {
    const profile: MockProfile = {
      ...baseProfile,
      tokenHoldings: [
        {
          address: '0x1',
          symbol: 'L3',
          name: 'Layer3 Token',
          amount: 12.3456,
          decimals: 18,
          priceUsd: 1.23,
          valueUsd: 15.18,
        },
        {
          address: '0x2',
          symbol: 'GM',
          name: 'GM Token',
          amount: 0.9876,
          decimals: 18,
          priceUsd: 2.5,
          valueUsd: 2.47,
        },
      ],
    };

    const { getByText } = render(<BalanceSection profile={profile} />);

    expect(getByText('Portfolio Balance')).toBeTruthy();
    expect(getByText('$1,234.57')).toBeTruthy();
    expect(getByText('ETH')).toBeTruthy();
    expect(getByText('1.2345 ETH')).toBeTruthy();

    expect(getByText('Tokens (2)')).toBeTruthy();
    expect(getByText('Layer3 Token')).toBeTruthy();
    expect(getByText('12.3456')).toBeTruthy();
    expect(getByText('$15.18')).toBeTruthy();
  });

  it('hides token section when no holdings exist', () => {
    const { queryByText } = render(<BalanceSection profile={baseProfile} />);

    expect(queryByText(/Tokens \(/)).toBeNull();
  });
});
