import { useContext } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

import { ColorSchemeContext } from '@/providers/color-scheme-provider';

type ColorScheme = 'light' | 'dark';

type ColorSchemeController = {
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
  toggleColorScheme: () => void;
  resetToSystem: () => void;
  isUserPreference: boolean;
};

const resolveScheme = (scheme: ReturnType<typeof useSystemColorScheme>): ColorScheme => {
  return scheme === 'dark' ? 'dark' : 'light';
};

export function useColorScheme(): ColorScheme {
  const systemScheme = useSystemColorScheme();
  const resolvedSystemScheme = resolveScheme(systemScheme);
  const context = useContext(ColorSchemeContext);

  if (context) {
    return context.colorScheme;
  }

  return resolvedSystemScheme;
}

export function useColorSchemeController(): ColorSchemeController {
  const systemScheme = useSystemColorScheme();
  const resolvedSystemScheme = resolveScheme(systemScheme);
  const context = useContext(ColorSchemeContext);

  if (!context) {
    const noop = () => {};

    return {
      colorScheme: resolvedSystemScheme,
      setColorScheme: noop,
      toggleColorScheme: noop,
      resetToSystem: noop,
      isUserPreference: false,
    };
  }

  return context;
}
