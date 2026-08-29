import { AlertTriangle, ChevronRight, ImageIcon } from 'lucide-react-native';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../constants/theme';
import { resolveAssetUrl } from '../services/api';
import type { Product } from '../types/api';
import { formatCurrency } from '../utils/formatters';

type ProductCardProps = {
  product: Product;
  onPress: () => void;
};

export function ProductCard({ product, onPress }: ProductCardProps) {
  const imageUri = resolveAssetUrl(product.imageUrl);
  const isLowStock = product.stockStatus === 'LOW';

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, { opacity: pressed ? 0.88 : 1 }]}
    >
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <ImageIcon size={24} color={colors.muted} />
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.name} numberOfLines={1}>
            {product.name}
          </Text>
          {isLowStock ? <AlertTriangle size={18} color={colors.warning} /> : null}
        </View>

        <Text style={styles.meta} numberOfLines={1}>
          {product.code} • {product.category.name}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.price}>{formatCurrency(product.price)}</Text>
          <Text style={[styles.quantity, isLowStock ? styles.lowQuantity : null]}>
            Estoque: {product.quantity}
          </Text>
        </View>
      </View>

      <ChevronRight size={20} color={colors.muted} />
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
  image: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
    backgroundColor: colors.background
  },
  imagePlaceholder: {
    width: 64,
    height: 64,
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
  meta: {
    color: colors.muted,
    fontSize: 13
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm
  },
  price: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 15
  },
  quantity: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 13
  },
  lowQuantity: {
    color: colors.warning
  }
});

