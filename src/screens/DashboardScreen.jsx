import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { StatCard } from '../components/StatCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { OrderCard } from '../components/OrderCard';
import { useApp } from '../context/AppContext';

export const DashboardScreen = ({ navigation }) => {
  const {
    strings,
    businessProfile,
    todaySales,
    totalOrdersCount,
    pendingOrdersCount,
    totalDueAmount,
    orders,
  } = useApp();

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greetingText}>{strings.goodMorning}</Text>
            <Text style={styles.businessName}>{businessProfile.name}</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Settings')}
            style={styles.avatarCircle}
          >
            <Ionicons name="person" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* 1. Large Featured Card - Today's Sales */}
        <StatCard
          isFeatured
          title={strings.todaySales}
          value={`Rs. ${todaySales.toLocaleString()}`}
          trend={strings.fromYesterday}
        />

        {/* 2. Three Metric Counters */}
        <View style={styles.metricsRow}>
          <StatCard
            title={strings.ordersCount}
            value={totalOrdersCount + 21}
            icon="receipt-outline"
            iconColor="#0284C7"
            iconBgColor="#E0F2FE"
            onPress={() => navigation.navigate('OrdersTab')}
          />
          <StatCard
            title={strings.pendingCount}
            value={`0${pendingOrdersCount + 7}`}
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
          <PrimaryButton
            title={strings.addCustomer}
            icon={<Ionicons name="person-add-outline" size={20} color="#FFFFFF" />}
            onPress={() => navigation.navigate('CustomersTab')}
            style={styles.actionBtn}
          />
          <PrimaryButton
            title={strings.addPayment}
            icon={<Ionicons name="cash-outline" size={20} color="#FFFFFF" />}
            onPress={() => navigation.navigate('AddPayment')}
            style={styles.actionBtn}
          />
        </View>

        {/* 4. Recent Orders Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{strings.recentOrders}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('OrdersTab')}>
            <Text style={styles.viewAllText}>{strings.viewAll} &gt;</Text>
          </TouchableOpacity>
        </View>

        {orders.slice(0, 3).map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onPress={() => navigation.navigate('OrderDetail', { order })}
          />
        ))}
      </ScrollView>
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
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
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
