import { useFocusEffect } from '@react-navigation/native';
import { Plus, RefreshCcw } from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { CategoryCard } from '../components/CategoryCard';
import { EmptyState } from '../components/EmptyState';
import { Header } from '../components/Header';
import { Screen } from '../components/Screen';
import { spacing } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import type { MainTabScreenProps } from '../navigation/types';
import { api } from '../services/api';
import type { Category } from '../types/api';
import { getApiErrorMessage } from '../utils/formatters';

type CategoriesScreenProps = MainTabScreenProps<'CategoriesTab'>;

export function CategoriesScreen({ navigation }: CategoriesScreenProps) {
  const { user } = useAuth();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      Alert.alert('Categorias', 'Somente ADMIN pode gerenciar categorias.');
      navigation.navigate('ProductsTab');
    }
  }, [navigation, user?.role]);

  const loadCategories = useCallback(async () => {
    try {
      const { data } = await api.get<Category[]>('/categories');
      setCategories(data);
    } catch (error) {
      Alert.alert('Categorias', getApiErrorMessage(error));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (user?.role === 'ADMIN') {
        void loadCategories();
      }
    }, [loadCategories, user?.role])
  );

  async function handleRefresh() {
    setRefreshing(true);
    await loadCategories();
  }

  function confirmDelete(category: Category) {
    Alert.alert('Excluir categoria', `Deseja excluir ${category.name}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => void handleDelete(category.id)
      }
    ]);
  }

  async function handleDelete(categoryId: string) {
    try {
      await api.delete(`/categories/${categoryId}`);
      setCategories((current) => current.filter((item) => item.id !== categoryId));
    } catch (error) {
      Alert.alert('Excluir categoria', getApiErrorMessage(error));
    }
  }

  return (
    <Screen scroll={false}>
      <Header
        title="Categorias"
        subtitle="Organize produtos por trilhas e setores do estoque"
      />

      <View style={styles.actionRow}>
        <Button
          label="Nova categoria"
          onPress={() => navigation.navigate('CategoryForm')}
          icon={<Plus size={18} color={theme.white} />}
        />
        <Button
          label="Atualizar"
          onPress={() => void handleRefresh()}
          variant="secondary"
          icon={<RefreshCcw size={18} color={theme.text} />}
        />
      </View>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <CategoryCard
            category={item}
            onEdit={() => navigation.navigate('CategoryForm', { categoryId: item.id })}
            onDelete={() => confirmDelete(item)}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          loading ? (
            <Text style={styles.loadingText}>Carregando categorias...</Text>
          ) : (
            <EmptyState
              title="Nenhuma categoria encontrada"
              message="Crie categorias para separar melhor os produtos do estoque."
            />
          )
        }
      />
    </Screen>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
  return StyleSheet.create({
    actionRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.md
    },
    listContent: {
      flexGrow: 1,
      paddingBottom: spacing.xl
    },
    separator: {
      height: spacing.md
    },
    loadingText: {
      color: theme.muted,
      textAlign: 'center',
      marginTop: spacing.xl,
      fontWeight: '700'
    }
  });
}


