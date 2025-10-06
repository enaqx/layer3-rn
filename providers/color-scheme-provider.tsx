import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { ColorSchemeName, useColorScheme as useSystemColorScheme } from 'react-native';

type SupportedColorScheme = Extract<ColorSchemeName, 'light' | 'dark'>;
type ColorSchemeValue = SupportedColorScheme extends never
  ? 'light' | 'dark'
  : SupportedColorScheme;

export type ColorSchemeContextValue = {
  colorScheme: ColorSchemeValue;
  setColorScheme: (scheme: ColorSchemeValue) => void;
  toggleColorScheme: () => void;
  resetToSystem: () => void;
  isUserPreference: boolean;
};

export const ColorSchemeContext = createContext<ColorSchemeContextValue | undefined>(undefined);

const resolveSystemScheme = (systemScheme: ColorSchemeName): ColorSchemeValue => {
  return systemScheme === 'dark' ? 'dark' : 'light';
};

type ColorSchemeProviderProps = {
  children: React.ReactNode;
};

export function ColorSchemeProvider({ children }: ColorSchemeProviderProps) {
  const systemColorScheme = useSystemColorScheme();
  const resolvedSystemScheme = resolveSystemScheme(systemColorScheme);
  const [userPreference, setUserPreference] = useState<ColorSchemeValue | null>(null);

  const effectiveScheme = userPreference ?? resolvedSystemScheme;

  const setColorScheme = useCallback((scheme: ColorSchemeValue) => {
    setUserPreference(scheme);
  }, []);

  const toggleColorScheme = useCallback(() => {
    setUserPreference((prev) => {
      const base = prev ?? resolvedSystemScheme;
      return base === 'dark' ? 'light' : 'dark';
    });
  }, [resolvedSystemScheme]);

  const resetToSystem = useCallback(() => {
    setUserPreference(null);
  }, []);

  const contextValue = useMemo<ColorSchemeContextValue>(() => {
    return {
      colorScheme: effectiveScheme,
      setColorScheme,
      toggleColorScheme,
      resetToSystem,
      isUserPreference: userPreference !== null,
    };
  }, [effectiveScheme, resetToSystem, setColorScheme, toggleColorScheme, userPreference]);

  return <ColorSchemeContext.Provider value={contextValue}>{children}</ColorSchemeContext.Provider>;
}

export function useColorSchemeContext() {
  const context = useContext(ColorSchemeContext);
  if (!context) {
    throw new Error('useColorSchemeContext must be used within a ColorSchemeProvider');
  }
  return context;
}
