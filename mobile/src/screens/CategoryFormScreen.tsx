import { ArrowLeft, Save, Tags } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { IconButton } from '../components/IconButton';
import { Screen } from '../components/Screen';
import { TextField } from '../components/TextField';
import { radius, spacing } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import type { RootStackScreenProps } from '../navigation/types';
import { api } from '../services/api';
import type { Category } from '../types/api';
import { getApiErrorMessage } from '../utils/formatters';

type CategoryFormScreenProps = RootStackScreenProps<'CategoryForm'>;

export function CategoryFormScreen({ navigation, route }: CategoryFormScreenProps) {
  const { user } = useAuth();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const categoryId = route.params?.categoryId;
  const isEditing = Boolean(categoryId);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      Alert.alert('Categorias', 'Somente ADMIN pode gerenciar categorias.');
      navigation.goBack();
      return;
    }

    if (categoryId) {
      void loadCategory(categoryId);
    }
  }, [categoryId, navigation, user?.role]);

  async function loadCategory(id: string) {
    try {
      const { data } = await api.get<Category>(`/categories/${id}`);
      setName(data.name);
    } catch (error) {
      Alert.alert('Categoria', getApiErrorMessage(error));
      navigation.goBack();
    }
  }

  function validateForm() {
    if (name.trim().length < 2) {
      Alert.alert('Categoria', 'Informe um nome com pelo menos 2 caracteres.');
      return false;
    }

    return true;
  }

  async function handleSubmit() {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const payload = { name: name.trim() };

      if (isEditing && categoryId) {
        await api.put(`/categories/${categoryId}`, payload);
      } else {
        await api.post('/categories', payload);
      }

      navigation.navigate('MainTabs', { screen: 'CategoriesTab' });
    } catch (error) {
      Alert.alert('Salvar categoria', getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <Header
        title={isEditing ? 'Editar categoria' : 'Nova categoria'}
        subtitle="Disponivel apenas para ADMIN"
        right={
          <IconButton
            label="Voltar"
            onPress={() => navigation.goBack()}
            icon={<ArrowLeft size={20} color={theme.text} />}
          />
        }
      />

      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <Tags size={28} color={theme.primary} />
        </View>
        <View style={styles.heroTextGroup}>
          <Text style={styles.heroTitle}>Classificacao do estoque</Text>
          <Text style={styles.heroText}>
            Use nomes claros para facilitar cadastro, busca e leitura dos produtos.
          </Text>
        </View>
      </View>

      <View style={styles.form}>
        <TextField
          label="Nome da categoria"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          returnKeyType="done"
          onSubmitEditing={() => void handleSubmit()}
        />

        <Button
          label="Salvar categoria"
          onPress={() => void handleSubmit()}
          loading={loading}
          icon={<Save size={18} color={theme.white} />}
        />
      </View>
    </Screen>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
  return StyleSheet.create({
    hero: {
      minHeight: 112,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.surface,
      padding: spacing.lg
    },
    heroIcon: {
      width: 56,
      height: 56,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: radius.md,
      backgroundColor: theme.surfaceMuted,
      borderWidth: 1,
      borderColor: theme.border
    },
    heroTextGroup: {
      flex: 1,
      gap: spacing.xs
    },
    heroTitle: {
      color: theme.text,
      fontSize: 17,
      fontWeight: '900'
    },
    heroText: {
      color: theme.muted,
      fontSize: 14,
      lineHeight: 20
    },
    form: {
      gap: spacing.lg
    }
  });
}
