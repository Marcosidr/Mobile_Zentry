import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ArrowDownCircle,
  ArrowLeft,
  ArrowUpCircle,
  Edit3,
  ImageIcon,
  Trash2
} from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { Alert, Image, StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { IconButton } from '../components/IconButton';
import { Screen } from '../components/Screen';
import { colors, radius, spacing } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';
import type { RootStackParamList } from '../navigation/types';
import { api, resolveAssetUrl } from '../services/api';
import type { Product } from '../types/api';
import { formatCurrency, getApiErrorMessage } from '../utils/formatters';

type ProductDetailsProps = NativeStackScreenProps<
  RootStackParamList,
  'ProductDetails'
>;

export function ProductDetailsScreen({ navigation, route }: ProductDetailsProps) {
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const imageUri = resolveAssetUrl(product?.imageUrl);

  const loadProduct = useCallback(async () => {
    try {
      const { data } = await api.get<Product>(`/products/${route.params.productId}`);
      setProduct(data);
    } catch (error) {
      Alert.alert('Produto', getApiErrorMessage(error));
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  }, [navigation, route.params.productId]);

  useFocusEffect(
    useCallback(() => {
      void loadProduct();
    }, [loadProduct])
  );

  function confirmDelete() {
    Alert.alert('Excluir produto', 'Esta acao nao pode ser desfeita.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => void handleDelete()
      }
    ]);
  }

  async function handleDelete() {
    if (!product) {
      return;
    }

    try {
      await api.delete(`/products/${product.id}`);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Excluir produto', getApiErrorMessage(error));
    }
  }

  if (loading || !product) {
    return (
      <Screen>
        <Header
          title="Produto"
          right={
            <IconButton
              label="Voltar"
              onPress={() => navigation.goBack()}
              icon={<ArrowLeft size={20} color={colors.text} />}
            />
          }
        />
        <Text style={styles.loadingText}>Carregando produto...</Text>
      </Screen>
    );
  }

  const isLowStock = product.stockStatus === 'LOW';

  return (
    <Screen>
      <Header
        title={product.name}
        subtitle={product.code}
        right={
          <IconButton
            label="Voltar"
            onPress={() => navigation.goBack()}
            icon={<ArrowLeft size={20} color={colors.text} />}
          />
        }
      />

      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.heroImage} />
      ) : (
        <View style={styles.heroPlaceholder}>
          <ImageIcon size={44} color={colors.muted} />
        </View>
      )}

      <View style={styles.summary}>
        <View>
          <Text style={styles.label}>Preco</Text>
          <Text style={styles.value}>{formatCurrency(product.price)}</Text>
        </View>
        <View>
          <Text style={styles.label}>Estoque atual</Text>
          <Text style={[styles.value, isLowStock ? styles.lowValue : null]}>
            {product.quantity}
          </Text>
        </View>
        <View>
          <Text style={styles.label}>Estoque minimo</Text>
          <Text style={styles.value}>{product.minimumStock}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Detalhes</Text>
        <Text style={styles.paragraph}>
          {product.description || 'Produto sem descricao cadastrada.'}
        </Text>
        <Text style={styles.meta}>Categoria: {product.category.name}</Text>
        <Text style={styles.meta}>
          Situacao: {isLowStock ? 'Estoque baixo' : 'Estoque adequado'}
        </Text>
      </View>

      <View style={styles.actionGrid}>
        <Button
          label="Entrada"
          onPress={() =>
            navigation.navigate('StockMovement', {
              productId: product.id,
              type: 'ENTRADA'
            })
          }
          icon={<ArrowUpCircle size={18} color={colors.white} />}
        />
        <Button
          label="Saida"
          variant="secondary"
          onPress={() =>
            navigation.navigate('StockMovement', {
              productId: product.id,
              type: 'SAIDA'
            })
          }
          icon={<ArrowDownCircle size={18} color={colors.text} />}
        />
      </View>

      {user?.role === 'ADMIN' ? (
        <View style={styles.adminActions}>
          <Button
            label="Editar"
            variant="secondary"
            onPress={() =>
              navigation.navigate('ProductForm', { productId: product.id })
            }
            icon={<Edit3 size={18} color={colors.text} />}
          />
          <Button
            label="Excluir"
            variant="danger"
            onPress={confirmDelete}
            icon={<Trash2 size={18} color={colors.white} />}
          />
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  loadingText: {
    color: colors.muted,
    textAlign: 'center'
  },
  heroImage: {
    width: '100%',
    aspectRatio: 1.6,
    borderRadius: radius.md,
    backgroundColor: colors.surface
  },
  heroPlaceholder: {
    width: '100%',
    aspectRatio: 1.6,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center'
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    padding: spacing.md
  },
  label: {
    color: colors.muted,
    fontSize: 12,
    marginBottom: spacing.xs
  },
  value: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900'
  },
  lowValue: {
    color: colors.warning
  },
  section: {
    gap: spacing.sm
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800'
  },
  paragraph: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 22
  },
  meta: {
    color: colors.muted,
    fontSize: 14
  },
  actionGrid: {
    flexDirection: 'row',
    gap: spacing.md
  },
  adminActions: {
    gap: spacing.md
  }
});
