import { Boxes, LogIn } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { Screen } from '../components/Screen';
import { TextField } from '../components/TextField';
import { radius, spacing } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { getApiErrorMessage } from '../utils/formatters';

export function LoginScreen() {
  const { signIn } = useAuth();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [email, setEmail] = useState('admin@stockflow.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    try {
      setLoading(true);
      await signIn({ email: email.trim().toLowerCase(), password });
    } catch (error) {
      Alert.alert('Login', getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen contentContainerStyle={styles.container}>
      <View style={styles.brandArea}>
        <View style={styles.logoMark}>
          <Boxes size={30} color={theme.white} />
        </View>
        <Text style={styles.brandName}>StockFlow</Text>
        <Text style={styles.brandMeta}>Mobile Zentry</Text>
      </View>

      <View style={styles.formPanel}>
        <View style={styles.formHeader}>
          <Text style={styles.formTitle}>Entrar</Text>
          <Text style={styles.formSubtitle}>Acesse sua conta para continuar</Text>
        </View>

        <TextField
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
          returnKeyType="next"
          editable={!loading}
        />
        <TextField
          label="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          textContentType="password"
          returnKeyType="go"
          onSubmitEditing={() => void handleLogin()}
          editable={!loading}
        />
        <Button
          label="Acessar"
          onPress={handleLogin}
          loading={loading}
          disabled={!email.trim() || !password}
          icon={<LogIn size={18} color={theme.white} />}
        />
      </View>
    </Screen>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
  return StyleSheet.create({
    container: {
      flexGrow: 1,
      justifyContent: 'center',
      gap: spacing.xl,
      paddingVertical: spacing.xxl
    },
    brandArea: {
      alignItems: 'center',
      gap: spacing.sm
    },
    logoMark: {
      width: 64,
      height: 64,
      borderRadius: radius.md,
      backgroundColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'center'
    },
    brandName: {
      color: theme.text,
      fontSize: 30,
      fontWeight: '900'
    },
    brandMeta: {
      color: theme.muted,
      fontSize: 13,
      fontWeight: '800'
    },
    formPanel: {
      gap: spacing.lg,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.surface,
      padding: spacing.xl
    },
    formHeader: {
      gap: spacing.xs
    },
    formTitle: {
      color: theme.text,
      fontSize: 24,
      fontWeight: '900'
    },
    formSubtitle: {
      color: theme.muted,
      fontSize: 14,
      fontWeight: '600'
    }
  });
}