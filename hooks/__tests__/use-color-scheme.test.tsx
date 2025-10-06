import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { render, waitFor } from '@testing-library/react-native';

import { useColorScheme, useColorSchemeController } from '../use-color-scheme';
import {
  ColorSchemeContext,
  type ColorSchemeContextValue,
} from '@/providers/color-scheme-provider';
import * as ReactNative from 'react-native';

const mockUseSystemColorScheme = jest.spyOn(ReactNative, 'useColorScheme').mockReturnValue('light');

function SchemeProbe() {
  const scheme = useColorScheme();
  return <Text testID="scheme">{scheme}</Text>;
}

function ControllerProbe({
  onResult,
}: {
  onResult: (value: ReturnType<typeof useColorSchemeController>) => void;
}) {
  const controller = useColorSchemeController();
  useEffect(() => {
    onResult(controller);
  }, [controller, onResult]);

  return null;
}

afterEach(() => {
  mockUseSystemColorScheme.mockReset();
  jest.clearAllMocks();
});

describe('useColorScheme (native)', () => {
  it('returns system scheme when no provider is present', () => {
    mockUseSystemColorScheme.mockReturnValue('dark');
    const { getByTestId } = render(<SchemeProbe />);

    expect(getByTestId('scheme').props.children).toBe('dark');
  });

  it('prefers ColorSchemeContext value when available', () => {
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
        <SchemeProbe />
      </ColorSchemeContext.Provider>
    );

    expect(getByTestId('scheme').props.children).toBe('light');
  });

  it('provides fallback controller when context missing', async () => {
    mockUseSystemColorScheme.mockReturnValue('dark');

    const onResult = jest.fn();
    render(<ControllerProbe onResult={onResult} />);

    await waitFor(() => {
      expect(onResult).toHaveBeenCalled();
    });

    const controller = onResult.mock.calls[onResult.mock.calls.length - 1][0];
    expect(controller.colorScheme).toBe('dark');
    expect(controller.isUserPreference).toBe(false);

    controller.setColorScheme('light');
    controller.toggleColorScheme();
    controller.resetToSystem();
  });
});
