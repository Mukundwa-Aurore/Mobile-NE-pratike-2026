import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { APP_NAME } from '@/constants/app';
import { ROUTES } from '@/constants/routes';
import { LexiconColors, LexiconRadius, LexiconSpacing } from '@/constants/lexicon-theme';
import { useResponsive } from '@/hooks/useResponsive';
import {
  validateEmail,
  validateFullName,
  validatePassword,
} from '@/utils/validation';

export default function CreateAccountScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { contentMaxWidth, horizontalPadding } = useResponsive();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    const nameResult = validateFullName(fullName);
    const emailResult = validateEmail(email);
    const passwordResult = validatePassword(password);
    const nextErrors: Record<string, string> = {};

    if (!nameResult.valid) nextErrors.name = nameResult.message;
    if (!emailResult.valid) nextErrors.email = emailResult.message;
    if (!passwordResult.valid) nextErrors.password = passwordResult.message;
    if (!acceptedTerms) nextErrors.terms = 'You must accept the Terms of Service and Privacy Policy.';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      router.replace(ROUTES.search);
    }, 800);
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.topBar}>
          <MaterialIcons name="auto-stories" size={22} color={LexiconColors.primary} />
          <Text style={styles.brand}>{APP_NAME}</Text>
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            {
              paddingHorizontal: horizontalPadding,
              paddingBottom: insets.bottom + 24,
              maxWidth: contentMaxWidth,
              alignSelf: 'center',
              width: '100%',
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.springify()} style={styles.header}>
            <Text style={styles.title}>Create your scholar account.</Text>
            <Text style={styles.subtitle}>Unlock the full power of linguistic mastery.</Text>
          </Animated.View>

          <View style={styles.socialRow}>
            <Pressable style={styles.socialButton}>
              <MaterialIcons name="g-translate" size={20} color={LexiconColors.onSurface} />
              <Text style={styles.socialLabel}>Google</Text>
            </Pressable>
            <Pressable style={styles.socialButton}>
              <MaterialIcons name="phone-iphone" size={20} color={LexiconColors.onSurface} />
              <Text style={styles.socialLabel}>Apple</Text>
            </Pressable>
          </View>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR CONTINUE WITH EMAIL</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Full Name</Text>
            <View style={[styles.inputWrap, errors.name && styles.inputError]}>
              <MaterialIcons name="person-outline" size={20} color={LexiconColors.outline} />
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter your full name"
                placeholderTextColor={LexiconColors.outline}
                style={styles.input}
              />
            </View>
            {errors.name ? <Text style={styles.fieldError}>{errors.name}</Text> : null}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Email Address</Text>
            <View style={[styles.inputWrap, errors.email && styles.inputError]}>
              <MaterialIcons name="mail-outline" size={20} color={LexiconColors.outline} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="scholar@lexitech.edu"
                placeholderTextColor={LexiconColors.outline}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
            </View>
            {errors.email ? <Text style={styles.fieldError}>{errors.email}</Text> : null}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <View style={[styles.inputWrap, errors.password && styles.inputError]}>
              <MaterialIcons name="lock-outline" size={20} color={LexiconColors.outline} />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={LexiconColors.outline}
                secureTextEntry={!showPassword}
                style={styles.input}
              />
              <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={8}>
                <MaterialIcons
                  name={showPassword ? 'visibility-off' : 'visibility'}
                  size={20}
                  color={LexiconColors.outline}
                />
              </Pressable>
            </View>
            {errors.password ? <Text style={styles.fieldError}>{errors.password}</Text> : null}
          </View>

          <Pressable
            style={styles.termsRow}
            onPress={() => setAcceptedTerms((v) => !v)}>
            <MaterialIcons
              name={acceptedTerms ? 'check-box' : 'check-box-outline-blank'}
              size={22}
              color={acceptedTerms ? LexiconColors.primary : LexiconColors.outline}
            />
            <Text style={styles.termsText}>
              I agree to the <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>.
            </Text>
          </Pressable>
          {errors.terms ? <Text style={styles.fieldError}>{errors.terms}</Text> : null}

          <PrimaryButton
            label={submitting ? 'Creating...' : 'Create Account'}
            onPress={handleSubmit}
            disabled={submitting}
            style={{ marginTop: LexiconSpacing.stackLg }}
          />

          <Pressable style={styles.loginRow} onPress={() => router.push(ROUTES.welcome)}>
            <Text style={styles.loginText}>
              Already have an account? <Text style={styles.loginLink}>Log in</Text>
            </Text>
          </Pressable>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: LexiconColors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 56,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: LexiconColors.surfaceContainerHigh,
  },
  brand: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: LexiconColors.primary,
  },
  scroll: {
    paddingTop: LexiconSpacing.stackLg,
    gap: LexiconSpacing.stackMd,
  },
  header: {
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
    fontFamily: 'Inter_700Bold',
    color: LexiconColors.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: LexiconColors.onSurfaceVariant,
    textAlign: 'center',
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: LexiconColors.outlineVariant,
    borderRadius: LexiconRadius.lg,
    backgroundColor: LexiconColors.surfaceContainerLowest,
  },
  socialLabel: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: LexiconColors.onSurface,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: LexiconColors.outlineVariant,
  },
  dividerText: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    color: LexiconColors.onSurfaceVariant,
    letterSpacing: 0.5,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: LexiconColors.onSurfaceVariant,
    marginLeft: 4,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: LexiconColors.surfaceContainer,
    borderRadius: LexiconRadius.lg,
    paddingHorizontal: 14,
    paddingVertical: 4,
    minHeight: 52,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: LexiconColors.error,
    backgroundColor: LexiconColors.errorContainer,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: LexiconColors.onSurface,
    paddingVertical: 12,
  },
  fieldError: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: LexiconColors.error,
    marginLeft: 4,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 4,
  },
  termsText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: 'Inter_400Regular',
    color: LexiconColors.onSurfaceVariant,
  },
  termsLink: {
    fontFamily: 'Inter_600SemiBold',
    color: LexiconColors.secondary,
  },
  loginRow: {
    alignItems: 'center',
    paddingTop: 8,
  },
  loginText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: LexiconColors.onSurfaceVariant,
  },
  loginLink: {
    fontFamily: 'Inter_700Bold',
    color: LexiconColors.primary,
  },
});
