import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../constants/theme';
import { CustomButton } from '../../components/CustomButton';
import { useApp } from '../../context/AppContext';

export const SignupScreen = ({ navigation }: { navigation: any }) => {
  const { strings, signupUser } = useApp();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!fullName.trim()) {
      Alert.alert('Required', 'Please enter your Full Name.');
      return;
    }
    if (!phone.trim()) {
      Alert.alert('Required', 'Please enter your Mobile Number.');
      return;
    }

    setLoading(true);
    const result = await signupUser(fullName.trim(), phone.trim(), pin.trim() || '1234');
    setLoading(false);

    if (result.success) {
      // Navigate to business connection/setup step!
      navigation.navigate('BusinessSetup');
    } else {
      Alert.alert('Registration Failed', result.message || 'Could not register account in PostgreSQL.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerArea}>
          <View style={styles.logoBadge}>
            <Ionicons name="person-add" size={32} color="#FFFFFF" />
          </View>
          <Text style={styles.title}>{strings.createAccount}</Text>
          <Text style={styles.subtitle}>{strings.signupSub}</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formArea}>
          {/* Full Name */}
          <Text style={styles.inputLabel}>{strings.fullName}</Text>
          <View style={styles.inputRow}>
            <Ionicons name="person-outline" size={20} color="#9CA3AF" style={{ marginRight: 10 }} />
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder={strings.fullNamePlaceholder}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Mobile Number */}
          <Text style={styles.inputLabel}>Mobile Number</Text>
          <View style={styles.inputRow}>
            <View style={styles.countryBadge}>
              <Text style={{ fontSize: 18, marginRight: 4 }}>🇵🇰</Text>
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

          {/* Security PIN */}
          <Text style={styles.inputLabel}>{strings.password}</Text>
          <View style={styles.inputRow}>
            <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={{ marginRight: 10 }} />
            <TextInput
              style={styles.input}
              value={pin}
              onChangeText={setPin}
              placeholder={strings.passwordPlaceholder}
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              keyboardType="numeric"
              maxLength={6}
            />
          </View>

          {/* Signup Button */}
          <CustomButton
            title={strings.createAccount}
            loading={loading}
            onPress={handleSignup}
            style={styles.submitBtn}
          />

          {/* Link to Login */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Login')}
            style={styles.switchRow}
          >
            <Text style={styles.switchText}>
              {strings.alreadyHaveAccount}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 30,
    justifyContent: 'space-between',
  },
  headerArea: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: THEME.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  formArea: {
    width: '100%',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    height: 52,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: THEME.metrics.cardRadius,
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 18,
  },
  countryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    paddingRight: 10,
    marginRight: 10,
  },
  countryCode: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },
  submitBtn: {
    marginTop: 8,
    marginBottom: 16,
  },
  switchRow: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  switchText: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.primary,
  },
});
