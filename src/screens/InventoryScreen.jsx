import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { AppHeader } from '../components/AppHeader';
import { SearchBar } from '../components/SearchBar';
import { PrimaryButton } from '../components/PrimaryButton';
import { FormInput } from '../components/FormInput';
import { EmptyState } from '../components/EmptyState';
import { useApp } from '../context/AppContext';

export const InventoryScreen = ({ navigation }) => {
  const { strings, products, addProduct } = useApp();
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSaveProduct = () => {
    if (!name.trim() || !price.trim() || !stock.trim()) {
      Alert.alert('Required', 'Please enter name, price, and initial stock.');
      return;
    }
    addProduct(name.trim(), parseFloat(price) || 0, parseInt(stock, 10) || 0);
    setName('');
    setPrice('');
    setStock('');
    setModalVisible(false);
  };

  const renderProductItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.iconBox}>
        <Ionicons name="cube-outline" size={24} color={colors.primary} />
      </View>

      <View style={styles.info}>
        <Text style={styles.prodName}>{item.name}</Text>
        <Text style={styles.prodPrice}>
          Rs. {item.price.toLocaleString()} •{' '}
          <Text style={[styles.stockVal, item.stock < 10 && styles.lowStock]}>
            Stock: {item.stock}
          </Text>
        </Text>
      </View>

      <TouchableOpacity style={styles.editBtn}>
        <Ionicons name="create-outline" size={20} color={colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <AppHeader
        title={strings.inventory}
        showBack
        onBack={() => navigation.goBack()}
      />

      <View style={styles.content}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder={strings.searchProducts}
          style={styles.searchBar}
        />

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderProductItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <EmptyState
              icon="cube-outline"
              title="No Products Found"
              message="Add items to track stock and inventory."
              actionTitle="+ Add Product"
              onAction={() => setModalVisible(true)}
            />
          }
        />
      </View>

      <View style={styles.footer}>
        <PrimaryButton
          title={strings.addProduct}
          onPress={() => setModalVisible(true)}
        />
      </View>

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Product</Text>

            <FormInput
              label="Product Name"
              placeholder="e.g. Mechanical Keyboard"
              value={name}
              onChangeText={setName}
            />

            <FormInput
              label="Price (PKR)"
              placeholder="e.g. 3000"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              prefix="Rs."
            />

            <FormInput
              label="Initial Stock Quantity"
              placeholder="e.g. 15"
              value={stock}
              onChangeText={setStock}
              keyboardType="numeric"
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
                onPress={handleSaveProduct}
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
  card: {
    backgroundColor: colors.surface,
    borderRadius: spacing.cardRadius,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  info: {
    flex: 1,
  },
  prodName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  prodPrice: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  stockVal: {
    fontWeight: '700',
    color: colors.primary,
  },
  lowStock: {
    color: colors.danger,
  },
  editBtn: {
    padding: spacing.sm,
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
