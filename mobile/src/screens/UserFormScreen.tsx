import { ArrowLeft, Save, ShieldCheck, UserCircle } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
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
import type { Role, User } from '../types/api';
import { getApiErrorMessage } from '../utils/formatters';

type UserFormScreenProps = RootStackScreenProps<'UserForm'>;

type FormState = {
  name: string;
  email: string;
  password: string;
  role: Role;
};

const initialForm: FormState = {
  name: '',
  email: '',
  password: '',
  role: 'USER'
};

export function UserFormScreen({ navigation, route }: UserFormScreenProps) {
  const { user: currentUser } = useAuth();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const userId = route.params?.userId;
  const isEditing = Boolean(userId);
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser?.role !== 'ADMIN') {
      Alert.alert('Usuarios', 'Somente ADMIN pode gerenciar usuarios.');
      navigation.goBack();
      return;
    }

    if (userId) {
      void loadUser(userId);
    }
  }, [currentUser?.role, navigation, userId]);

  async function loadUser(id: string) {
    try {
      const { data } = await api.get<User>(`/users/${id}`);
      setForm({
        name: data.name,
        email: data.email,
        password: '',
        role: data.role
      });
    } catch (error) {
      Alert.alert('Usuario', getApiErrorMessage(error));
      navigation.goBack();
    }
  }

  function updateForm<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function validateForm() {
    if (!form.name.trim() || !form.email.trim()) {
      Alert.alert('Usuario', 'Informe nome e e-mail.');
      return false;
    }

    if (!isEditing && form.password.length < 6) {
      Alert.alert('Usuario', 'A senha deve ter pelo menos 6 caracteres.');
      return false;
    }

    if (isEditing && form.password && form.password.length < 6) {
      Alert.alert('Usuario', 'A nova senha deve ter pelo menos 6 caracteres.');
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
      const payload = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        role: form.role,
        ...(form.password ? { password: form.password } : {})
      };

      if (isEditing && userId) {
        await api.put(`/users/${userId}`, payload);
      } else {
        await api.post('/users', payload);
      }

      navigation.navigate('MainTabs', { screen: 'UsersTab' });
    } catch (error) {
      Alert.alert('Salvar usuario', getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <Header
        title={isEditing ? 'Editar usuario' : 'Novo usuario'}
        subtitle="Disponivel apenas para ADMIN"
        right={
          <IconButton
            label="Voltar"
            onPress={() => navigation.goBack()}
            icon={<ArrowLeft size={20} color={theme.text} />}
          />
        }
      />

      <View style={styles.form}>
        <TextField
          label="Nome"
          value={form.name}
          onChangeText={(value) => updateForm('name', value)}
          autoCapitalize="words"
          textContentType="name"
        />
        <TextField
          label="E-mail"
          value={form.email}
          onChangeText={(value) => updateForm('email', value)}
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
        />
        <TextField
          label={isEditing ? 'Nova senha' : 'Senha'}
          value={form.password}
          onChangeText={(value) => updateForm('password', value)}
          secureTextEntry
          textContentType="newPassword"
          placeholder={isEditing ? 'Deixe em branco para manter' : undefined}
        />

        <View style={styles.roleGroup}>
          <Text style={styles.roleLabel}>Perfil</Text>
          <View style={styles.roleRow}>
            <RoleOption
              label="USER"
              selected={form.role === 'USER'}
              icon={<UserCircle size={20} color={form.role === 'USER' ? theme.white : theme.muted} />}
              onPress={() => updateForm('role', 'USER')}
            />
            <RoleOption
              label="ADMIN"
              selected={form.role === 'ADMIN'}
              icon={<ShieldCheck size={20} color={form.role === 'ADMIN' ? theme.white : theme.primary} />}
              onPress={() => updateForm('role', 'ADMIN')}
            />
          </View>
        </View>

        <Button
          label="Salvar usuario"
          onPress={() => void handleSubmit()}
          loading={loading}
          icon={<Save size={18} color={theme.white} />}
        />
      </View>
    </Screen>
  );
}

interface RoleOptionProps {
  label: Role;
  selected: boolean;
  icon: ReactNode;
  onPress: () => void;
}

function RoleOption({ label, selected, icon, onPress }: RoleOptionProps) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.roleOption,
        selected ? styles.roleOptionSelected : null,
        { opacity: pressed ? 0.85 : 1 }
      ]}
    >
      {icon}
      <Text style={[styles.roleText, selected ? styles.roleTextSelected : null]}>
        {label}
      </Text>
    </Pressable>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
  return StyleSheet.create({
    form: {
      gap: spacing.lg
    },
    roleGroup: {
      gap: spacing.sm
    },
    roleLabel: {
      color: theme.text,
      fontSize: 14,
      fontWeight: '800'
    },
    roleRow: {
      flexDirection: 'row',
      gap: spacing.md
    },
    roleOption: {
      flex: 1,
      minHeight: 50,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.surface
    },
    roleOptionSelected: {
      backgroundColor: theme.primary,
      borderColor: theme.primary
    },
    roleText: {
      color: theme.text,
      fontSize: 14,
      fontWeight: '900'
    },
    roleTextSelected: {
      color: theme.white
    }
  });
}
