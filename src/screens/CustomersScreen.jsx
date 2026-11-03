import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Modal, Text, Alert } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { AppHeader } from '../components/AppHeader';
import { SearchBar } from '../components/SearchBar';
import { CustomerCard } from '../components/CustomerCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { FormInput } from '../components/FormInput';
import { EmptyState } from '../components/EmptyState';
import { useApp } from '../context/AppContext';

export const CustomersScreen = ({ navigation }) => {
  const { strings, customers, addCustomer } = useApp();
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  const handleSaveCustomer = () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert('Required', 'Please enter customer name and phone number.');
      return;
    }
    addCustomer(name.trim(), phone.trim());
    setName('');
    setPhone('');
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <AppHeader title={strings.customers} />

      <View style={styles.content}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder={strings.searchCustomers}
          style={styles.searchBar}
        />

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CustomerCard
              customer={item}
              onPress={() => navigation.navigate('CustomerProfile', { customer: item })}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <EmptyState
              icon="people-outline"
              title="No Customers Found"
              message="No customers match your search criteria."
              actionTitle="+ Add Customer"
              onAction={() => setModalVisible(true)}
            />
          }
        />
      </View>

      <View style={styles.footer}>
        <PrimaryButton
          title={strings.addCustomer}
          onPress={() => setModalVisible(true)}
        />
      </View>

      {/* Modal for adding customer */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Customer</Text>

            <FormInput
              label="Customer Name"
              placeholder="e.g. Tariq Mehmood"
              value={name}
              onChangeText={setName}
            />

            <FormInput
              label="Mobile Number"
              placeholder="0300 1234567"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />

            <View style={styles.modalBtnRow}>
              <PrimaryButton
                title="Cancel"
                variant="outline"
                style={{ flex: 1, marginRight: spacing.sm }}
                onPress={() => setModalVisible(false)}
              />
              <PrimaryButton
                title="Save"
                style={{ flex: 1, marginLeft: spacing.sm }}
                onPress={handleSaveCustomer}
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
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  searchBar: {
    marginBottom: spacing.md,
  },
  listContent: {
    paddingBottom: 20,
  },
  footer: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: spacing.cardRadius,
    padding: spacing.xl,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  modalBtnRow: {
    flexDirection: 'row',
    marginTop: spacing.sm,
  },
});
