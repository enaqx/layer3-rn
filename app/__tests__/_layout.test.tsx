import React from 'react';
import { render } from '@testing-library/react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import * as colorSchemeHook from '@/hooks/use-color-scheme';
import RootLayout from '../_layout';

jest.mock('@/providers/color-scheme-provider', () => ({
  ColorSchemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

/* eslint-disable @typescript-eslint/no-require-imports */
jest.mock('expo-router', () => {
  const React = require('react');
  const { Text } = require('react-native');
  const StackComponent = ({ children }: { children: React.ReactNode }) => <>{children}</>;
  StackComponent.displayName = 'MockStack';
  const StackScreen = ({ name }: { name: string }) => <Text accessibilityRole="text">{name}</Text>;
  StackScreen.displayName = 'MockStackScreen';
  StackComponent.Screen = StackScreen;
  return {
    Stack: StackComponent,
  };
});
/* eslint-enable @typescript-eslint/no-require-imports */

describe('RootLayout', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('uses the default theme when color scheme is light', () => {
    jest.spyOn(colorSchemeHook, 'useColorScheme').mockReturnValue('light');

    const { getByText, UNSAFE_getByType } = render(<RootLayout />);

    expect(getByText('index')).toBeTruthy();
    expect(getByText('user/[address]')).toBeTruthy();

    const statusBar = UNSAFE_getByType(StatusBar);
    expect(statusBar.props.style).toBe('dark');

    const themeProvider = UNSAFE_getByType(ThemeProvider);
    expect(themeProvider.props.value).toBe(DefaultTheme);
  });

  it('uses the dark theme when color scheme is dark', () => {
    jest.spyOn(colorSchemeHook, 'useColorScheme').mockReturnValue('dark');

    const { UNSAFE_getByType } = render(<RootLayout />);

    const statusBar = UNSAFE_getByType(StatusBar);
    expect(statusBar.props.style).toBe('light');

    const themeProvider = UNSAFE_getByType(ThemeProvider);
    expect(themeProvider.props.value).toBe(DarkTheme);
  });
});
