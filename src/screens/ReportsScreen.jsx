import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { AppHeader } from '../components/AppHeader';
import { StatCard } from '../components/StatCard';
import { useApp } from '../context/AppContext';

export const ReportsScreen = ({ navigation }) => {
  const { strings, products, orders } = useApp();
  const [filter, setFilter] = useState('Weekly');

  // Real Dynamic revenue
  const totalRevenue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  // Map product sales from real orders
  const productSalesMap = {};
  orders.forEach((o) => {
    if (o.status !== 'Cancelled') {
      o.items.forEach((item) => {
        if (!productSalesMap[item.productId]) {
          productSalesMap[item.productId] = { count: 0, revenue: 0 };
        }
        productSalesMap[item.productId].count += item.quantity;
        productSalesMap[item.productId].revenue += item.price * item.quantity;
      });
    }
  });

  const rankedProducts = products
    .map((p) => ({
      ...p,
      soldCount: productSalesMap[p.id]?.count || 0,
      totalSalesRevenue: productSalesMap[p.id]?.revenue || 0,
    }))
    .sort((a, b) => b.totalSalesRevenue - a.totalSalesRevenue);

  const daysData = [
    { day: 'Mon', value: 0 },
    { day: 'Tue', value: 0 },
    { day: 'Wed', value: 0 },
    { day: 'Thu', value: 0 },
    { day: 'Fri', value: 0 },
    { day: 'Sat', value: 0 },
    { day: 'Sun', value: 0 },
  ];

  return (
    <View style={styles.container}>
      <AppHeader
        title={strings.reports}
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Filter Toggle */}
        <View style={styles.tabsRow}>
          {['Daily', 'Weekly', 'Monthly'].map((item) => {
            const isSelected = filter === item;
            return (
              <TouchableOpacity
                key={item}
                onPress={() => setFilter(item)}
                style={[styles.tabButton, isSelected && styles.tabButtonActive]}
              >
                <Text style={[styles.tabText, isSelected && styles.tabTextActive]}>
                  {item === 'Daily'
                    ? strings.daily
                    : item === 'Weekly'
                    ? strings.weekly
                    : strings.monthly}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Total Sales Banner Card */}
        <StatCard
          isFeatured
          title="Total Revenue"
          value={`Rs. ${totalRevenue.toLocaleString()}`}
          trend="Based on all recorded orders"
        />

        {/* Bar Chart Visual */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Revenue Trend (PKR)</Text>
          <View style={styles.chartArea}>
            {daysData.map((d, idx) => (
              <View key={idx} style={styles.barCol}>
                <View
                  style={[
                    styles.barFill,
                    { height: `${Math.max(d.value, 4)}%` },
                    d.value === 100 && styles.barMax,
                  ]}
                />
                <Text style={styles.barDay}>{d.day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Top Products */}
        <View style={styles.topProductsHeader}>
          <Text style={styles.sectionTitle}>{strings.topProducts}</Text>
        </View>

        {rankedProducts.length === 0 ? (
          <View style={{ paddingVertical: 20, alignItems: 'center' }}>
            <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
              No products found. Add products in the Inventory tab.
            </Text>
          </View>
        ) : (
          rankedProducts.map((p, index) => (
            <View key={p.id} style={styles.productRow}>
              <View style={styles.rankBadge}>
                <Text style={styles.rankNum}>#{index + 1}</Text>
              </View>
              <View style={styles.prodDetails}>
                <Text style={styles.prodName}>{p.name}</Text>
                <Text style={styles.prodSales}>
                  {p.soldCount} orders completed
                </Text>
              </View>
              <Text style={styles.prodRevenue}>
                Rs. {p.totalSalesRevenue.toLocaleString()}
              </Text>
            </View>
          ))
        )}
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
    padding: spacing.xl,
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 4,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabButtonActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  chartCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing.cardRadius,
    padding: spacing.xl,
    marginBottom: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  chartTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xl,
  },
  chartArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    paddingTop: 10,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  barFill: {
    width: 14,
    backgroundColor: '#A7F3D0',
    borderRadius: 6,
    marginBottom: 8,
  },
  barMax: {
    backgroundColor: colors.primary,
  },
  barDay: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  topProductsHeader: {
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
  productRow: {
    backgroundColor: colors.surface,
    borderRadius: spacing.cardRadius,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  rankNum: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primary,
  },
  prodDetails: {
    flex: 1,
  },
  prodName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  prodSales: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  prodRevenue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
});
