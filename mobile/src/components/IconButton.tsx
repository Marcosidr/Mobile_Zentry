import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { radius } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';

type IconButtonProps = {
  icon: ReactNode;
  onPress: () => void;
  label: string;
};

export function IconButton({ icon, onPress, label }: IconButtonProps) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.button, { opacity: pressed ? 0.75 : 1 }]}
    >
      {icon}
    </Pressable>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
  return StyleSheet.create({
    button: {
      width: 44,
      height: 44,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.surface,
      alignItems: 'center',
      justifyContent: 'center'
    }
  });
}
