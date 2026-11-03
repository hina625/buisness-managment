import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/StatusBadge';
import { Order } from '../../types';

export const OrdersScreen = ({ navigation }: { navigation: any }) => {
  const { strings, orders } = useApp();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Delivered' | 'Cancelled'>('All');

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === 'All' ? true : o.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const renderOrderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => navigation.navigate('OrderDetail', { order: item })}
      style={styles.card}
    >
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.orderNumber}>{item.orderNumber}</Text>
          <Text style={styles.customerName}>{item.customerName}</Text>
        </View>
        <StatusBadge status={item.status} />
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.orderDate}>{item.date}</Text>
        <Text style={styles.orderAmount}>Rs. {item.totalAmount.toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Top Search bar */}
      <View style={styles.searchRow}>
        <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={strings.searchOrders}
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#9CA3AF"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabsRow}>
        {(['All', 'Pending', 'Delivered', 'Cancelled'] as const).map((tab) => {
          const isSelected = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tabChip, isSelected && styles.activeTabChip]}
            >
              <Text style={[styles.tabChipText, isSelected && styles.activeTabChipText]}>
                {tab === 'All'
                  ? strings.tabAll
                  : tab === 'Pending'
                  ? strings.tabPending
                  : tab === 'Delivered'
                  ? strings.tabDelivered
                  : strings.tabCancelled}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Orders List */}
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={48} color="#D1D5DB" />
            <Text style={styles.emptyText}>No orders found</Text>
          </View>
        }
      />

      {/* Floating Add Order Button */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => navigation.navigate('AddOrder')}
        style={styles.fab}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    paddingTop: 50,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: THEME.metrics.cardRadius,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  tabChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeTabChip: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  tabChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  activeTabChipText: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: THEME.metrics.cardRadius,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderNumber: {
    fontSize: 15,
    fontWeight: '800',
    color: THEME.colors.primary,
    marginBottom: 2,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 10,
  },
  orderDate: {
    fontSize: 12,
    color: THEME.colors.textMuted,
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: THEME.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: THEME.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 15,
    color: '#9CA3AF',
    marginTop: 10,
  },
});
