import { Boxes, LockKeyhole, LogIn, ShieldCheck, Smartphone } from 'lucide-react-native';
import type { ReactNode } from 'react';
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
      <View style={styles.hero}>
        <View style={styles.brandRow}>
          <View style={styles.logoMark}>
            <Boxes size={28} color={colors.white} />
          </View>
          <View>
            <Text style={styles.brandName}>StockFlow</Text>
            <Text style={styles.brandMeta}>Mobile Zentry</Text>
          </View>
        </View>

        <View style={styles.heroCopy}>
          <Text style={styles.headline}>Estoque sob controle</Text>
          <Text style={styles.subtitle}>Acesso rapido para administrar produtos, equipe e movimentacoes.</Text>
        </View>

        <View style={styles.metricsRow}>
          <Metric icon={<Smartphone size={18} color={colors.primary} />} label="Mobile" />
          <Metric icon={<ShieldCheck size={18} color={colors.primary} />} label="ADMIN" />
          <Metric icon={<LockKeyhole size={18} color={colors.primary} />} label="Seguro" />
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
        />
        <TextField
          label="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Button
          label="Acessar painel"
          onPress={handleLogin}
          loading={loading}
          icon={<LogIn size={18} color={colors.white} />}
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
  return (
    <View style={styles.metric}>
      {icon}
      <Text style={styles.metricText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    gap: spacing.xl,
    paddingVertical: spacing.xl
  },
  hero: {
    gap: spacing.xl,
    borderRadius: radius.md,
    padding: spacing.xl,
    backgroundColor: colors.black,
    borderWidth: 1,
    borderColor: '#223241'
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
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  brandName: {
    color: colors.white,
    fontSize: 23,
    fontWeight: '900'
  },
  brandMeta: {
    color: '#AAB7C4',
    fontSize: 13,
    fontWeight: '700'
  },
  heroCopy: {
    gap: spacing.sm
  },
  headline: {
    color: colors.white,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '900'
  },
  subtitle: {
    color: '#C8D2DC',
    fontSize: 15,
    lineHeight: 22
  },
  metricsRow: {
    flexDirection: 'row',
    gap: spacing.sm
  },
  metric: {
    flex: 1,
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    borderRadius: radius.md,
    backgroundColor: colors.white
  },
  metricText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '800'
  },
  formPanel: {
    gap: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.xl
  },
  formHeader: {
    gap: spacing.xs
  },
  formTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '900'
  },
  formSubtitle: {
    color: colors.muted,
    fontSize: 14
  }
});