import { ShieldCheck, Trash2, UserCircle } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../constants/theme';
import type { User } from '../types/api';
import { RoleBadge } from './RoleBadge';

interface UserCardProps {
  user: User;
  currentUserId?: string;
  onEdit: () => void;
  onDelete: () => void;
}

export function UserCard({ user, currentUserId, onEdit, onDelete }: UserCardProps) {
  const isCurrentUser = user.id === currentUserId;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onEdit}
      style={({ pressed }) => [styles.card, { opacity: pressed ? 0.88 : 1 }]}
    >
      <View style={styles.avatar}>
        {user.role === 'ADMIN' ? (
          <ShieldCheck size={24} color={colors.primary} />
        ) : (
          <UserCircle size={24} color={colors.muted} />
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.name} numberOfLines={1}>
            {user.name}
          </Text>
          <RoleBadge role={user.role} />
        </View>
        <Text style={styles.email} numberOfLines={1}>
          {user.email}
        </Text>
        {isCurrentUser ? <Text style={styles.current}>Conta atual</Text> : null}
      </View>

      {!isCurrentUser ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Excluir usuario"
          onPress={onDelete}
          style={({ pressed }) => [styles.deleteButton, { opacity: pressed ? 0.7 : 1 }]}
        >
          <Trash2 size={18} color={colors.danger} />
        </Pressable>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 96,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.md
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border
  },
  content: {
    flex: 1,
    gap: spacing.xs
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm
  },
  name: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    fontWeight: '800'
  },
  email: {
    color: colors.muted,
    fontSize: 13
  },
  current: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800'
  },
  deleteButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    backgroundColor: '#FFF4F2'
  }
});