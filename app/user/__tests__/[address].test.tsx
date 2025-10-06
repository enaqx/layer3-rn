import React from 'react';
import { Platform, Text } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';

import UserDetailPage from '../[address]';

type RouterMock = {
  back: jest.Mock;
  replace: jest.Mock;
  canGoBack: jest.Mock;
};

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

/* eslint-disable @typescript-eslint/no-require-imports */
type StackRecord = { options?: Record<string, unknown> };

jest.mock('expo-router', () => {
  const React = require('react');
  const stackRecords: StackRecord[] = [];
  const mockRouter: RouterMock = {
    back: jest.fn(),
    replace: jest.fn(),
    canGoBack: jest.fn(),
  };
  const mockUseRouter = jest.fn(() => mockRouter);
  const mockUseLocalSearchParams = jest.fn(() => ({}));

  const StackComponent = ({ children }: { children: React.ReactNode }) => <>{children}</>;
  StackComponent.displayName = 'MockStack';
  const StackScreen = (props: StackRecord) => {
    stackRecords.push(props);
    return null;
  };
  StackScreen.displayName = 'MockStackScreen';
  StackComponent.Screen = StackScreen;

  return {
    __esModule: true,
    useRouter: mockUseRouter,
    useLocalSearchParams: mockUseLocalSearchParams,
    Stack: StackComponent,
    __stackRecords: stackRecords,
    __mockRouter: mockRouter,
  };
});

const expoRouterMock = jest.requireMock('expo-router') as {
  useRouter: jest.Mock;
  useLocalSearchParams: jest.Mock;
  __stackRecords: StackRecord[];
  __mockRouter: RouterMock;
};

const mockRecordedScreens = expoRouterMock.__stackRecords;
const mockRouter = expoRouterMock.__mockRouter;
const mockUseRouter = expoRouterMock.useRouter;
const mockUseLocalSearchParams = expoRouterMock.useLocalSearchParams;

const mockUseThemeColor = jest.fn(
  (props?: Record<string, string>, colorName?: string) => '#222222'
);
jest.mock('@/hooks/use-theme-color', () => ({
  useThemeColor: (props?: Record<string, string>, colorName?: string) =>
    mockUseThemeColor(props, colorName),
}));

jest.mock('@/components/themed-text', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    ThemedText: ({ children, ...props }: { children: React.ReactNode }) => (
      <Text accessibilityRole="text" {...props}>
        {children}
      </Text>
    ),
  };
});
/* eslint-enable @typescript-eslint/no-require-imports */

const mockUserDetailScreen = jest.fn(
  ({ user }: { user: { address: string; username?: string } }) => (
    <Text testID="user-detail">{user.username ?? user.address}</Text>
  )
);

jest.mock('@/components/user-detail/user-detail-screen', () => ({
  UserDetailScreen: (props: { user: { address: string; username?: string } }) =>
    mockUserDetailScreen(props),
}));

const mockFindUserByAddress = jest.fn();
jest.mock('@/lib/leaderboard-store', () => ({
  findUserByAddress: (...args: unknown[]) => mockFindUserByAddress(...args),
}));

const setPlatformOS = (os: typeof Platform.OS) => {
  Object.defineProperty(Platform, 'OS', {
    configurable: true,
    get: () => os,
  });
};

const originalPlatformDescriptor = Object.getOwnPropertyDescriptor(Platform, 'OS');

describe('UserDetailPage', () => {
  beforeEach(() => {
    mockRecordedScreens.length = 0;
    mockRouter.back.mockReset();
    mockRouter.replace.mockReset();
    mockRouter.canGoBack.mockReset();
    mockUseRouter.mockReturnValue(mockRouter);
    mockUseLocalSearchParams.mockReset();
    mockFindUserByAddress.mockReset();
    mockUseThemeColor.mockClear();
    setPlatformOS('ios');
  });

  afterAll(() => {
    if (originalPlatformDescriptor) {
      Object.defineProperty(Platform, 'OS', originalPlatformDescriptor);
    }
  });

  it('renders an error when the user cannot be found', () => {
    mockUseLocalSearchParams.mockReturnValue({ address: '0xdeadbeef' });
    mockFindUserByAddress.mockReturnValue(null);

    const { getByText } = render(<UserDetailPage />);

    expect(getByText('User not found')).toBeTruthy();
    expect(mockRecordedScreens).toHaveLength(0);
  });

  it('renders the user detail screen with the username on native platforms', () => {
    mockUseLocalSearchParams.mockReturnValue({ address: '0x1234567890abcdef' });
    mockFindUserByAddress.mockReturnValue({ address: '0x1234567890abcdef', username: 'Alice' });
    mockRouter.canGoBack.mockReturnValue(true);

    const { getByTestId } = render(<UserDetailPage />);

    expect(mockUserDetailScreen).toHaveBeenCalledWith(
      expect.objectContaining({ user: expect.objectContaining({ username: 'Alice' }) })
    );
    expect(getByTestId('user-detail').props.children).toBe('Alice');

    expect(mockRecordedScreens).toHaveLength(1);
    const screenOptions = mockRecordedScreens[0].options as Record<string, unknown>;
    expect(screenOptions?.title).toBe('Alice');
    expect(screenOptions?.headerLeft).toBeUndefined();
    expect(screenOptions?.headerTitleAlign).toBeUndefined();
  });

  it('shows a custom back button on web and navigates back when possible', () => {
    setPlatformOS('web');
    mockUseLocalSearchParams.mockReturnValue({ address: '0x1234567890abcdef' });
    mockFindUserByAddress.mockReturnValue({ address: '0x1234567890abcdef' });
    mockRouter.canGoBack.mockReturnValue(true);

    render(<UserDetailPage />);

    expect(mockRecordedScreens).toHaveLength(1);
    const screenOptions = mockRecordedScreens[0].options as {
      title: string;
      headerLeft?: () => React.ReactNode;
      headerTitleAlign?: string;
    };

    expect(screenOptions.title).toBe('0x1234...cdef');
    expect(screenOptions.headerTitleAlign).toBe('center');
    const headerLeft = screenOptions.headerLeft?.();
    const { getByText } = render(<>{headerLeft}</>);

    fireEvent.press(getByText('Back'));

    expect(mockRouter.canGoBack).toHaveBeenCalled();
    expect(mockRouter.back).toHaveBeenCalled();
    expect(mockRouter.replace).not.toHaveBeenCalled();
  });

  it('replaces the route when the router cannot go back on web', () => {
    setPlatformOS('web');
    mockUseLocalSearchParams.mockReturnValue({ address: '0xabcdefabcdefabcd' });
    mockFindUserByAddress.mockReturnValue({ address: '0xabcdefabcdefabcd' });
    mockRouter.canGoBack.mockReturnValue(false);

    render(<UserDetailPage />);

    const screenOptions = mockRecordedScreens[0].options as {
      headerLeft?: () => React.ReactNode;
    };

    const { getByText } = render(<>{screenOptions.headerLeft?.()}</>);
    fireEvent.press(getByText('Back'));

    expect(mockRouter.canGoBack).toHaveBeenCalled();
    expect(mockRouter.back).not.toHaveBeenCalled();
    expect(mockRouter.replace).toHaveBeenCalledWith('/');
  });
});
