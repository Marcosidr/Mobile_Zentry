import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { ArrowLeft, Camera, Save } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { IconButton } from '../components/IconButton';
import { Screen } from '../components/Screen';
import { TextField } from '../components/TextField';
import { colors, radius, spacing } from '../constants/theme';
import type { RootStackParamList } from '../navigation/types';
import { api, resolveAssetUrl } from '../services/api';
import type { Category, Product } from '../types/api';
import { getApiErrorMessage } from '../utils/formatters';

type ProductFormProps = NativeStackScreenProps<RootStackParamList, 'ProductForm'>;

type ProductFormState = {
  name: string;
  description: string;
  code: string;
  price: string;
  quantity: string;
  minimumStock: string;
  categoryId: string;
};

const emptyForm: ProductFormState = {
  name: '',
  description: '',
  code: '',
  price: '',
  quantity: '0',
  minimumStock: '0',
  categoryId: ''
};

export function ProductFormScreen({ navigation, route }: ProductFormProps) {
  const productId = route.params?.productId;
  const isEditing = Boolean(productId);
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadInitialData = useCallback(async () => {
    try {
      const [{ data: categoryData }, productResponse] = await Promise.all([
        api.get<Category[]>('/categories'),
        productId ? api.get<Product>(`/products/${productId}`) : Promise.resolve(null)
      ]);

      setCategories(categoryData);

      if (productResponse) {
        const product = productResponse.data;
        setForm({
          name: product.name,
          description: product.description ?? '',
          code: product.code,
          price: String(product.price),
          quantity: String(product.quantity),
          minimumStock: String(product.minimumStock),
          categoryId: product.categoryId
        });
        setCurrentImageUrl(product.imageUrl ?? null);
        return;
      }

      setForm((previous) => ({
        ...previous,
        categoryId: previous.categoryId || categoryData[0]?.id || ''
      }));
    } catch (error) {
      Alert.alert('Produto', getApiErrorMessage(error));
    }
  }, [productId]);

  useFocusEffect(
    useCallback(() => {
      void loadInitialData();
    }, [loadInitialData])
  );

  function updateForm(field: keyof ProductFormState, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  async function pickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Imagem', 'Permissao para acessar as imagens foi negada.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8
    });

    if (!result.canceled && result.assets[0]?.uri) {
      setSelectedImage(result.assets[0].uri);
    }
  }

  function validateForm() {
    if (!form.name.trim() || !form.code.trim() || !form.categoryId) {
      Alert.alert('Produto', 'Informe nome, codigo e categoria.');
      return false;
    }

    if (Number.isNaN(Number(form.price)) || Number(form.price) < 0) {
      Alert.alert('Produto', 'Informe um preco valido.');
      return false;
    }

    if (Number.isNaN(Number(form.quantity)) || Number(form.quantity) < 0) {
      Alert.alert('Produto', 'Informe uma quantidade valida.');
      return false;
    }

    return true;
  }

  async function uploadProductImage(id: string) {
    if (!selectedImage) {
      return;
    }

    const filename = selectedImage.split('/').pop() ?? `produto-${Date.now()}.jpg`;
    const extension = filename.split('.').pop()?.toLowerCase();
    const mimeType =
      extension === 'png'
        ? 'image/png'
        : extension === 'webp'
          ? 'image/webp'
          : 'image/jpeg';

    const imageData = {
      uri: selectedImage,
      name: filename,
      type: mimeType
    };

    const data = new FormData();
    data.append('image', imageData as unknown as Blob);

    await api.post(`/products/${id}/image`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }

  async function handleSubmit() {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        code: form.code.trim(),
        price: Number(form.price),
        quantity: Number(form.quantity),
        minimumStock: Number(form.minimumStock || 0),
        categoryId: form.categoryId
      };

      const { data } = isEditing
        ? await api.put<Product>(`/products/${productId}`, payload)
        : await api.post<Product>('/products', payload);

      await uploadProductImage(data.id);
      navigation.replace('ProductDetails', { productId: data.id });
    } catch (error) {
      Alert.alert('Salvar produto', getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  const previewUri = selectedImage || resolveAssetUrl(currentImageUrl);

  return (
    <Screen>
      <Header
        title={isEditing ? 'Editar produto' : 'Novo produto'}
        right={
          <IconButton
            label="Voltar"
            onPress={() => navigation.goBack()}
            icon={<ArrowLeft size={20} color={colors.text} />}
          />
        }
      />

      <Pressable style={styles.imagePicker} onPress={() => void pickImage()}>
        {previewUri ? (
          <Image source={{ uri: previewUri }} style={styles.preview} />
        ) : (
          <View style={styles.previewPlaceholder}>
            <Camera size={32} color={colors.muted} />
            <Text style={styles.previewText}>Selecionar imagem</Text>
          </View>
        )}
      </Pressable>

      <View style={styles.form}>
        <TextField label="Nome" value={form.name} onChangeText={(value) => updateForm('name', value)} />
        <TextField
          label="Descricao"
          value={form.description}
          onChangeText={(value) => updateForm('description', value)}
          multiline
          style={styles.textarea}
        />
        <TextField label="Codigo" value={form.code} onChangeText={(value) => updateForm('code', value)} />
        <View style={styles.row}>
          <View style={styles.flex}>
            <TextField
              label="Preco"
              value={form.price}
              onChangeText={(value) => updateForm('price', value.replace(',', '.'))}
              keyboardType="decimal-pad"
            />
          </View>
          <View style={styles.flex}>
            <TextField
              label="Estoque"
              value={form.quantity}
              onChangeText={(value) => updateForm('quantity', value)}
              keyboardType="number-pad"
            />
          </View>
        </View>
        <TextField
          label="Estoque minimo"
          value={form.minimumStock}
          onChangeText={(value) => updateForm('minimumStock', value)}
          keyboardType="number-pad"
        />

        <View style={styles.categorySection}>
          <Text style={styles.categoryLabel}>Categoria</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryList}
          >
            {categories.map((category) => {
              const selected = form.categoryId === category.id;
              return (
                <Pressable
                  key={category.id}
                  onPress={() => updateForm('categoryId', category.id)}
                  style={[
                    styles.categoryPill,
                    selected ? styles.categoryPillSelected : null
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryPillText,
                      selected ? styles.categoryPillTextSelected : null
                    ]}
                  >
                    {category.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
          {categories.length === 0 ? (
            <Text style={styles.helperText}>
              Cadastre uma categoria pela API ou rode o seed antes de criar produtos.
            </Text>
          ) : null}
        </View>

        <Button
          label="Salvar"
          onPress={() => void handleSubmit()}
          loading={loading}
          icon={<Save size={18} color={colors.white} />}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  imagePicker: {
    width: '100%',
    aspectRatio: 1.6,
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface
  },
  preview: {
    width: '100%',
    height: '100%'
  },
  previewPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm
  },
  previewText: {
    color: colors.muted,
    fontWeight: '700'
  },
  form: {
    gap: spacing.lg
  },
  textarea: {
    minHeight: 96,
    textAlignVertical: 'top',
    paddingVertical: spacing.md
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md
  },
  flex: {
    flex: 1
  },
  categorySection: {
    gap: spacing.sm
  },
  categoryLabel: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 14
  },
  categoryList: {
    gap: spacing.sm
  },
  categoryPill: {
    minHeight: 40,
    justifyContent: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md
  },
  categoryPillSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  categoryPillText: {
    color: colors.text,
    fontWeight: '700'
  },
  categoryPillTextSelected: {
    color: colors.white
  },
  helperText: {
    color: colors.muted,
    fontSize: 13
  }
});
