import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ThemedText } from '@/components/themed-text';
import { Palette, Radius, Spacing, Typography } from '@/constants/theme';
import { signIn, resetPassword } from '@/lib/auth/auth.service';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Enter your password'),
});

type FormValues = z.infer<typeof schema>;

export default function SignInScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, getValues, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      await signIn(values.email, values.password);
    } catch (e) {
      Alert.alert('Sign in failed', e instanceof Error ? e.message : 'Check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const email = getValues('email');
    if (!email) {
      Alert.alert('Enter your email first', 'Type your email address above, then tap Forgot password.');
      return;
    }
    try {
      await resetPassword(email);
      Alert.alert('Check your inbox', `A password reset link was sent to ${email}.`);
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Could not send reset email.');
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity onPress={() => router.back()} style={styles.back} accessibilityLabel="Go back">
            <ThemedText style={styles.backText}>← Back</ThemedText>
          </TouchableOpacity>

          <View style={styles.header}>
            <ThemedText style={styles.title}>Welcome back</ThemedText>
            <ThemedText style={styles.subtitle}>Sign in to continue your streak</ThemedText>
          </View>

          <View style={styles.form}>
            <View style={styles.field}>
              <ThemedText style={styles.label}>Email</ThemedText>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, errors.email && styles.inputError]}
                    placeholder="you@example.com"
                    placeholderTextColor={Palette.inkTertiary}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoCorrect={false}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    accessibilityLabel="Email address"
                  />
                )}
              />
              {errors.email && <ThemedText style={styles.errorText}>{errors.email.message}</ThemedText>}
            </View>

            <View style={styles.field}>
              <View style={styles.labelRow}>
                <ThemedText style={styles.label}>Password</ThemedText>
                <TouchableOpacity onPress={handleForgotPassword}>
                  <ThemedText style={styles.forgotLink}>Forgot password?</ThemedText>
                </TouchableOpacity>
              </View>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, errors.password && styles.inputError]}
                    placeholder="Your password"
                    placeholderTextColor={Palette.inkTertiary}
                    secureTextEntry
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    accessibilityLabel="Password"
                  />
                )}
              />
              {errors.password && <ThemedText style={styles.errorText}>{errors.password.message}</ThemedText>}
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSubmit(onSubmit)}
              disabled={loading}
              accessibilityRole="button"
              accessibilityLabel={loading ? 'Signing in' : 'Sign in'}
            >
              <ThemedText style={styles.buttonText}>
                {loading ? 'Signing in…' : 'Sign In'}
              </ThemedText>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <ThemedText style={styles.footerText}>Don't have an account? </ThemedText>
            <TouchableOpacity onPress={() => router.replace('/(auth)/sign-up' as any)}>
              <ThemedText style={styles.footerLink}>Sign up</ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Palette.background },
  flex: { flex: 1 },
  content: { padding: Spacing.xl, paddingBottom: Spacing.huge },
  back: { marginBottom: Spacing.xl },
  backText: { fontSize: Typography.base, color: Palette.accent, fontWeight: Typography.medium },
  header: { marginBottom: Spacing.xxl, gap: Spacing.xs },
  title: { fontSize: Typography.xxl, fontWeight: Typography.bold, color: Palette.inkPrimary, letterSpacing: -0.5 },
  subtitle: { fontSize: Typography.base, color: Palette.inkSecondary },
  form: { gap: Spacing.lg },
  field: { gap: Spacing.xs },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: Typography.sm, fontWeight: Typography.semibold, color: Palette.inkSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  forgotLink: { fontSize: Typography.sm, color: Palette.accent, fontWeight: Typography.medium },
  input: {
    backgroundColor: Palette.surface,
    borderWidth: 1.5,
    borderColor: Palette.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    fontSize: Typography.base,
    color: Palette.inkPrimary,
    minHeight: 50,
  },
  inputError: { borderColor: Palette.danger },
  errorText: { fontSize: Typography.xs, color: Palette.danger },
  button: {
    backgroundColor: Palette.accent,
    borderRadius: Radius.xl,
    paddingVertical: Spacing.base,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
    marginTop: Spacing.sm,
  },
  buttonDisabled: { backgroundColor: Palette.inkDisabled },
  buttonText: { color: Palette.white, fontSize: Typography.base, fontWeight: Typography.bold },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.xxl },
  footerText: { fontSize: Typography.base, color: Palette.inkSecondary },
  footerLink: { fontSize: Typography.base, color: Palette.accent, fontWeight: Typography.semibold },
});
