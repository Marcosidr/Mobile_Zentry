import { ChevronRight, Tags, Trash2 } from 'lucide-react-native';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { radius, spacing } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';
import type { Category } from '../types/api';

type CategoryCardProps = {
  category: Category;
  onEdit: () => void;
  onDelete: () => void;
};

export function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const productsCount = category._count?.products ?? 0;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onEdit}
      style={({ pressed }) => [styles.card, { opacity: pressed ? 0.9 : 1 }]}
    >
      <View style={styles.iconBox}>
        <Tags size={24} color={theme.primary} />
      </View>

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{category.name}</Text>
        <Text style={styles.meta} numberOfLines={1}>
          {productsCount} {productsCount === 1 ? 'produto vinculado' : 'produtos vinculados'}
        </Text>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Excluir categoria"
        onPress={(event) => {
          event.stopPropagation();
          onDelete();
        }}
        style={({ pressed }) => [styles.deleteButton, { opacity: pressed ? 0.72 : 1 }]}
      >
        <Trash2 size={18} color={theme.danger} />
      </Pressable>
      <ChevronRight size={20} color={theme.muted} />
    </Pressable>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
  return StyleSheet.create({
    card: {
      minHeight: 86,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.surface,
      padding: spacing.md
    },
    iconBox: {
      width: 52,
      height: 52,
      borderRadius: radius.md,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.surfaceMuted,
      borderWidth: 1,
      borderColor: theme.border
    },
    content: {
      flex: 1,
      gap: spacing.xs
    },
    name: {
      color: theme.text,
      fontSize: 16,
      fontWeight: '900'
    },
    meta: {
      color: theme.muted,
      fontSize: 13,
      fontWeight: '600'
    },
    deleteButton: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: radius.md,
      backgroundColor: theme.surfaceMuted
    }
  });
}

