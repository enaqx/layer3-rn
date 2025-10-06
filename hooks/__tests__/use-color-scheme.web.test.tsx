import React from 'react';
import { Text } from 'react-native';
import { render, waitFor } from '@testing-library/react-native';

import { useColorScheme as useColorSchemeWeb } from '../use-color-scheme.web';
import {
  ColorSchemeContext,
  type ColorSchemeContextValue,
} from '@/providers/color-scheme-provider';
import * as ReactNative from 'react-native';

const mockUseSystemColorScheme = jest.spyOn(ReactNative, 'useColorScheme').mockReturnValue('light');

function WebSchemeProbe({
  onRender,
}: { onRender?: (value: ReturnType<typeof useColorSchemeWeb>) => void } = {}) {
  const scheme = useColorSchemeWeb();
  if (onRender) {
    onRender(scheme);
  }
  return <Text testID="scheme">{scheme}</Text>;
}

afterEach(() => {
  mockUseSystemColorScheme.mockReset();
  jest.clearAllMocks();
});

describe('useColorScheme (web)', () => {
  it('returns light until hydration completes', async () => {
    mockUseSystemColorScheme.mockReturnValue('dark');
    const renders: string[] = [];

    const { getByTestId } = render(<WebSchemeProbe onRender={(value) => renders.push(value)} />);
    expect(renders[0]).toBe('light');

    await waitFor(() => {
      expect(renders[renders.length - 1]).toBe('dark');
      expect(getByTestId('scheme').props.children).toBe('dark');
    });
  });

  it('prefers context value immediately when provided', () => {
    mockUseSystemColorScheme.mockReturnValue('dark');
    const contextValue: ColorSchemeContextValue = {
      colorScheme: 'light',
      setColorScheme: jest.fn(),
      toggleColorScheme: jest.fn(),
      resetToSystem: jest.fn(),
      isUserPreference: true,
    };

    const { getByTestId } = render(
      <ColorSchemeContext.Provider value={contextValue}>
        <WebSchemeProbe />
      </ColorSchemeContext.Provider>
    );

    expect(getByTestId('scheme').props.children).toBe('light');
  });
});
