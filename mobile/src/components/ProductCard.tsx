import { AlertTriangle, ChevronRight, ImageIcon } from 'lucide-react-native';
import { useMemo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { radius, spacing } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';
import { resolveAssetUrl } from '../services/api';
import type { Product } from '../types/api';
import { formatCurrency } from '../utils/formatters';

type ProductCardProps = {
  product: Product;
  onPress: () => void;
};

export function ProductCard({ product, onPress }: ProductCardProps) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const imageUri = resolveAssetUrl(product.imageUrl);
  const isLowStock = product.stockStatus === 'LOW';

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, { opacity: pressed ? 0.9 : 1 }]}
    >
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <ImageIcon size={24} color={theme.muted} />
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.name} numberOfLines={1}>
            {product.name}
          </Text>
          {isLowStock ? <AlertTriangle size={18} color={theme.warning} /> : null}
        </View>

        <Text style={styles.meta} numberOfLines={1}>
          {product.code} | {product.category.name}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.price}>{formatCurrency(product.price)}</Text>
          <Text style={[styles.quantity, isLowStock ? styles.lowQuantity : null]}>
            Estoque: {product.quantity}
          </Text>
        </View>
      </View>

      <ChevronRight size={20} color={theme.muted} />
    </Pressable>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
  return StyleSheet.create({
    card: {
      minHeight: 96,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.surface,
      padding: spacing.md
    },
    image: {
      width: 64,
      height: 64,
      borderRadius: radius.md,
      backgroundColor: theme.surfaceMuted
    },
    imagePlaceholder: {
      width: 64,
      height: 64,
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
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm
    },
    name: {
      flex: 1,
      color: theme.text,
      fontSize: 16,
      fontWeight: '900'
    },
    meta: {
      color: theme.muted,
      fontSize: 13,
      fontWeight: '600'
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.sm
    },
    price: {
      color: theme.primary,
      fontWeight: '900',
      fontSize: 15
    },
    quantity: {
      color: theme.text,
      fontWeight: '800',
      fontSize: 13
    },
    lowQuantity: {
      color: theme.warning
    }
  });
}
