import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { LeaderboardScreen } from '../leaderboard-screen';
import {
  ColorSchemeContext,
  type ColorSchemeContextValue,
} from '@/providers/color-scheme-provider';
import type { LeaderboardState } from '@/hooks/use-leaderboard';
import { useLeaderboard } from '@/hooks/use-leaderboard';

jest.mock('@/hooks/use-leaderboard');
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));
/* eslint-disable @typescript-eslint/no-require-imports */
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');

  return {
    Feather: ({ accessibilityLabel }: { accessibilityLabel?: string }) => (
      <Text accessibilityLabel={accessibilityLabel} />
    ),
  };
});
/* eslint-enable @typescript-eslint/no-require-imports */

const mockUseLeaderboard = useLeaderboard as jest.MockedFunction<typeof useLeaderboard>;

const baseLeaderboardState: LeaderboardState = {
  users: [],
  isLoading: false,
  isRefreshing: false,
  error: undefined,
  refresh: jest.fn(),
};

const createProviderValue = (
  overrides: Partial<ColorSchemeContextValue> = {}
): ColorSchemeContextValue => {
  return {
    colorScheme: 'light',
    setColorScheme: jest.fn(),
    toggleColorScheme: jest.fn(),
    resetToSystem: jest.fn(),
    isUserPreference: false,
    ...overrides,
  };
};

describe('LeaderboardScreen theme toggle', () => {
  beforeEach(() => {
    mockUseLeaderboard.mockReturnValue({
      ...baseLeaderboardState,
      refresh: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('shows sun icon when light mode is active', () => {
    const providerValue = createProviderValue({ colorScheme: 'light' });

    const { getByLabelText, getByRole } = render(
      <ColorSchemeContext.Provider value={providerValue}>
        <LeaderboardScreen />
      </ColorSchemeContext.Provider>
    );

    expect(getByLabelText('Light mode enabled')).toBeTruthy();
    expect(getByRole('switch').props.value).toBe(false);
  });

  it('shows moon icon when dark mode is active', () => {
    const providerValue = createProviderValue({ colorScheme: 'dark' });

    const { getByLabelText, getByRole } = render(
      <ColorSchemeContext.Provider value={providerValue}>
        <LeaderboardScreen />
      </ColorSchemeContext.Provider>
    );

    expect(getByLabelText('Dark mode enabled')).toBeTruthy();
    expect(getByRole('switch').props.value).toBe(true);
  });

  it('calls toggleColorScheme when the switch is toggled', () => {
    const toggleColorScheme = jest.fn();
    const providerValue = createProviderValue({
      colorScheme: 'light',
      toggleColorScheme,
    });

    const { getByRole } = render(
      <ColorSchemeContext.Provider value={providerValue}>
        <LeaderboardScreen />
      </ColorSchemeContext.Provider>
    );

    const switchControl = getByRole('switch');
    fireEvent(switchControl, 'valueChange', true);

    expect(toggleColorScheme).toHaveBeenCalledTimes(1);
  });
});
