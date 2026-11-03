import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../constants/theme';
import { CustomButton } from '../../components/CustomButton';
import { useApp } from '../../context/AppContext';

export const LoginScreen = ({ navigation }: { navigation: any }) => {
  const { strings } = useApp();
  const [phone, setPhone] = useState('0300 1234567');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.replace('MainTabs');
    }, 800);
  };

  return (
    <View style={styles.container}>
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

        <CustomButton
          title={strings.sendOtp}
          loading={loading}
          onPress={handleLogin}
          style={styles.loginBtn}
        />

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
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  headerArea: {
    alignItems: 'center',
  },
  logoBadge: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: THEME.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  formArea: {
    width: '100%',
    marginVertical: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  phoneInputRow: {
    flexDirection: 'row',
    height: 54,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: THEME.metrics.cardRadius,
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  countryCodeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    paddingRight: 12,
    marginRight: 12,
  },
  flag: {
    fontSize: 18,
    marginRight: 6,
  },
  countryCode: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  loginBtn: {
    marginBottom: 20,
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
  },
  termsText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 18,
  },
});
