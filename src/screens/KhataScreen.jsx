import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { AppHeader } from '../components/AppHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import { EmptyState } from '../components/EmptyState';
import { useApp } from '../context/AppContext';

export const KhataScreen = ({ navigation }) => {
  const { strings, payments, totalReceivedAmount, totalDueAmount } = useApp();

  const renderPaymentItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Ionicons name="person" size={18} color={colors.primary} />
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
      <AppHeader title={strings.khataTitle} />

      <View style={styles.content}>
        {/* Top 2 Cards: Received vs Due */}
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

        <FlatList
          data={payments}
          keyExtractor={(item) => item.id}
          renderItem={renderPaymentItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <EmptyState
              icon="wallet-outline"
              title="No Payments Recorded"
              message="Receive payments from customers to track khata."
              actionTitle="+ Add Payment"
              onAction={() => navigation.navigate('AddPayment')}
            />
          }
        />
      </View>

      <View style={styles.footer}>
        <PrimaryButton
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
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  summaryCard: {
    flex: 1,
    borderRadius: spacing.cardRadius,
    padding: spacing.lg,
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
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  viewAllText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: spacing.cardRadius,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  details: {
    flex: 1,
  },
  custName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  paySub: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  dateText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  footer: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
});
