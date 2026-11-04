import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { CustomButton } from '../../components/CustomButton';
import { Customer } from '../../types';

export const CustomersScreen = ({ navigation }: { navigation: any }) => {
  const { strings, customers, addCustomer } = useApp();
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [openingDue, setOpeningDue] = useState('');

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  const handleCreateCustomer = () => {
    if (!newCustName.trim() || !newCustPhone.trim()) {
      Alert.alert('Error', 'Please fill name and phone number');
      return;
    }
    const dueAmount = parseFloat(openingDue) || 0;
    addCustomer(newCustName.trim(), newCustPhone.trim(), dueAmount);
    setNewCustName('');
    setNewCustPhone('');
    setOpeningDue('');
    setModalVisible(false);
  };

  const renderCustomerItem = ({ item }: { item: Customer }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => navigation.navigate('CustomerProfile', { customer: item })}
      style={styles.card}
    >
      <View style={styles.cardLeft}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={20} color={THEME.colors.primary} />
        </View>
        <View>
          <Text style={styles.customerName}>{item.name}</Text>
          <Text style={styles.orderCount}>{item.totalOrders} {strings.totalOrdersLabel}</Text>
        </View>
      </View>

      <View style={styles.cardRight}>
        <Text style={styles.dueAmount}>Rs. {item.totalDue.toLocaleString()}</Text>
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
          placeholder={strings.searchCustomers}
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

      {/* Customers List */}
      <FlatList
        data={filteredCustomers}
        keyExtractor={(item) => item.id}
        renderItem={renderCustomerItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Add Customer Button */}
      <View style={styles.footer}>
        <CustomButton
          title={strings.addCustomer}
          onPress={() => setModalVisible(true)}
        />
      </View>

      {/* Add Customer Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Customer</Text>

            <Text style={styles.inputLabel}>Customer Name</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Bilal Ahmed"
              value={newCustName}
              onChangeText={setNewCustName}
              placeholderTextColor="#9CA3AF"
            />

            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="0300 0000000"
              value={newCustPhone}
              onChangeText={setNewCustPhone}
              keyboardType="phone-pad"
              placeholderTextColor="#9CA3AF"
            />

            <Text style={styles.inputLabel}>Opening Balance / Pehle ka Udhaar (Optional)</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. 5000"
              value={openingDue}
              onChangeText={setOpeningDue}
              keyboardType="numeric"
              placeholderTextColor="#9CA3AF"
            />

            <View style={styles.modalButtonsRow}>
              <CustomButton
                title="Cancel"
                variant="outline"
                style={{ flex: 1, marginRight: 8 }}
                onPress={() => setModalVisible(false)}
              />
              <CustomButton
                title="Save"
                style={{ flex: 1, marginLeft: 8 }}
                onPress={handleCreateCustomer}
              />
            </View>
          </View>
        </View>
      </Modal>
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
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: THEME.metrics.cardRadius,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    elevation: 1,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: THEME.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  orderCount: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
  },
  cardRight: {
    alignItems: 'flex-end',
  },
  dueAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: THEME.colors.primary,
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  modalInput: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: THEME.metrics.cardRadius,
    paddingHorizontal: 14,
    fontSize: 15,
    marginBottom: 16,
    color: '#111827',
  },
  modalButtonsRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
});
