import React from 'react';
import { StyleSheet } from 'react-native';
import { render } from '@testing-library/react-native';

import { ThemedText } from '../themed-text';
import { Layer3Colors } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

jest.mock('@/hooks/use-theme-color', () => ({
  useThemeColor: jest.fn(),
}));

const mockedUseThemeColor = useThemeColor as jest.Mock;

beforeEach(() => {
  mockedUseThemeColor.mockReturnValue('#123456');
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('ThemedText', () => {
  it('uses theme color and default typography', () => {
    const { getByText } = render(<ThemedText>Default text</ThemedText>);

    expect(mockedUseThemeColor).toHaveBeenCalledWith({ light: undefined, dark: undefined }, 'text');

    const flattened = StyleSheet.flatten(getByText('Default text').props.style);
    expect(flattened.color).toBe('#123456');
    expect(flattened.fontSize).toBe(16);
    expect(flattened.lineHeight).toBe(24);
  });

  it('applies title variant styles', () => {
    const { getByText } = render(<ThemedText type="title">Heading</ThemedText>);

    const flattened = StyleSheet.flatten(getByText('Heading').props.style);
    expect(flattened.fontSize).toBe(32);
    expect(flattened.fontWeight).toBe('bold');
    expect(flattened.lineHeight).toBe(32);
  });

  it('applies link variant overrides and merges custom style', () => {
    const { getByText } = render(
      <ThemedText type="link" style={{ textAlign: 'center' }}>
        Link label
      </ThemedText>
    );

    const flattened = StyleSheet.flatten(getByText('Link label').props.style);
    expect(flattened.color).toBe(Layer3Colors.brandTeal);
    expect(flattened.textAlign).toBe('center');
    expect(flattened.lineHeight).toBe(30);
  });
});
