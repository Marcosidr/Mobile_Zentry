import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowDownCircle, ArrowLeft, ArrowUpCircle, Save } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { IconButton } from '../components/IconButton';
import { Screen } from '../components/Screen';
import { TextField } from '../components/TextField';
import { colors, radius, spacing } from '../constants/theme';
import type { RootStackParamList } from '../navigation/types';
import { api } from '../services/api';
import type { Product, StockMovementResponse } from '../types/api';
import { getApiErrorMessage } from '../utils/formatters';

type StockMovementProps = NativeStackScreenProps<
  RootStackParamList,
  'StockMovement'
>;

export function StockMovementScreen({ navigation, route }: StockMovementProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState('1');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const { productId, type } = route.params;

  const title = type === 'ENTRADA' ? 'Registrar entrada' : 'Registrar saida';
  const movementColor = type === 'ENTRADA' ? colors.success : colors.accent;
  const nextQuantity = useMemo(() => {
    if (!product || Number.isNaN(Number(quantity))) {
      return product?.quantity ?? 0;
    }

    return type === 'ENTRADA'
      ? product.quantity + Number(quantity)
      : product.quantity - Number(quantity);
  }, [product, quantity, type]);

  useEffect(() => {
    async function loadProduct() {
      try {
        const { data } = await api.get<Product>(`/products/${productId}`);
        setProduct(data);
      } catch (error) {
        Alert.alert('Estoque', getApiErrorMessage(error));
      }
    }

    void loadProduct();
  }, [productId]);

  async function handleSubmit() {
    if (!product) {
      return;
    }

    const numericQuantity = Number(quantity);

    if (!Number.isInteger(numericQuantity) || numericQuantity <= 0) {
      Alert.alert('Estoque', 'Informe uma quantidade inteira maior que zero.');
      return;
    }

    try {
      setLoading(true);
      await api.post<StockMovementResponse>('/stock-movements', {
        productId,
        type,
        quantity: numericQuantity,
        note: note.trim() || undefined
      });

      navigation.replace('ProductDetails', { productId });
    } catch (error) {
      Alert.alert('Movimentacao', getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <Header
        title={title}
        subtitle={product?.name}
        right={
          <IconButton
            label="Voltar"
            onPress={() => navigation.goBack()}
            icon={<ArrowLeft size={20} color={colors.text} />}
          />
        }
      />

      <View style={[styles.typeBox, { borderColor: movementColor }]}>
        {type === 'ENTRADA' ? (
          <ArrowUpCircle size={28} color={movementColor} />
        ) : (
          <ArrowDownCircle size={28} color={movementColor} />
        )}
        <View style={styles.typeContent}>
          <Text style={styles.typeTitle}>{type}</Text>
          <Text style={styles.typeText}>
            Estoque atual: {product?.quantity ?? '-'} | Apos salvar: {nextQuantity}
          </Text>
        </View>
      </View>

      <TextField
        label="Quantidade"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="number-pad"
      />
      <TextField
        label="Observacao"
        value={note}
        onChangeText={setNote}
        multiline
        style={styles.textarea}
      />

      <Button
        label="Salvar movimentacao"
        onPress={() => void handleSubmit()}
        loading={loading}
        icon={<Save size={18} color={colors.white} />}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  typeBox: {
    minHeight: 92,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    backgroundColor: colors.surface,
    padding: spacing.md
  },
  typeContent: {
    flex: 1,
    gap: spacing.xs
  },
  typeTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900'
  },
  typeText: {
    color: colors.muted,
    fontSize: 14
  },
  textarea: {
    minHeight: 96,
    textAlignVertical: 'top',
    paddingVertical: spacing.md
  }
});

