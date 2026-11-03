import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { CustomButton } from '../../components/CustomButton';
import { Payment } from '../../types';

export const KhataScreen = ({ navigation }: { navigation: any }) => {
  const { strings, payments, totalReceivedAmount, totalDueAmount } = useApp();

  const renderPaymentItem = ({ item }: { item: Payment }) => (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Ionicons name="person" size={18} color={THEME.colors.primary} />
      </View>

      <View style={styles.details}>
        <Text style={styles.custName}>{item.customerName}</Text>
        <Text style={styles.paySub}>
          Rs. {item.amount.toLocaleString()} • {item.paymentMethod}
        </Text>
      </View>

      <Text style={styles.dateText}>{item.date}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Top 2 Cards: Total Received vs Total Due */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, styles.receivedCard]}>
            <Text style={styles.receivedLabel}>{strings.totalReceived}</Text>
            <Text style={styles.receivedValue}>
              Rs. {totalReceivedAmount.toLocaleString()}
            </Text>
          </View>

          <View style={[styles.summaryCard, styles.dueCard]}>
            <Text style={styles.dueLabel}>{strings.totalDueLabel}</Text>
            <Text style={styles.dueValue}>
              Rs. {totalDueAmount.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{strings.recentPayments}</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>{strings.viewAll} &gt;</Text>
          </TouchableOpacity>
        </View>

        {/* Payments list */}
        <FlatList
          data={payments}
          keyExtractor={(item) => item.id}
          renderItem={renderPaymentItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>

      {/* Add Payment Button */}
      <View style={styles.footer}>
        <CustomButton
          title={strings.addPayment}
          onPress={() => navigation.navigate('AddPayment')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    paddingTop: 54,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    borderRadius: THEME.metrics.cardRadius,
    padding: 16,
    marginHorizontal: 4,
    elevation: 2,
  },
  receivedCard: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  dueCard: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  receivedLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#065F46',
    marginBottom: 6,
  },
  receivedValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#059669',
  },
  dueLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#991B1B',
    marginBottom: 6,
  },
  dueValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#DC2626',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  viewAllText: {
    fontSize: 13,
    color: THEME.colors.primary,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: THEME.metrics.cardRadius,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  custName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  paySub: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  dateText: {
    fontSize: 12,
    color: THEME.colors.textMuted,
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
});
