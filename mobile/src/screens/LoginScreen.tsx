import { Boxes, LockKeyhole, LogIn, ShieldCheck, Smartphone } from 'lucide-react-native';
import type { ReactNode } from 'react';
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
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme, isDark), [theme, isDark]);
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
      <View style={styles.brandRow}>
        <View style={styles.logoMark}>
          <Boxes size={30} color={theme.white} />
        </View>
        <View style={styles.brandTextGroup}>
          <Text style={styles.brandName}>StockFlow</Text>
          <Text style={styles.brandMeta}>Mobile Zentry</Text>
        </View>
      </View>

      <View style={styles.heroPanel}>
        <Text style={styles.headline}>Controle de estoque direto do celular</Text>
        <Text style={styles.subtitle}>
          Consulte produtos, registre movimentacoes e gerencie acessos em uma experiencia mobile mais clara.
        </Text>

        <View style={styles.metricsRow}>
          <Metric icon={<Smartphone size={18} color={theme.primary} />} label="Mobile" />
          <Metric icon={<ShieldCheck size={18} color={theme.primary} />} label="ADMIN" />
          <Metric icon={<LockKeyhole size={18} color={theme.primary} />} label="Seguro" />
        </View>
      </View>

      <View style={styles.formPanel}>
        <View style={styles.formHeader}>
          <Text style={styles.formTitle}>Entrar</Text>
          <Text style={styles.formSubtitle}>Use sua conta cadastrada</Text>
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
          label="Acessar painel"
          onPress={handleLogin}
          loading={loading}
          disabled={!email.trim() || !password}
          icon={<LogIn size={18} color={theme.white} />}
        />
      </View>
    </Screen>
  );
}

interface MetricProps {
  icon: ReactNode;
  label: string;
}

function Metric({ icon, label }: MetricProps) {
  const { theme } = useTheme();
  const styles = useMemo(() => createMetricStyles(theme), [theme]);

  return (
    <View style={styles.metric}>
      {icon}
      <Text style={styles.metricText}>{label}</Text>
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme'], isDark: boolean) {
  return StyleSheet.create({
    container: {
      flexGrow: 1,
      justifyContent: 'center',
      gap: spacing.xl,
      paddingVertical: spacing.xl
    },
    brandRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md
    },
    logoMark: {
      width: 58,
      height: 58,
      borderRadius: radius.md,
      backgroundColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'center'
    },
    brandTextGroup: {
      flex: 1
    },
    brandName: {
      color: theme.text,
      fontSize: 26,
      fontWeight: '900'
    },
    brandMeta: {
      color: theme.muted,
      fontSize: 13,
      fontWeight: '800'
    },
    heroPanel: {
      gap: spacing.lg,
      borderRadius: radius.md,
      padding: spacing.xl,
      backgroundColor: isDark ? theme.surface : theme.primaryDark,
      borderWidth: 1,
      borderColor: isDark ? theme.border : theme.primaryDark
    },
    headline: {
      color: theme.white,
      fontSize: 31,
      lineHeight: 38,
      fontWeight: '900'
    },
    subtitle: {
      color: isDark ? theme.muted : '#DDE8E4',
      fontSize: 15,
      lineHeight: 22,
      fontWeight: '600'
    },
    metricsRow: {
      flexDirection: 'row',
      gap: spacing.sm
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

function createMetricStyles(theme: ReturnType<typeof useTheme>['theme']) {
  return StyleSheet.create({
    metric: {
      flex: 1,
      minHeight: 48,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
      borderRadius: radius.md,
      backgroundColor: theme.surface
    },
    metricText: {
      color: theme.text,
      fontSize: 12,
      fontWeight: '900'
    }
  });
}
