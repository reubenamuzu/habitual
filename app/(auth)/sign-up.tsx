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
import { signUp } from '@/lib/auth/auth.service';

const schema = z.object({
  username: z
    .string()
    .min(3, 'At least 3 characters')
    .max(20, 'Max 20 characters')
    .regex(/^[a-z0-9_]+$/, 'Lowercase letters, numbers, and underscores only'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'At least 8 characters'),
});

type FormValues = z.infer<typeof schema>;

export default function SignUpScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      await signUp(values.email, values.password, values.username);
      // AuthGuard will redirect to app once session is set
    } catch (e) {
      Alert.alert('Sign up failed', e instanceof Error ? e.message : 'Please try again.');
    } finally {
      setLoading(false);
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
          {/* Back */}
          <TouchableOpacity onPress={() => router.back()} style={styles.back} accessibilityLabel="Go back">
            <ThemedText style={styles.backText}>← Back</ThemedText>
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <ThemedText style={styles.title}>Create account</ThemedText>
            <ThemedText style={styles.subtitle}>Start building better habits today</ThemedText>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Field label="Username" error={errors.username?.message}>
              <Controller
                control={control}
                name="username"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, errors.username && styles.inputError]}
                    placeholder="e.g. jane_builds"
                    placeholderTextColor={Palette.inkTertiary}
                    autoCapitalize="none"
                    autoCorrect={false}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    accessibilityLabel="Username"
                  />
                )}
              />
            </Field>

            <Field label="Email" error={errors.email?.message}>
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
            </Field>

            <Field label="Password" error={errors.password?.message}>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, errors.password && styles.inputError]}
                    placeholder="At least 8 characters"
                    placeholderTextColor={Palette.inkTertiary}
                    secureTextEntry
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    accessibilityLabel="Password"
                  />
                )}
              />
            </Field>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSubmit(onSubmit)}
              disabled={loading}
              accessibilityRole="button"
              accessibilityLabel={loading ? 'Creating account' : 'Create account'}
            >
              <ThemedText style={styles.buttonText}>
                {loading ? 'Creating account…' : 'Create Account'}
              </ThemedText>
            </TouchableOpacity>
          </View>

          {/* Sign in link */}
          <View style={styles.footer}>
            <ThemedText style={styles.footerText}>Already have an account? </ThemedText>
            <TouchableOpacity onPress={() => router.replace('/(auth)/sign-in' as any)}>
              <ThemedText style={styles.footerLink}>Sign in</ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <View style={styles.field}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      {children}
      {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}
    </View>
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
  label: { fontSize: Typography.sm, fontWeight: Typography.semibold, color: Palette.inkSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
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
