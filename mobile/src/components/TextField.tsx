import { useMemo } from 'react';
import type { TextInputProps } from 'react-native';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { radius, spacing } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';

type TextFieldProps = TextInputProps & {
  label: string;
  error?: string;
};

export function TextField({ label, error, style, autoCorrect = false, ...props }: TextFieldProps) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...props}
        autoCorrect={autoCorrect}
        placeholderTextColor={theme.muted}
        selectionColor={theme.primary}
        style={[styles.input, error ? styles.inputError : null, style]}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
  return StyleSheet.create({
    container: {
      gap: spacing.xs
    },
    label: {
      color: theme.text,
      fontWeight: '800',
      fontSize: 14
    },
    input: {
      minHeight: 50,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.surface,
      paddingHorizontal: spacing.md,
      color: theme.text,
      fontSize: 16
    },
    inputError: {
      borderColor: theme.danger
    },
    error: {
      color: theme.danger,
      fontSize: 12,
      fontWeight: '700'
    }
  });
}
