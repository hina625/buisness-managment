import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../constants/theme';
import { useApp } from '../../context/AppContext';

export const ReportsScreen = ({ navigation }: { navigation: any }) => {
  const { strings, products, orders } = useApp();
  const [filter, setFilter] = useState<'Daily' | 'Weekly' | 'Monthly'>('Weekly');

  // Real Dynamic revenue
  const totalRevenue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  // Map product sales from real orders
  const productSalesMap: { [key: string]: { count: number; revenue: number } } = {};
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{strings.reports}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Filter Toggle */}
        <View style={styles.tabsRow}>
          {(['Daily', 'Weekly', 'Monthly'] as const).map((item) => {
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

        {/* Total Sales Big Banner */}
        <View style={styles.totalSalesCard}>
          <Text style={styles.totalSalesLabel}>Total Sales</Text>
          <Text style={styles.totalSalesAmount}>Rs. {totalRevenue.toLocaleString()}</Text>
          <View style={styles.badgeRow}>
            <Ionicons name="arrow-up" size={14} color="#10B981" />
            <Text style={styles.badgeText}>Real dynamic calculation</Text>
          </View>
        </View>

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
          <TouchableOpacity>
            <Text style={styles.viewAllText}>{strings.viewAll} &gt;</Text>
          </TouchableOpacity>
        </View>

        {rankedProducts.length === 0 ? (
          <View style={{ paddingVertical: 20, alignItems: 'center' }}>
            <Text style={{ color: THEME.colors.textSecondary, fontSize: 13 }}>
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
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabButtonActive: {
    backgroundColor: THEME.colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  totalSalesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: THEME.metrics.cardRadius,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  totalSalesLabel: {
    fontSize: 14,
    color: THEME.colors.textSecondary,
    marginBottom: 4,
  },
  totalSalesAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: THEME.colors.primary,
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    color: '#065F46',
    fontWeight: '600',
    marginLeft: 4,
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: THEME.metrics.cardRadius,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  chartTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
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
    backgroundColor: THEME.colors.primary,
  },
  barDay: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
  },
  topProductsHeader: {
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
  productRow: {
    backgroundColor: '#FFFFFF',
    borderRadius: THEME.metrics.cardRadius,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: THEME.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankNum: {
    fontSize: 13,
    fontWeight: '800',
    color: THEME.colors.primary,
  },
  prodDetails: {
    flex: 1,
  },
  prodName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  prodSales: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  prodRevenue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
});
