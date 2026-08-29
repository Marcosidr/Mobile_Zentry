import { LogIn } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { Screen } from '../components/Screen';
import { TextField } from '../components/TextField';
import { colors, radius, spacing } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';
import { getApiErrorMessage } from '../utils/formatters';

export function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('admin@stockflow.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    try {
      setLoading(true);
      await signIn({ email, password });
    } catch (error) {
      Alert.alert('Login', getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen contentContainerStyle={styles.container}>
      <View style={styles.brand}>
        <View style={styles.logoMark}>
          <Text style={styles.logoText}>SF</Text>
        </View>
        <Text style={styles.title}>StockFlow</Text>
        <Text style={styles.subtitle}>
          Controle produtos, imagens e movimentacoes de estoque pelo celular.
        </Text>
      </View>

      <View style={styles.form}>
        <TextField
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextField
          label="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Button
          label="Entrar"
          onPress={handleLogin}
          loading={loading}
          icon={<LogIn size={18} color={colors.white} />}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    gap: spacing.xxl
  },
  brand: {
    gap: spacing.md
  },
  logoMark: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoText: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '900'
  },
  title: {
    color: colors.text,
    fontSize: 34,
    fontWeight: '900'
  },
  subtitle: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 23
  },
  form: {
    gap: spacing.lg
  }
});

