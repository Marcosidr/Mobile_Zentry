import { useFocusEffect } from '@react-navigation/native';
import {
  ArrowDownCircle,
  ArrowLeft,
  ArrowUpCircle,
  Edit3,
  ImageIcon,
  Trash2
} from 'lucide-react-native';
import { useCallback, useMemo, useState } from 'react';
import { Alert, Image, StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { IconButton } from '../components/IconButton';
import { Screen } from '../components/Screen';
import { radius, spacing } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import type { RootStackScreenProps } from '../navigation/types';
import { api, resolveAssetUrl } from '../services/api';
import type { Product } from '../types/api';
import { formatCurrency, getApiErrorMessage } from '../utils/formatters';

type ProductDetailsProps = RootStackScreenProps<'ProductDetails'>;

export function ProductDetailsScreen({ navigation, route }: ProductDetailsProps) {
  const { user } = useAuth();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
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
              icon={<ArrowLeft size={20} color={theme.text} />}
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
            icon={<ArrowLeft size={20} color={theme.text} />}
          />
        }
      />

      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.heroImage} />
      ) : (
        <View style={styles.heroPlaceholder}>
          <ImageIcon size={44} color={theme.muted} />
        </View>
      )}

      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text style={styles.label}>Preco</Text>
          <Text style={styles.value}>{formatCurrency(product.price)}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.label}>Estoque atual</Text>
          <Text style={[styles.value, isLowStock ? styles.lowValue : null]}>
            {product.quantity}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.label}>Minimo</Text>
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
          icon={<ArrowUpCircle size={18} color={theme.white} />}
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
          icon={<ArrowDownCircle size={18} color={theme.text} />}
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
            icon={<Edit3 size={18} color={theme.text} />}
          />
          <Button
            label="Excluir"
            variant="danger"
            onPress={confirmDelete}
            icon={<Trash2 size={18} color={theme.white} />}
          />
        </View>
      ) : null}
    </Screen>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
  return StyleSheet.create({
    loadingText: {
      color: theme.muted,
      textAlign: 'center',
      fontWeight: '700'
    },
    heroImage: {
      width: '100%',
      aspectRatio: 1.6,
      borderRadius: radius.md,
      backgroundColor: theme.surfaceMuted
    },
    heroPlaceholder: {
      width: '100%',
      aspectRatio: 1.6,
      borderRadius: radius.md,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
      alignItems: 'center',
      justifyContent: 'center'
    },
    summary: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: spacing.sm,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: radius.md,
      backgroundColor: theme.surface,
      padding: spacing.md
    },
    summaryItem: {
      flex: 1,
      gap: spacing.xs
    },
    label: {
      color: theme.muted,
      fontSize: 12,
      fontWeight: '800'
    },
    value: {
      color: theme.text,
      fontSize: 18,
      fontWeight: '900'
    },
    lowValue: {
      color: theme.warning
    },
    section: {
      gap: spacing.sm
    },
    sectionTitle: {
      color: theme.text,
      fontSize: 18,
      fontWeight: '900'
    },
    paragraph: {
      color: theme.text,
      fontSize: 15,
      lineHeight: 22
    },
    meta: {
      color: theme.muted,
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '600'
    },
    actionGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.md
    },
    adminActions: {
      gap: spacing.md
    }
  });
}
