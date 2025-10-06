import React from 'react';
import { render, act, waitFor } from '@testing-library/react-native';
import * as ReactNative from 'react-native';

import {
  ColorSchemeProvider,
  useColorSchemeContext,
  type ColorSchemeContextValue,
} from '../color-scheme-provider';

const mockUseSystemColorScheme = jest.spyOn(ReactNative, 'useColorScheme').mockReturnValue('light');

type ConsumerProps = {
  onValue: (value: ColorSchemeContextValue) => void;
};

function Consumer({ onValue }: ConsumerProps) {
  const context = useColorSchemeContext();

  React.useEffect(() => {
    onValue(context);
  }, [context, onValue]);

  return null;
}

describe('ColorSchemeProvider', () => {
  let latestContext: ColorSchemeContextValue | undefined;

  beforeEach(() => {
    mockUseSystemColorScheme.mockReturnValue('light');
    latestContext = undefined;
  });

  afterEach(() => {
    mockUseSystemColorScheme.mockReset();
    jest.clearAllMocks();
  });

  const renderProvider = () => {
    const handleValue = (value: ColorSchemeContextValue) => {
      latestContext = value;
    };

    return render(
      <ColorSchemeProvider>
        <Consumer onValue={handleValue} />
      </ColorSchemeProvider>
    );
  };

  it('uses system color scheme by default', async () => {
    renderProvider();

    await waitFor(() => {
      expect(latestContext?.colorScheme).toBe('light');
    });
    expect(latestContext?.isUserPreference).toBe(false);
  });

  it('resolves dark system scheme and toggles correctly', async () => {
    mockUseSystemColorScheme.mockReturnValue('dark');
    renderProvider();

    await waitFor(() => {
      expect(latestContext?.colorScheme).toBe('dark');
    });
    expect(latestContext?.isUserPreference).toBe(false);

    await act(async () => {
      latestContext?.toggleColorScheme();
    });

    await waitFor(() => {
      expect(latestContext?.colorScheme).toBe('light');
    });
    expect(latestContext?.isUserPreference).toBe(true);

    await act(async () => {
      latestContext?.toggleColorScheme();
    });

    await waitFor(() => {
      expect(latestContext?.colorScheme).toBe('dark');
    });
  });

  it('allows explicit overrides and reset to system', async () => {
    renderProvider();

    await waitFor(() => {
      expect(latestContext).toBeDefined();
    });

    await act(async () => {
      latestContext?.setColorScheme('dark');
    });

    await waitFor(() => {
      expect(latestContext?.colorScheme).toBe('dark');
    });
    expect(latestContext?.isUserPreference).toBe(true);

    await act(async () => {
      latestContext?.resetToSystem();
    });

    await waitFor(() => {
      expect(latestContext?.colorScheme).toBe('light');
    });
    expect(latestContext?.isUserPreference).toBe(false);
  });

  it('throws when context is used outside provider', () => {
    const OutsideConsumer = () => {
      useColorSchemeContext();
      return null;
    };

    expect(() => render(<OutsideConsumer />)).toThrow(
      'useColorSchemeContext must be used within a ColorSchemeProvider'
    );
  });
});
