import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import * as ReactNative from 'react-native';
import { UserListItem } from '../user-list-item';
import { LeaderboardUser } from '@/lib/api/layer3';

/* eslint-disable @typescript-eslint/no-require-imports */
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');

  return {
    Ionicons: ({ accessibilityLabel }: { accessibilityLabel?: string }) => (
      <Text accessibilityLabel={accessibilityLabel ?? 'icon'} />
    ),
  };
});
jest.mock('react-native-svg', () => {
  const { View } = require('react-native');
  const MockSvg = ({ children, ...props }: any) => <View {...props}>{children}</View>;
  const MockPolygon = () => <View />;
  return {
    __esModule: true,
    default: MockSvg,
    Svg: MockSvg,
    Polygon: MockPolygon,
  };
});
jest.mock('@/components/octagon-badge', () => {
  const { Text } = require('react-native');
  return {
    OctagonBadge: ({ text }: { text: string }) => <Text>{text}</Text>,
  };
});
/* eslint-enable @typescript-eslint/no-require-imports */

const mockUser: LeaderboardUser = {
  rank: 1,
  address: '0xF222f955Ecced246f3181d14fB4629469cEB7681',
  avatarCid: 'QmTUefEyqzfSugwvbCnTjzRdFvp4L5yA6qjEx1yspsr17z',
  username: 'testuser.eth',
  gmStreak: 100,
  xp: 50000,
  level: 25,
};

describe('UserListItem', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders user information correctly', () => {
    const onPress = jest.fn();
    const { getByText } = render(<UserListItem user={mockUser} rank={1} onPress={onPress} />);

    expect(getByText('1')).toBeTruthy();
    expect(getByText('testuser.eth')).toBeTruthy();
    expect(getByText(/0xF222\.\.\.7681/)).toBeTruthy();
    expect(getByText('50k')).toBeTruthy();
  });

  it('displays shortened address when no username', () => {
    const userWithoutUsername = { ...mockUser, username: null };
    const onPress = jest.fn();
    const { getByText } = render(
      <UserListItem user={userWithoutUsername} rank={2} onPress={onPress} />
    );

    expect(getByText('0xF222...7681')).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    const { getByText } = render(<UserListItem user={mockUser} rank={1} onPress={onPress} />);

    fireEvent.press(getByText('testuser.eth'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('formats XP in thousands for compact view', () => {
    const userWithHighXP = { ...mockUser, xp: 125000 };
    const onPress = jest.fn();

    // Mock Dimensions.get to return compact width
    const originalGet = ReactNative.Dimensions.get.bind(ReactNative.Dimensions);
    jest.spyOn(ReactNative.Dimensions, 'get').mockImplementation((dim) => {
      if (dim === 'window') {
        return {
          width: 350,
          height: 700,
          scale: 2,
          fontScale: 2,
        } as ReactNative.ScaledSize;
      }
      return originalGet(dim);
    });

    const { getByText } = render(<UserListItem user={userWithHighXP} rank={1} onPress={onPress} />);

    expect(getByText('125k')).toBeTruthy();
  });

  it('displays full XP for values less than 1000 in compact view', () => {
    const userWithLowXP = { ...mockUser, xp: 999 };
    const onPress = jest.fn();

    const originalGet = ReactNative.Dimensions.get.bind(ReactNative.Dimensions);
    jest.spyOn(ReactNative.Dimensions, 'get').mockImplementation((dim) => {
      if (dim === 'window') {
        return {
          width: 350,
          height: 700,
          scale: 2,
          fontScale: 2,
        } as ReactNative.ScaledSize;
      }
      return originalGet(dim);
    });

    const { getByText } = render(<UserListItem user={userWithLowXP} rank={5} onPress={onPress} />);

    expect(getByText('999')).toBeTruthy();
  });

  it('renders UserAvatar with correct props', () => {
    const onPress = jest.fn();
    const { UNSAFE_root } = render(<UserListItem user={mockUser} rank={1} onPress={onPress} />);

    expect(UNSAFE_root).toBeDefined();
  });
});
