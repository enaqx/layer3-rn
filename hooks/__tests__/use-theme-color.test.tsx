import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';

import { useThemeColor } from '../use-theme-color';
import { useColorScheme } from '../use-color-scheme';
import { Colors } from '@/constants/theme';

jest.mock('../use-color-scheme', () => ({
  useColorScheme: jest.fn(),
}));

const mockedUseColorScheme = useColorScheme as jest.MockedFunction<typeof useColorScheme>;

function ThemeProbe({
  props,
  colorName,
  testID,
}: {
  props: Parameters<typeof useThemeColor>[0];
  colorName: Parameters<typeof useThemeColor>[1];
  testID: string;
}) {
  const value = useThemeColor(props, colorName);
  return <Text testID={testID}>{value}</Text>;
}

afterEach(() => {
  jest.clearAllMocks();
});

describe('useThemeColor', () => {
  it('prefers light override when light theme', () => {
    mockedUseColorScheme.mockReturnValue('light');

    const { getByTestId } = render(
      <ThemeProbe props={{ light: '#abcdef', dark: '#000000' }} colorName="text" testID="color" />
    );

    expect(getByTestId('color').props.children).toBe('#abcdef');
  });

  it('falls back to theme palette when override missing', () => {
    mockedUseColorScheme.mockReturnValue('dark');

    const { getByTestId } = render(<ThemeProbe props={{}} colorName="icon" testID="color" />);

    expect(getByTestId('color').props.children).toBe(Colors.dark.icon);
  });

  it('uses dark override when provided', () => {
    mockedUseColorScheme.mockReturnValue('dark');

    const { getByTestId } = render(
      <ThemeProbe props={{ dark: '#123456' }} colorName="tint" testID="color" />
    );

    expect(getByTestId('color').props.children).toBe('#123456');
  });
});
