import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft, Plus, RefreshCcw } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { EmptyState } from '../components/EmptyState';
import { Header } from '../components/Header';
import { IconButton } from '../components/IconButton';
import { Screen } from '../components/Screen';
import { UserCard } from '../components/UserCard';
import { colors, spacing } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';
import type { RootStackParamList } from '../navigation/types';
import { api } from '../services/api';
import type { User } from '../types/api';
import { getApiErrorMessage } from '../utils/formatters';

type UsersScreenProps = NativeStackScreenProps<RootStackParamList, 'Users'>;

export function UsersScreen({ navigation }: UsersScreenProps) {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      Alert.alert('Usuarios', 'Somente ADMIN pode gerenciar usuarios.');
      navigation.goBack();
    }
  }, [navigation, user?.role]);

  const loadUsers = useCallback(async () => {
    try {
      const { data } = await api.get<User[]>('/users');
      setUsers(data);
    } catch (error) {
      Alert.alert('Usuarios', getApiErrorMessage(error));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (user?.role === 'ADMIN') {
        void loadUsers();
      }
    }, [loadUsers, user?.role])
  );

  async function handleRefresh() {
    setRefreshing(true);
    await loadUsers();
  }

  function confirmDelete(selectedUser: User) {
    Alert.alert('Excluir usuario', `Deseja excluir ${selectedUser.name}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => void handleDelete(selectedUser.id)
      }
    ]);
  }

  async function handleDelete(userId: string) {
    try {
      await api.delete(`/users/${userId}`);
      setUsers((currentUsers) => currentUsers.filter((item) => item.id !== userId));
    } catch (error) {
      Alert.alert('Excluir usuario', getApiErrorMessage(error));
    }
  }

  return (
    <Screen scroll={false}>
      <Header
        title="Usuarios"
        subtitle="Controle de acesso do sistema"
        right={
          <IconButton
            label="Voltar"
            onPress={() => navigation.goBack()}
            icon={<ArrowLeft size={20} color={colors.text} />}
          />
        }
      />

      <View style={styles.actionRow}>
        <Button
          label="Novo usuario"
          onPress={() => navigation.navigate('UserForm')}
          icon={<Plus size={18} color={colors.white} />}
        />
        <Button
          label="Atualizar"
          onPress={() => void handleRefresh()}
          variant="secondary"
          icon={<RefreshCcw size={18} color={colors.text} />}
        />
      </View>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <UserCard
            user={item}
            currentUserId={user?.id}
            onEdit={() => navigation.navigate('UserForm', { userId: item.id })}
            onDelete={() => confirmDelete(item)}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          loading ? (
            <Text style={styles.loadingText}>Carregando usuarios...</Text>
          ) : (
            <EmptyState
              title="Nenhum usuario encontrado"
              message="Cadastre usuarios para liberar acesso operacional ao estoque."
            />
          )
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
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
    color: colors.muted,
    textAlign: 'center',
    marginTop: spacing.xl
  }
});