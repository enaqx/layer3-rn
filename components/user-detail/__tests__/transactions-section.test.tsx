import React from 'react';
import { render } from '@testing-library/react-native';

import { TransactionsSection } from '../transactions-section';
import { useThemeColor } from '@/hooks/use-theme-color';

jest.mock('@/hooks/use-theme-color', () => ({
  useThemeColor: jest.fn(),
}));

const mockedUseThemeColor = useThemeColor as jest.MockedFunction<typeof useThemeColor>;

beforeEach(() => {
  mockedUseThemeColor.mockImplementation(
    (props, colorName) => props.light ?? props.dark ?? `mock-${colorName}`
  );
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('TransactionsSection', () => {
  const baseProfile = {
    ethBalance: 0,
    totalValueUsd: 0,
    tokenHoldings: [],
    recentTransactions: [] as {
      hash: string;
      timestamp: number;
      from: string;
      to: string;
      value: number;
      tokenSymbol?: string | null;
    }[],
    transactionCount: 0,
  };

  it('returns null when there are no transactions', () => {
    const { toJSON } = render(<TransactionsSection profile={baseProfile} />);
    expect(toJSON()).toBeNull();
  });

  it('renders transaction details when transactions exist', () => {
    const txTimestamp = 1_695_811_200; // June 10, 2023 UTC
    const profile = {
      ...baseProfile,
      recentTransactions: [
        {
          hash: '0xabc123def456',
          timestamp: txTimestamp,
          from: '0xfromaddress',
          to: '0xtoaddress',
          value: 0.123456,
          tokenSymbol: 'ETH',
        },
        {
          hash: '0x987654321',
          timestamp: txTimestamp + 86400,
          from: '0xfrom2',
          to: '0xto2',
          value: 2,
          tokenSymbol: 'L3',
        },
      ],
      transactionCount: 7,
    };

    const { getByText, getAllByText } = render(<TransactionsSection profile={profile} />);

    expect(getByText('Recent Transactions')).toBeTruthy();
    expect(getByText('Showing 2 of 7 transactions')).toBeTruthy();

    const firstDate = new Date(txTimestamp * 1000).toLocaleDateString();
    expect(getByText(firstDate)).toBeTruthy();

    expect(getAllByText('From')).toHaveLength(2);
    expect(getAllByText('To')).toHaveLength(2);
    expect(getByText(/0xabc123de/)).toBeTruthy();
    expect(getByText(/0x98765432/)).toBeTruthy();
    expect(getByText('0.123456 ETH')).toBeTruthy();
    expect(getByText('2.000000 L3')).toBeTruthy();
  });
});
