import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { Customer } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';
import { CustomButton } from '../../components/CustomButton';
import { sendWhatsAppReminder } from '../../utils/whatsappReminder';

export const CustomerProfileScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  const { customer }: { customer: Customer } = route.params;
  const { orders, payments, customers, strings, businessProfile, language } = useApp();
  const [activeTab, setActiveTab] = useState<'Orders' | 'Payments'>('Orders');

  const liveCustomer = customers.find((c) => c.id === customer.id) || customer;
  const customerOrders = orders.filter((o) => o.customerId === customer.id);
  const customerPayments = payments.filter((p) => p.customerId === customer.id);

  const handleSendReminder = () => {
    sendWhatsAppReminder(liveCustomer, businessProfile, language);
  };

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
        <Text style={styles.headerTitle}>{strings.customerProfile}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileBox}>
          <View style={styles.avatarLarge}>
            <Ionicons name="person" size={36} color={THEME.colors.primary} />
          </View>
          <Text style={styles.profileName}>{liveCustomer.name}</Text>
          <View style={styles.phoneRow}>
            <Ionicons name="call-outline" size={14} color="#6B7280" />
            <Text style={styles.profilePhone}>{liveCustomer.phone}</Text>
          </View>
        </View>

        {/* Big Total Due Card */}
        <View style={styles.totalDueCard}>
          <View style={styles.dueLeft}>
            <Text style={styles.dueTitle}>Total Due (Udhaar)</Text>
            <Text style={styles.dueNumber}>Rs. {liveCustomer.totalDue.toLocaleString()}</Text>
          </View>

          {liveCustomer.totalDue > 0 && (
            <CustomButton
              title="Remind"
              icon={<Ionicons name="logo-whatsapp" size={18} color="#FFFFFF" />}
              onPress={handleSendReminder}
              style={styles.remindBtn}
            />
          )}
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'Orders' && styles.activeTabItem]}
            onPress={() => setActiveTab('Orders')}
          >
            <Text style={[styles.tabText, activeTab === 'Orders' && styles.activeTabText]}>
              {strings.orders} ({customerOrders.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'Payments' && styles.activeTabItem]}
            onPress={() => setActiveTab('Payments')}
          >
            <Text style={[styles.tabText, activeTab === 'Payments' && styles.activeTabText]}>
              {strings.paymentsTab} ({customerPayments.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === 'Orders' ? (
          customerOrders.length > 0 ? (
            customerOrders.map((ord) => (
              <TouchableOpacity
                key={ord.id}
                onPress={() => navigation.navigate('OrderDetail', { order: ord })}
                style={styles.historyCard}
              >
                <View>
                  <Text style={styles.ordNum}>{ord.orderNumber}</Text>
                  <Text style={styles.ordDate}>{ord.date}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.ordPrice}>Rs. {ord.totalAmount.toLocaleString()}</Text>
                  <StatusBadge status={ord.status} />
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyNotice}>No orders found for this customer.</Text>
          )
        ) : customerPayments.length > 0 ? (
          customerPayments.map((pay) => (
            <View key={pay.id} style={styles.historyCard}>
              <View>
                <Text style={styles.ordNum}>{pay.paymentMethod}</Text>
                <Text style={styles.ordDate}>{pay.date}</Text>
              </View>
              <Text style={[styles.ordPrice, { color: '#059669' }]}>
                + Rs. {pay.amount.toLocaleString()}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyNotice}>No payments recorded yet.</Text>
        )}
      </ScrollView>

      {/* Bottom Button to record payment for this customer */}
      <View style={styles.footer}>
        <CustomButton
          title="+ Add Payment"
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
  profileBox: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: THEME.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  profilePhone: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  totalDueCard: {
    backgroundColor: '#D1FAE5',
    borderRadius: THEME.metrics.cardRadius,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  dueLeft: {
    flex: 1,
  },
  dueTitle: {
    fontSize: 13,
    color: '#065F46',
    fontWeight: '600',
    marginBottom: 4,
  },
  dueNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#065F46',
  },
  remindBtn: {
    height: 44,
    paddingHorizontal: 16,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTabItem: {
    backgroundColor: THEME.colors.primaryLight,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: THEME.colors.primary,
    fontWeight: '700',
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: THEME.metrics.cardRadius,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  ordNum: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  ordDate: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  ordPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  emptyNotice: {
    textAlign: 'center',
    color: '#9CA3AF',
    marginTop: 24,
    fontSize: 14,
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
});
