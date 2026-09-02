const baseColors = {
  white: '#FFFFFF',
  black: '#120F10'
};

export const lightTheme = {
  ...baseColors,
  background: '#F5F2F0',
  surface: '#FFFFFF',
  surfaceMuted: '#EFE9E6',
  border: '#DED5D2',
  text: '#22191C',
  muted: '#75686C',
  primary: '#A73446',
  primaryDark: '#7B2635',
  accent: '#B66443',
  success: '#8E6A10',
  warning: '#B77918',
  danger: '#C43D32',
  tabBar: '#FFFFFF'
};

export const darkTheme = {
  ...baseColors,
  background: '#151112',
  surface: '#201A1C',
  surfaceMuted: '#2B2326',
  border: '#3C3235',
  text: '#F3ECEC',
  muted: '#B7A9AC',
  primary: '#D85C72',
  primaryDark: '#F17A8D',
  accent: '#E28B5F',
  success: '#D4A22A',
  warning: '#F0B24E',
  danger: '#FF756A',
  tabBar: '#1A1517'
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