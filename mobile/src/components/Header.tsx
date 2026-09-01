import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { spacing } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';

type HeaderProps = {
  title: string;
  subtitle?: string;
  right?: ReactNode;
};

export function Header({ title, subtitle, right }: HeaderProps) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.header}>
      <View style={styles.titleGroup}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle} numberOfLines={2}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
  return StyleSheet.create({
    header: {
      minHeight: 56,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.md
    },
    titleGroup: {
      flex: 1,
      gap: spacing.xs
    },
    title: {
      color: theme.text,
      fontSize: 24,
      fontWeight: '900'
    },
    subtitle: {
      color: theme.muted,
      fontSize: 14,
      lineHeight: 20
    }
  });
}
