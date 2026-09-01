const baseColors = {
  white: '#FFFFFF',
  black: '#0F1720'
};

export const lightTheme = {
  ...baseColors,
  background: '#F4F7F6',
  surface: '#FFFFFF',
  surfaceMuted: '#EEF3F2',
  border: '#D5DFDC',
  text: '#13211F',
  muted: '#65736F',
  primary: '#1E6F5C',
  primaryDark: '#155344',
  accent: '#C8563F',
  success: '#2F855A',
  warning: '#A66A13',
  danger: '#C2412D',
  tabBar: '#FFFFFF'
};

export const darkTheme = {
  ...baseColors,
  background: '#0F1715',
  surface: '#17211F',
  surfaceMuted: '#202D2A',
  border: '#2C3A36',
  text: '#E8F0ED',
  muted: '#A4B0AC',
  primary: '#287762',
  primaryDark: '#1D5D4D',
  accent: '#F08A6E',
  success: '#6DD39D',
  warning: '#F1B557',
  danger: '#FF7C67',
  tabBar: '#131D1A'
};

export type AppTheme = typeof lightTheme;
export type ThemeMode = 'light' | 'dark';

export const colors = lightTheme;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32
};

export const radius = {
  sm: 6,
  md: 8
};

