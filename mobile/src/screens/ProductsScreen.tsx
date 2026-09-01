import { useFocusEffect } from '@react-navigation/native';
import { LogOut, Plus, RefreshCcw, Search } from 'lucide-react-native';
import { useCallback, useMemo, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { EmptyState } from '../components/EmptyState';
import { Header } from '../components/Header';
import { IconButton } from '../components/IconButton';
import { ProductCard } from '../components/ProductCard';
import { RoleBadge } from '../components/RoleBadge';
import { Screen } from '../components/Screen';
import { TextField } from '../components/TextField';
import { spacing } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import type { MainTabScreenProps } from '../navigation/types';
import { api } from '../services/api';
import type { Product } from '../types/api';
import { getApiErrorMessage } from '../utils/formatters';

type ProductsScreenProps = MainTabScreenProps<'ProductsTab'>;

export function ProductsScreen({ navigation }: ProductsScreenProps) {
  const { user, signOut } = useAuth();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadProducts = useCallback(async () => {
    try {
      const { data } = await api.get<Product[]>('/products', {
        params: search.trim() ? { search: search.trim() } : undefined
      });
      setProducts(data);
    } catch (error) {
      Alert.alert('Produtos', getApiErrorMessage(error));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [search]);

  useFocusEffect(
    useCallback(() => {
      void loadProducts();
    }, [loadProducts])
  );

  async function handleRefresh() {
    setRefreshing(true);
    await loadProducts();
  }

  return (
    <Screen scroll={false}>
      <Header
        title="Produtos"
        subtitle={user ? `${user.name} conectado` : undefined}
        right={
          <View style={styles.headerActions}>
            {user ? <RoleBadge role={user.role} /> : null}
            <IconButton
              label="Sair"
              onPress={() => void signOut()}
              icon={<LogOut size={20} color={theme.text} />}
            />
          </View>
        }
      />

      <View style={styles.searchRow}>
        <View style={styles.searchField}>
          <TextField
            label="Buscar"
            value={search}
            onChangeText={setSearch}
            placeholder="Nome ou codigo"
            autoCapitalize="none"
            returnKeyType="search"
            onSubmitEditing={() => void loadProducts()}
          />
        </View>
        <IconButton
          label="Buscar produto"
          onPress={() => void loadProducts()}
          icon={<Search size={20} color={theme.text} />}
        />
      </View>

      <View style={styles.actionRow}>
        {user?.role === 'ADMIN' ? (
          <Button
            label="Novo produto"
            onPress={() => navigation.navigate('ProductForm')}
            icon={<Plus size={18} color={theme.white} />}
          />
        ) : null}
        <Button
          label="Atualizar"
          onPress={() => void handleRefresh()}
          variant="secondary"
          icon={<RefreshCcw size={18} color={theme.text} />}
        />
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => navigation.navigate('ProductDetails', { productId: item.id })}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          loading ? (
            <Text style={styles.loadingText}>Carregando produtos...</Text>
          ) : (
            <EmptyState
              title="Nenhum produto encontrado"
              message="Cadastre produtos no perfil ADMIN ou ajuste a busca."
            />
          )
        }
      />
    </Screen>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
  return StyleSheet.create({
    headerActions: {
      alignItems: 'flex-end',
      gap: spacing.sm
    },
    searchRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: spacing.md
    },
    searchField: {
      flex: 1
    },
    actionRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.md
    },
    listContent: {
      flexGrow: 1,
      paddingBottom: spacing.xxl
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
