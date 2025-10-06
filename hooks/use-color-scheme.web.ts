import { useContext, useEffect, useState } from 'react';
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

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme(): ColorScheme {
  const context = useContext(ColorSchemeContext);
  const [hasHydrated, setHasHydrated] = useState(false);
  const systemScheme = useSystemColorScheme();
  const resolvedScheme = context ? context.colorScheme : resolveScheme(systemScheme);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  if (context) {
    return context.colorScheme;
  }

  if (hasHydrated) {
    return resolvedScheme;
  }

  return 'light';
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
