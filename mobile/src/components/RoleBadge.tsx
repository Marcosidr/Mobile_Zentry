import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../constants/theme';
import type { Role } from '../types/api';

type RoleBadgeProps = {
  role: Role;
};

export function RoleBadge({ role }: RoleBadgeProps) {
  const isAdmin = role === 'ADMIN';

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: isAdmin ? colors.primary : colors.warning }
      ]}
    >
      <Text style={styles.text}>{isAdmin ? 'ADMIN' : 'USER'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm
  },
  text: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '800'
  }
});

