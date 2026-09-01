import type { PropsWithChildren } from 'react';
import { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { darkTheme, lightTheme } from '../constants/theme';
import type { AppTheme, ThemeMode } from '../constants/theme';

type ThemeContextData = {
  mode: ThemeMode;
  theme: AppTheme;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextData | undefined>(undefined);

export function ThemeProvider({ children }: PropsWithChildren) {
  const colorScheme = useColorScheme();
  const mode: ThemeMode = colorScheme === 'dark' ? 'dark' : 'light';

  const value = useMemo(
    () => ({
      mode,
      theme: mode === 'dark' ? darkTheme : lightTheme,
      isDark: mode === 'dark'
    }),
    [mode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme deve ser usado dentro de ThemeProvider.');
  }

  return context;
}
