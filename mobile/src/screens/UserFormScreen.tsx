import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft, Save, ShieldCheck, UserCircle } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { IconButton } from '../components/IconButton';
import { Screen } from '../components/Screen';
import { TextField } from '../components/TextField';
import { colors, radius, spacing } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';
import type { RootStackParamList } from '../navigation/types';
import { api } from '../services/api';
import type { Role, User } from '../types/api';
import { getApiErrorMessage } from '../utils/formatters';

type UserFormScreenProps = NativeStackScreenProps<RootStackParamList, 'UserForm'>;

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

      navigation.replace('Users');
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
            icon={<ArrowLeft size={20} color={colors.text} />}
          />
        }
      />

      <View style={styles.form}>
        <TextField
          label="Nome"
          value={form.name}
          onChangeText={(value) => updateForm('name', value)}
        />
        <TextField
          label="E-mail"
          value={form.email}
          onChangeText={(value) => updateForm('email', value)}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextField
          label={isEditing ? 'Nova senha' : 'Senha'}
          value={form.password}
          onChangeText={(value) => updateForm('password', value)}
          secureTextEntry
          placeholder={isEditing ? 'Deixe em branco para manter' : undefined}
        />

        <View style={styles.roleGroup}>
          <Text style={styles.roleLabel}>Perfil</Text>
          <View style={styles.roleRow}>
            <RoleOption
              label="USER"
              selected={form.role === 'USER'}
              icon={<UserCircle size={20} color={form.role === 'USER' ? colors.white : colors.muted} />}
              onPress={() => updateForm('role', 'USER')}
            />
            <RoleOption
              label="ADMIN"
              selected={form.role === 'ADMIN'}
              icon={<ShieldCheck size={20} color={form.role === 'ADMIN' ? colors.white : colors.primary} />}
              onPress={() => updateForm('role', 'ADMIN')}
            />
          </View>
        </View>

        <Button
          label="Salvar usuario"
          onPress={() => void handleSubmit()}
          loading={loading}
          icon={<Save size={18} color={colors.white} />}
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

const styles = StyleSheet.create({
  form: {
    gap: spacing.lg
  },
  roleGroup: {
    gap: spacing.sm
  },
  roleLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700'
  },
  roleRow: {
    flexDirection: 'row',
    gap: spacing.md
  },
  roleOption: {
    flex: 1,
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface
  },
  roleOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  roleText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800'
  },
  roleTextSelected: {
    color: colors.white
  }
});