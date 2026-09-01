import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { radius, spacing } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

type ButtonProps = {
  label: string;
  onPress: () => void;
  icon?: ReactNode;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
};

export function Button({
  label,
  onPress,
  icon,
  variant = 'primary',
  disabled = false,
  loading = false
}: ButtonProps) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(), []);
  const colorsForVariant = {
    primary: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
      textColor: theme.white
    },
    secondary: {
      backgroundColor: theme.surface,
      borderColor: theme.border,
      textColor: theme.text
    },
    danger: {
      backgroundColor: theme.danger,
      borderColor: theme.danger,
      textColor: theme.white
    },
    ghost: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      textColor: theme.primary
    }
  }[variant];
  const inactive = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={inactive}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: colorsForVariant.backgroundColor,
          borderColor: colorsForVariant.borderColor,
          opacity: inactive ? 0.55 : pressed ? 0.86 : 1
        }
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colorsForVariant.textColor} />
      ) : (
        <>
          {icon}
          <Text style={[styles.label, { color: colorsForVariant.textColor }]}>
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
}

function createStyles() {
  return StyleSheet.create({
    button: {
      minHeight: 50,
      borderWidth: 1,
      borderRadius: radius.md,
      paddingHorizontal: spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: spacing.sm
    },
    label: {
      fontSize: 15,
      fontWeight: '800'
    }
  });
}
