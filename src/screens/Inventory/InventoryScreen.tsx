import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { CustomButton } from '../../components/CustomButton';
import { Product } from '../../types';

export const InventoryScreen = ({ navigation }: { navigation: any }) => {
  const { strings, products, addProduct } = useApp();
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodStock, setProdStock] = useState('');

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateProduct = () => {
    if (!prodName.trim() || !prodPrice.trim() || !prodStock.trim()) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    addProduct(prodName.trim(), parseFloat(prodPrice) || 0, parseInt(prodStock, 10) || 0);
    setProdName('');
    setProdPrice('');
    setProdStock('');
    setModalVisible(false);
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <View style={styles.card}>
      <View style={styles.iconBox}>
        <Ionicons name="cube-outline" size={24} color={THEME.colors.primary} />
      </View>

      <View style={styles.info}>
        <Text style={styles.prodName}>{item.name}</Text>
        <Text style={styles.prodPrice}>
          Rs. {item.price.toLocaleString()} •{' '}
          <Text style={[styles.stockLabel, item.stock < 10 && styles.lowStock]}>
            {strings.stock}: {item.stock}
          </Text>
        </Text>
      </View>

      <TouchableOpacity style={styles.editBtn}>
        <Ionicons name="create-outline" size={20} color="#6B7280" />
      </TouchableOpacity>
    </View>
  );

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
        <Text style={styles.headerTitle}>{strings.inventory}</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={strings.searchProducts}
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {/* List */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderProductItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Add Product Button */}
      <View style={styles.footer}>
        <CustomButton
          title={strings.addProduct}
          onPress={() => setModalVisible(true)}
        />
      </View>

      {/* Add Product Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Product</Text>

            <Text style={styles.inputLabel}>Product Name</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Wireless Mouse"
              value={prodName}
              onChangeText={setProdName}
              placeholderTextColor="#9CA3AF"
            />

            <Text style={styles.inputLabel}>Price (PKR)</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. 1800"
              value={prodPrice}
              onChangeText={setProdPrice}
              keyboardType="numeric"
              placeholderTextColor="#9CA3AF"
            />

            <Text style={styles.inputLabel}>Initial Stock</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. 25"
              value={prodStock}
              onChangeText={setProdStock}
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
                onPress={handleCreateProduct}
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
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: THEME.metrics.cardRadius,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: THEME.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  info: {
    flex: 1,
  },
  prodName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  prodPrice: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
  },
  stockLabel: {
    fontWeight: '700',
    color: THEME.colors.primary,
  },
  lowStock: {
    color: '#DC2626',
  },
  editBtn: {
    padding: 8,
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
