import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { AppHeader } from '../components/AppHeader';
import { StatCard } from '../components/StatCard';
import { useApp } from '../context/AppContext';

export const ReportsScreen = ({ navigation }) => {
  const { strings, products } = useApp();
  const [filter, setFilter] = useState('Weekly');

  const daysData = [
    { day: 'Mon', value: 35 },
    { day: 'Tue', value: 50 },
    { day: 'Wed', value: 45 },
    { day: 'Thu', value: 70 },
    { day: 'Fri', value: 85 },
    { day: 'Sat', value: 100 },
    { day: 'Sun', value: 65 },
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
          value="Rs. 98,500"
          trend="18% growth this period"
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
                    { height: `${d.value}%` },
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

        {products.map((p, index) => (
          <View key={p.id} style={styles.productRow}>
            <View style={styles.rankBadge}>
              <Text style={styles.rankNum}>#{index + 1}</Text>
            </View>
            <View style={styles.prodDetails}>
              <Text style={styles.prodName}>{p.name}</Text>
              <Text style={styles.prodSales}>
                {28 - index * 6} orders completed
              </Text>
            </View>
            <Text style={styles.prodRevenue}>
              Rs. {(p.price * (28 - index * 6)).toLocaleString()}
            </Text>
          </View>
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
