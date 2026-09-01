import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { spacing } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';

type EmptyStateProps = {
  title: string;
  message: string;
  action?: ReactNode;
};

export function EmptyState({ title, message, action }: EmptyStateProps) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {action}
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
  return StyleSheet.create({
    container: {
      minHeight: 180,
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.md,
      padding: spacing.lg
    },
    title: {
      color: theme.text,
      fontSize: 18,
      fontWeight: '900',
      textAlign: 'center'
    },
    message: {
      color: theme.muted,
      fontSize: 14,
      lineHeight: 20,
      textAlign: 'center'
    }
  });
}
