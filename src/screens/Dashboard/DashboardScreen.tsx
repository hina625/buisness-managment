import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/StatusBadge';

export const DashboardScreen = ({ navigation }: { navigation: any }) => {
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
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Top Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greetingText}>{strings.goodMorning}</Text>
            <Text style={styles.businessName}>{businessProfile.name}</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('More', { screen: 'Settings' })}
            style={styles.avatarCircle}
          >
            <Ionicons name="person" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Today's Sales Card */}
        <View style={styles.salesCard}>
          <View style={styles.salesLeft}>
            <Text style={styles.salesLabel}>{strings.todaySales}</Text>
            <Text style={styles.salesAmount}>Rs. {todaySales.toLocaleString()}</Text>
            <View style={styles.salesTrendBadge}>
              <Ionicons name="trending-up" size={14} color="#10B981" />
              <Text style={styles.salesTrendText}>{strings.fromYesterday}</Text>
            </View>
          </View>

          {/* Graphical decorative bars */}
          <View style={styles.miniBarGraph}>
            <View style={[styles.bar, { height: 16 }]} />
            <View style={[styles.bar, { height: 26 }]} />
            <View style={[styles.bar, { height: 20 }]} />
            <View style={[styles.bar, { height: 38 }]} />
            <View style={[styles.bar, { height: 48, backgroundColor: '#10B981' }]} />
          </View>
        </View>

        {/* 3 Metric Counters */}
        <View style={styles.statsRow}>
          {/* Orders Counter */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('OrdersTab')}
            style={styles.statBox}
          >
            <View style={[styles.statIconBadge, { backgroundColor: '#E0F2FE' }]}>
              <Ionicons name="receipt-outline" size={18} color="#0284C7" />
            </View>
            <Text style={styles.statValue}>{totalOrdersCount + 21}</Text>
            <Text style={styles.statTitle}>{strings.ordersCount}</Text>
          </TouchableOpacity>

          {/* Pending Counter */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('OrdersTab')}
            style={styles.statBox}
          >
            <View style={[styles.statIconBadge, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="time-outline" size={18} color="#D97706" />
            </View>
            <Text style={styles.statValue}>0{pendingOrdersCount + 7}</Text>
            <Text style={styles.statTitle}>{strings.pendingCount}</Text>
          </TouchableOpacity>

          {/* Total Due Counter */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('KhataTab')}
            style={styles.statBox}
          >
            <View style={[styles.statIconBadge, { backgroundColor: '#FEE2E2' }]}>
              <Ionicons name="wallet-outline" size={18} color="#DC2626" />
            </View>
            <Text style={[styles.statValue, { fontSize: 13, color: '#DC2626' }]}>
              Rs. {totalDueAmount.toLocaleString()}
            </Text>
            <Text style={styles.statTitle}>{strings.dueCount}</Text>
          </TouchableOpacity>
        </View>

        {/* 3 Action Buttons */}
        <View style={styles.actionButtonsArea}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('AddOrder')}
            style={styles.primaryActionBtn}
          >
            <Ionicons name="add-circle-outline" size={20} color="#FFFFFF" />
            <Text style={styles.primaryActionText}>{strings.addOrder}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('CustomersTab')}
            style={styles.primaryActionBtn}
          >
            <Ionicons name="person-add-outline" size={20} color="#FFFFFF" />
            <Text style={styles.primaryActionText}>{strings.addCustomer}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('AddPayment')}
            style={styles.primaryActionBtn}
          >
            <Ionicons name="cash-outline" size={20} color="#FFFFFF" />
            <Text style={styles.primaryActionText}>{strings.addPayment}</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Orders Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{strings.recentOrders}</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('OrdersTab')}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.viewAllText}>{strings.viewAll} &gt;</Text>
          </TouchableOpacity>
        </View>

        {/* Orders list snippet */}
        {orders.slice(0, 3).map((order) => (
          <TouchableOpacity
            key={order.id}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('OrderDetail', { order })}
            style={styles.orderCard}
          >
            <View style={styles.orderLeft}>
              <Text style={styles.orderNum}>{order.orderNumber}</Text>
              <Text style={styles.orderCustomer}>{order.customerName}</Text>
              <Text style={styles.orderDate}>{order.date}</Text>
            </View>

            <View style={styles.orderRight}>
              <Text style={styles.orderAmount}>Rs. {order.totalAmount.toLocaleString()}</Text>
              <StatusBadge status={order.status} />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  greetingText: {
    fontSize: 14,
    color: THEME.colors.textSecondary,
    fontWeight: '500',
  },
  businessName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: THEME.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  salesCard: {
    backgroundColor: '#034732',
    borderRadius: THEME.metrics.cardRadius,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  salesLeft: {
    flex: 1,
  },
  salesLabel: {
    fontSize: 13,
    color: '#A7F3D0',
    fontWeight: '500',
    marginBottom: 4,
  },
  salesAmount: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  salesTrendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  salesTrendText: {
    fontSize: 12,
    color: '#A7F3D0',
    marginLeft: 4,
    fontWeight: '500',
  },
  miniBarGraph: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 50,
  },
  bar: {
    width: 8,
    backgroundColor: '#059669',
    borderRadius: 4,
    marginLeft: 5,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: THEME.metrics.cardRadius,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    elevation: 1,
  },
  statIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 2,
  },
  statTitle: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    fontWeight: '500',
  },
  actionButtonsArea: {
    marginBottom: 24,
  },
  primaryActionBtn: {
    height: 48,
    backgroundColor: THEME.colors.primary,
    borderRadius: THEME.metrics.cardRadius,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: THEME.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  viewAllText: {
    fontSize: 13,
    color: THEME.colors.primary,
    fontWeight: '600',
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: THEME.metrics.cardRadius,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    elevation: 1,
  },
  orderLeft: {
    flex: 1,
  },
  orderNum: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.primary,
    marginBottom: 2,
  },
  orderCustomer: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  orderDate: {
    fontSize: 12,
    color: THEME.colors.textMuted,
  },
  orderRight: {
    alignItems: 'flex-end',
  },
  orderAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
});
