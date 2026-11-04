import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { CustomButton } from '../../components/CustomButton';
import { PaymentMethod } from '../../types';

export const AddPaymentScreen = ({ navigation }: { navigation: any }) => {
  const { strings, customers, addPayment } = useApp();
  const [selectedCustomerId, setSelectedCustomerId] = useState(
    customers.length > 0 ? customers[0].id : ''
  );
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');

  const handleSave = () => {
    const numericAmount = parseFloat(amount);
    if (!numericAmount || numericAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount.');
      return;
    }

    const customer = customers.find((c) => c.id === selectedCustomerId);
    if (!customer) {
      Alert.alert('Error', 'Please select a customer.');
      return;
    }

    addPayment({
      customerId: customer.id,
      customerName: customer.name,
      amount: numericAmount,
      paymentMethod,
    });

    Alert.alert('Payment Recorded', `Rs. ${numericAmount.toLocaleString()} received from ${customer.name}`, [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  const methods: { id: PaymentMethod; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { id: 'Cash', label: 'Cash', icon: 'cash-outline' },
    { id: 'Easypaisa', label: 'Easypaisa', icon: 'wallet-outline' },
    { id: 'JazzCash', label: 'JazzCash', icon: 'card-outline' },
    { id: 'Bank', label: 'Bank', icon: 'business-outline' },
  ];

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Payment</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Customer Select */}
        <Text style={styles.sectionLabel}>{strings.selectCustomer}</Text>
        <View style={styles.customerChipsRow}>
          {customers.map((c) => {
            const isSelected = c.id === selectedCustomerId;
            return (
              <TouchableOpacity
                key={c.id}
                onPress={() => setSelectedCustomerId(c.id)}
                style={[
                  styles.customerChip,
                  isSelected && styles.customerChipSelected,
                ]}
              >
                <Text
                  style={[
                    styles.customerChipText,
                    isSelected && styles.customerChipTextSelected,
                  ]}
                >
                  {c.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {selectedCustomer && (
          <View style={styles.dueNoticeBox}>
            <Text style={styles.dueNoticeText}>
              Current Outstanding Balance: <Text style={styles.dueBold}>Rs. {selectedCustomer.totalDue.toLocaleString()}</Text>
            </Text>
          </View>
        )}

        {/* Amount Input */}
        <Text style={styles.sectionLabel}>{strings.amount}</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.currencyPrefix}>Rs.</Text>
          <TextInput
            style={styles.amountInput}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Payment Method Selector */}
        <Text style={styles.sectionLabel}>{strings.paymentMethod}</Text>
        <View style={styles.methodsGrid}>
          {methods.map((m) => {
            const isSelected = paymentMethod === m.id;
            return (
              <TouchableOpacity
                key={m.id}
                onPress={() => setPaymentMethod(m.id)}
                style={[
                  styles.methodCard,
                  isSelected && styles.methodCardSelected,
                ]}
              >
                <Ionicons
                  name={m.icon}
                  size={24}
                  color={isSelected ? THEME.colors.primary : '#6B7280'}
                />
                <Text
                  style={[
                    styles.methodLabel,
                    isSelected && styles.methodLabelSelected,
                  ]}
                >
                  {m.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.footer}>
        <CustomButton title={strings.savePayment} onPress={handleSave} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  scrollContent: {
    padding: 20,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  customerChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  customerChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 8,
    marginBottom: 8,
  },
  customerChipSelected: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  customerChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  customerChipTextSelected: {
    color: '#FFFFFF',
  },
  dueNoticeBox: {
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  dueNoticeText: {
    fontSize: 13,
    color: '#92400E',
  },
  dueBold: {
    fontWeight: '700',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: THEME.metrics.cardRadius,
    height: 54,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    marginBottom: 24,
  },
  currencyPrefix: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.colors.primary,
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  methodsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  methodCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: THEME.metrics.cardRadius,
    paddingVertical: 14,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  methodCardSelected: {
    borderColor: THEME.colors.primary,
    backgroundColor: THEME.colors.primaryLight,
  },
  methodLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
    marginTop: 6,
  },
  methodLabelSelected: {
    color: THEME.colors.primary,
    fontWeight: '700',
  },
  footer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
});
