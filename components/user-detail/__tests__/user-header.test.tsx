import React from 'react';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import * as Clipboard from 'expo-clipboard';
import * as ReactNative from 'react-native';
import { StyleSheet } from 'react-native';

import { UserHeader } from '../user-header';
import { useThemeColor } from '@/hooks/use-theme-color';
import { UserAvatar } from '@/components/user-avatar';
import type { LeaderboardUser } from '@/lib/api/layer3';

const clipboardMock = Clipboard as jest.Mocked<typeof Clipboard>;

jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    width: 400,
    height: 800,
    scale: 2,
    fontScale: 1,
  })),
}));

jest.mock('@/hooks/use-theme-color', () => ({
  useThemeColor: jest.fn(),
}));

jest.mock('@/components/user-avatar', () => ({
  UserAvatar: jest.fn(() => null),
}));

const mockedUseWindowDimensions = jest.requireMock(
  'react-native/Libraries/Utilities/useWindowDimensions'
).default as jest.MockedFunction<typeof ReactNative.useWindowDimensions>;
const mockedUseThemeColor = useThemeColor as jest.MockedFunction<typeof useThemeColor>;
const mockedUserAvatar = UserAvatar as jest.MockedFunction<typeof UserAvatar>;

const baseUser: LeaderboardUser = {
  rank: 1,
  address: '0xuser',
  avatarCid: 'avatar',
  username: 'gm_user',
  gmStreak: 7,
  xp: 12345,
  level: 10,
};

beforeEach(() => {
  jest.useFakeTimers();
  mockedUseThemeColor.mockImplementation(
    (
      _overrides: Parameters<typeof useThemeColor>[0],
      colorName: Parameters<typeof useThemeColor>[1]
    ) => `color-${colorName}`
  );
  clipboardMock.setStringAsync.mockClear();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
  jest.clearAllMocks();
});

const setWindowWidth = (width: number) => {
  mockedUseWindowDimensions.mockReturnValue({
    width,
    height: 800,
    scale: 2,
    fontScale: 1,
  });
};

describe('UserHeader', () => {
  it('renders full layout with username and stats', () => {
    setWindowWidth(400);

    const { getByText } = render(<UserHeader user={baseUser} />);

    expect(getByText('gm_user')).toBeTruthy();
    expect(getByText('0xuser')).toBeTruthy();
    expect(getByText('#1')).toBeTruthy();
    expect(getByText('12,345')).toBeTruthy();
    expect(getByText('10')).toBeTruthy();
    expect(getByText('7')).toBeTruthy();

    const avatarProps = mockedUserAvatar.mock.calls.at(-1)?.[0];
    expect(avatarProps?.size).toBe(120);
    expect(avatarProps?.rank).toBe(baseUser.rank);
    expect(avatarProps?.username).toBe(baseUser.username);
    expect(avatarProps?.avatar).toBe('avatar');

    const usernameStyle = StyleSheet.flatten(getByText('gm_user').props.style);
    expect(usernameStyle?.fontSize).toBe(24);
    expect(usernameStyle?.color).toBe('color-text');

    const rankLabelStyle = StyleSheet.flatten(getByText('Rank').props.style);
    expect(rankLabelStyle?.color).toBe('color-icon');
    const xpLabelStyle = StyleSheet.flatten(getByText('XP').props.style);
    expect(xpLabelStyle?.color).toBe('color-icon');
  });

  it('switches to compact layout and formats fallback name for small screens', () => {
    setWindowWidth(320);
    const addressUser: LeaderboardUser = {
      ...baseUser,
      username: null,
      address: '0xabcdef1234567890',
      avatarCid: null,
    };

    const { getByText } = render(<UserHeader user={addressUser} />);

    const avatarProps = mockedUserAvatar.mock.calls.at(-1)?.[0];
    expect(avatarProps?.size).toBe(100);
    expect(avatarProps?.username).toBeUndefined();
    expect(avatarProps?.avatar).toBeUndefined();

    const displayName = '0xabcd...7890';
    const usernameNode = getByText(displayName);
    const usernameStyle = StyleSheet.flatten(usernameNode.props.style);
    expect(usernameStyle?.fontSize).toBe(20);
    expect(usernameStyle?.color).toBe('color-text');

    const addressNode = getByText(addressUser.address);
    const addressStyle = StyleSheet.flatten(addressNode.props.style);
    expect(addressStyle?.fontSize).toBe(12);
    expect(addressStyle?.color).toBe('color-icon');
    expect(addressNode.props.adjustsFontSizeToFit).toBe(true);
    expect(addressNode.props.ellipsizeMode).toBe('middle');
    expect(addressNode.props.numberOfLines).toBe(1);

    const streakLabelStyle = StyleSheet.flatten(getByText('Streak').props.style);
    expect(streakLabelStyle?.color).toBe('color-icon');
  });

  it('copies the address to the clipboard and toggles the hint message', async () => {
    setWindowWidth(360);

    const { getByTestId, getByText } = render(<UserHeader user={baseUser} />);

    fireEvent.press(getByTestId('user-address-pressable'));

    expect(clipboardMock.setStringAsync).toHaveBeenCalledWith(baseUser.address);

    await waitFor(() => {
      expect(getByText('Address copied!')).toBeTruthy();
    });

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(getByText('Tap address to copy')).toBeTruthy();
    });
  });
});
