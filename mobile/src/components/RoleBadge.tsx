import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { radius, spacing } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';
import type { Role } from '../types/api';

type RoleBadgeProps = {
  role: Role;
};

export function RoleBadge({ role }: RoleBadgeProps) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(), []);
  const isAdmin = role === 'ADMIN';

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: isAdmin ? theme.primary : theme.warning }
      ]}
    >
      <Text style={[styles.text, { color: isAdmin ? theme.white : theme.black }]}>
        {isAdmin ? 'ADMIN' : 'USER'}
      </Text>
    </View>
  );
}

function createStyles() {
  return StyleSheet.create({
    badge: {
      alignSelf: 'flex-start',
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
      borderRadius: radius.sm
    },
    text: {
      fontSize: 12,
      fontWeight: '900'
    }
  });
}
