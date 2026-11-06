import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { StatCard } from '../components/StatCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { OrderCard } from '../components/OrderCard';
import { AddExpenseModal } from '../components/AddExpenseModal';
import { useApp } from '../context/AppContext';
import { sendWhatsAppReceipt } from '../utils/whatsappReceipt';

export const DashboardScreen = ({ navigation }) => {
  const {
    strings,
    businessProfile,
    todaySales,
    todayExpenses,
    netProfit,
    totalSales,
    totalExpenses,
    totalNetProfit,
    totalOrdersCount,
    pendingOrdersCount,
    totalDueAmount,
    orders,
    isOnline,
    pendingSyncCount,
    syncOfflineData,
    refreshData,
    addExpense,
  } = useApp();

  const [expenseModalVisible, setExpenseModalVisible] = useState(false);
  const [profitTimeframe, setProfitTimeframe] = useState('today'); // 'today' | 'all'
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshData();
    } finally {
      setRefreshing(false);
    }
  };

  const handleSyncPress = async () => {
    if (pendingSyncCount > 0) {
      Alert.alert('Offline Sync', `Syncing ${pendingSyncCount} pending updates with cloud...`);
      await syncOfflineData();
      Alert.alert('Sync Finished', 'Pending records synchronized successfully!');
    } else {
      Alert.alert('Status', isOnline ? 'App is connected to PostgreSQL cloud.' : 'Working in local offline mode.');
    }
  };

  // Select displayed values based on timeframe
  const isTimeframeToday = profitTimeframe === 'today';
  const displayProfit = isTimeframeToday ? netProfit : totalNetProfit;
  const displaySales = isTimeframeToday ? todaySales : totalSales;
  const displayExpenses = isTimeframeToday ? todayExpenses : totalExpenses;

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* Top Header & Connection Pill */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greetingText}>{strings.goodMorning}</Text>
            <Text style={styles.businessName}>{businessProfile?.name || 'My Business'}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSyncPress}
              style={[
                styles.syncBadge,
                isOnline ? styles.syncBadgeOnline : styles.syncBadgeOffline,
              ]}
            >
              <Ionicons
                name={isOnline ? 'cloud-done-outline' : 'cloud-offline-outline'}
                size={14}
                color={isOnline ? '#059669' : '#D97706'}
              />
              <Text
                style={[
                  styles.syncText,
                  { color: isOnline ? '#059669' : '#D97706' },
                ]}
              >
                {isOnline
                  ? (pendingSyncCount > 0 ? `${pendingSyncCount} Syncing` : 'Online')
                  : `${pendingSyncCount || 'Offline'}`}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Settings')}
              style={styles.avatarCircle}
            >
              <Ionicons name="person" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 1. Dynamic Net Profit ("Asli Munafa") Featured Card */}
        <View style={styles.profitCard}>
          {/* Card Top Header: Title & Timeframe Toggle */}
          <View style={styles.profitHeaderRow}>
            <View>
              <Text style={styles.profitLabel}>
                {isTimeframeToday ? "TODAY'S NET PROFIT / آج کا خالص منافع" : "TOTAL NET PROFIT / کل خالص منافع"}
              </Text>
              <Text style={[styles.profitValue, displayProfit < 0 && { color: '#F87171' }]}>
                Rs. {displayProfit.toLocaleString()}
              </Text>
            </View>

            {/* Timeframe Pill Switcher */}
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                onPress={() => setProfitTimeframe('today')}
                style={[
                  styles.toggleBtn,
                  isTimeframeToday && styles.toggleBtnActive,
                ]}
              >
                <Text
                  style={[
                    styles.toggleBtnText,
                    isTimeframeToday && styles.toggleBtnTextActive,
                  ]}
                >
                  Today
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setProfitTimeframe('all')}
                style={[
                  styles.toggleBtn,
                  !isTimeframeToday && styles.toggleBtnActive,
                ]}
              >
                <Text
                  style={[
                    styles.toggleBtnText,
                    !isTimeframeToday && styles.toggleBtnTextActive,
                  ]}
                >
                  All-Time
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Breakdown: Sales vs Expenses + Add Expense Quick Button */}
          <View style={styles.profitDivider} />
          <View style={styles.breakdownRow}>
            <View style={styles.breakdownCol}>
              <Text style={styles.breakdownTitle}>Sales (فروخت)</Text>
              <Text style={[styles.breakdownAmt, { color: '#34D399' }]}>
                Rs. {displaySales.toLocaleString()}
              </Text>
            </View>
            <View style={styles.verticalDivider} />
            <View style={styles.breakdownCol}>
              <Text style={styles.breakdownTitle}>Expenses (اخراجات)</Text>
              <Text style={[styles.breakdownAmt, { color: '#F87171' }]}>
                Rs. {displayExpenses.toLocaleString()}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.addExpensePill}
              activeOpacity={0.8}
              onPress={() => setExpenseModalVisible(true)}
            >
              <Ionicons name="add-circle" size={16} color="#DC2626" />
              <Text style={styles.addExpensePillText}>+ Expense</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. Three Metric Counters */}
        <View style={styles.metricsRow}>
          <StatCard
            title={strings.ordersCount}
            value={totalOrdersCount}
            icon="receipt-outline"
            iconColor="#0284C7"
            iconBgColor="#E0F2FE"
            onPress={() => navigation.navigate('OrdersTab')}
          />
          <StatCard
            title={strings.pendingCount}
            value={pendingOrdersCount.toString().padStart(2, '0')}
            icon="time-outline"
            iconColor="#D97706"
            iconBgColor="#FEF3C7"
            onPress={() => navigation.navigate('OrdersTab')}
          />
          <StatCard
            title={strings.dueCount}
            value={`Rs. ${totalDueAmount.toLocaleString()}`}
            icon="wallet-outline"
            iconColor="#DC2626"
            iconBgColor="#FEE2E2"
            onPress={() => navigation.navigate('KhataTab')}
          />
        </View>

        {/* 3. Quick Action Buttons */}
        <View style={styles.actionsContainer}>
          <PrimaryButton
            title={strings.addOrder}
            icon={<Ionicons name="add-circle-outline" size={20} color="#FFFFFF" />}
            onPress={() => navigation.navigate('AddOrder')}
            style={styles.actionBtn}
          />
          <View style={styles.dualActionsRow}>
            <PrimaryButton
              title={strings.addCustomer}
              icon={<Ionicons name="person-add-outline" size={18} color="#FFFFFF" />}
              onPress={() => navigation.navigate('CustomersTab')}
              style={[styles.actionBtn, { flex: 1, marginRight: 8 }]}
            />
            <PrimaryButton
              title={strings.addPayment}
              icon={<Ionicons name="cash-outline" size={18} color="#FFFFFF" />}
              onPress={() => navigation.navigate('AddPayment')}
              style={[styles.actionBtn, { flex: 1 }]}
            />
          </View>
        </View>

        {/* 4. Recent Orders Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{strings.recentOrders}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('OrdersTab')}>
            <Text style={styles.viewAllText}>{strings.viewAll} &gt;</Text>
          </TouchableOpacity>
        </View>

        {orders.length === 0 ? (
          <View style={{ paddingVertical: 24, alignItems: 'center' }}>
            <Ionicons name="receipt-outline" size={36} color={colors.textLight || colors.textMuted} />
            <Text style={{ marginTop: 8, color: colors.textSecondary, fontSize: 14 }}>
              No orders yet. Tap "+ Add Order" to create one.
            </Text>
          </View>
        ) : (
          orders.slice(0, 4).map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onPress={() => navigation.navigate('OrderDetail', { order })}
              onWhatsAppPress={(ord) => sendWhatsAppReceipt(ord, businessProfile)}
            />
          ))
        )}
      </ScrollView>

      {/* Add Expense Modal */}
      <AddExpenseModal
        visible={expenseModalVisible}
        onClose={() => setExpenseModalVisible(false)}
        onAdd={async (expData) => {
          await addExpense(expData);
          await refreshData();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: 54,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  greetingText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  businessName: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  syncBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  syncBadgeOnline: {
    backgroundColor: '#D1FAE5',
  },
  syncBadgeOffline: {
    backgroundColor: '#FEF3C7',
  },
  syncText: {
    fontSize: 11,
    fontWeight: '700',
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  profitCard: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 18,
    marginBottom: spacing.xl,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  profitHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  profitLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.6,
  },
  profitValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#34D399',
    marginTop: 4,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 3,
  },
  toggleBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9,
  },
  toggleBtnActive: {
    backgroundColor: colors.primary,
  },
  toggleBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  toggleBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  profitDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 14,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  breakdownCol: {
    flex: 1,
  },
  breakdownTitle: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  breakdownAmt: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 2,
  },
  verticalDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 8,
  },
  addExpensePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  addExpensePillText: {
    color: '#DC2626',
    fontWeight: '700',
    fontSize: 12,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  actionsContainer: {
    marginBottom: spacing.xxl,
  },
  actionBtn: {
    marginBottom: spacing.md,
  },
  dualActionsRow: {
    flexDirection: 'row',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  viewAllText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },
});
