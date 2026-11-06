import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { AppHeader } from '../components/AppHeader';
import { SearchBar } from '../components/SearchBar';
import { OrderCard } from '../components/OrderCard';
import { EmptyState } from '../components/EmptyState';
import { useApp } from '../context/AppContext';
import { sendWhatsAppReceipt } from '../utils/whatsappReceipt';

export const OrdersScreen = ({ navigation }) => {
  const { strings, orders, businessProfile } = useApp();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === 'All' ? true : o.status === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <View style={styles.container}>
      <AppHeader
        title={strings.orders}
        rightComponent={
          <TouchableOpacity
            onPress={() => navigation.navigate('AddOrder')}
            style={styles.headerAddBtn}
          >
            <Ionicons name="add" size={24} color={colors.primary} />
          </TouchableOpacity>
        }
      />

      <View style={styles.content}>
        {/* Search Bar */}
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder={strings.searchOrders}
          style={styles.searchBar}
        />

        {/* Filter Chips */}
        <View style={styles.filterRow}>
          {['All', 'Pending', 'Delivered', 'Cancelled'].map((tab) => {
            const isSelected = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[styles.chip, isSelected && styles.activeChip]}
              >
                <Text style={[styles.chipText, isSelected && styles.activeChipText]}>
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

        {/* Orders FlatList */}
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <OrderCard
              order={item}
              onPress={() => navigation.navigate('OrderDetail', { order: item })}
              onWhatsAppPress={(ord) => sendWhatsAppReceipt(ord, businessProfile)}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <EmptyState
              icon="receipt-outline"
              title="No Orders Found"
              message="No orders match your search or filter."
              actionTitle="+ Add Order"
              onAction={() => navigation.navigate('AddOrder')}
            />
          }
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
  headerAddBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    marginBottom: spacing.md,
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: colors.surface,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  activeChipText: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingBottom: 40,
  },
});
