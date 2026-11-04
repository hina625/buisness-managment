import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../constants/theme';
import { CustomButton } from '../../components/CustomButton';
import { useApp } from '../../context/AppContext';

export const LoginScreen = ({ navigation }: { navigation: any }) => {
  const { strings, loginUser, businessProfile } = useApp();
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!phone.trim()) {
      Alert.alert('Required', 'Please enter your mobile number.');
      return;
    }
    setLoading(true);
    const result = await loginUser(phone, pin);
    setLoading(false);

    if (result.success) {
      // Direct dashboard open on successful login
      navigation.replace('MainTabs');
    } else {
      // Show error if user is not registered in PostgreSQL
      Alert.alert(
        'Account Not Found',
        result.message || 'User not registered. Please create an account first.',
        [
          { text: 'Create Account', onPress: () => navigation.navigate('Signup') },
          { text: 'Try Again' },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerArea}>
          <View style={styles.logoBadge}>
            <Ionicons name="trending-up" size={36} color="#FFFFFF" />
          </View>
          <Text style={styles.title}>{strings.welcomeBack}</Text>
          <Text style={styles.subtitle}>{strings.loginContinue}</Text>
        </View>

        <View style={styles.formArea}>
          <Text style={styles.inputLabel}>Mobile Number</Text>
          <View style={styles.phoneInputRow}>
            <View style={styles.countryCodeBadge}>
              <Text style={styles.flag}>🇵🇰</Text>
              <Text style={styles.countryCode}>+92</Text>
            </View>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder={strings.phonePlaceholder}
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
            />
          </View>

          <Text style={styles.inputLabel}>{strings.password}</Text>
          <View style={styles.pinInputRow}>
            <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={{ marginRight: 10 }} />
            <TextInput
              style={styles.input}
              value={pin}
              onChangeText={setPin}
              placeholder="Enter PIN (Default: 1234)"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              keyboardType="numeric"
              maxLength={6}
            />
          </View>

          <CustomButton
            title={strings.login}
            loading={loading}
            onPress={handleLogin}
            style={styles.loginBtn}
          />

          {/* Link to Signup Screen */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Signup')}
            style={styles.signupLinkBox}
          >
            <Text style={styles.signupLinkText}>
              {strings.dontHaveAccount}
            </Text>
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.line} />
            <Text style={styles.orText}>Or</Text>
            <View style={styles.line} />
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleLogin}
            style={styles.googleBtn}
          >
            <Ionicons name="logo-google" size={20} color="#EA4335" />
            <Text style={styles.googleBtnText}>{strings.continueWithGoogle}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.termsText}>
          By continuing, you agree to our Terms of Service & Privacy Policy
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerArea: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoBadge: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: THEME.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  formArea: {
    width: '100%',
    marginVertical: 10,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  phoneInputRow: {
    flexDirection: 'row',
    height: 52,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: THEME.metrics.cardRadius,
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  countryCodeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    paddingRight: 10,
    marginRight: 10,
  },
  flag: {
    fontSize: 18,
    marginRight: 4,
  },
  countryCode: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  pinInputRow: {
    flexDirection: 'row',
    height: 52,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: THEME.metrics.cardRadius,
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 18,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },
  loginBtn: {
    marginBottom: 14,
  },
  signupLinkBox: {
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 6,
  },
  signupLinkText: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.primary,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  orText: {
    marginHorizontal: 16,
    color: '#9CA3AF',
    fontSize: 13,
    fontWeight: '500',
  },
  googleBtn: {
    height: 52,
    borderRadius: THEME.metrics.cardRadius,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 10,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  termsText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 18,
  },
});
