import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { AppHeader } from '../components/AppHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import { useApp } from '../context/AppContext';

export const AddOrderScreen = ({ navigation }) => {
  const { strings, customers, products, addOrder } = useApp();

  const [selectedCustomerId, setSelectedCustomerId] = useState(
    customers.length > 0 ? customers[0].id : ''
  );

  const [orderItems, setOrderItems] = useState([
    {
      productId: products[0]?.id || 'p1',
      name: products[0]?.name || 'Wireless Mouse',
      price: products[0]?.price || 1800,
      quantity: 1,
    },
  ]);

  const [deliveryCharges, setDeliveryCharges] = useState(100);
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalAmount = subtotal + deliveryCharges;

  const handleAddProduct = () => {
    const unselected = products.find(
      (p) => !orderItems.some((item) => item.productId === p.id)
    );
    if (unselected) {
      setOrderItems((prev) => [
        ...prev,
        {
          productId: unselected.id,
          name: unselected.name,
          price: unselected.price,
          quantity: 1,
        },
      ]);
    } else {
      Alert.alert('Notice', 'All products in inventory are already added.');
    }
  };

  const handleRemoveItem = (index) => {
    if (orderItems.length <= 1) {
      Alert.alert('Notice', 'Order must have at least one product.');
      return;
    }
    setOrderItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveOrder = () => {
    const customer = customers.find((c) => c.id === selectedCustomerId);
    if (!customer) {
      Alert.alert('Error', 'Please select a customer.');
      return;
    }

    addOrder({
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      items: orderItems,
      subtotal,
      deliveryCharges,
      totalAmount,
      paymentMethod,
      status: 'Pending',
    });

    Alert.alert('Success', 'Order created successfully!', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);

  return (
    <View style={styles.container}>
      <AppHeader
        title={strings.newOrder}
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Customer Select */}
        <Text style={styles.sectionLabel}>{strings.selectCustomer}</Text>
        <View style={styles.customerChipsRow}>
          {customers.map((c) => {
            const isSelected = c.id === selectedCustomerId;
            return (
              <TouchableOpacity
                key={c.id}
                onPress={() => setSelectedCustomerId(c.id)}
                style={[
                  styles.customerChip,
                  isSelected && styles.customerChipSelected,
                ]}
              >
                <Text
                  style={[
                    styles.customerChipText,
                    isSelected && styles.customerChipTextSelected,
                  ]}
                >
                  {c.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {selectedCustomer && (
          <View style={styles.selectedCustomerCard}>
            <View>
              <Text style={styles.custName}>{selectedCustomer.name}</Text>
              <Text style={styles.custPhone}>{selectedCustomer.phone}</Text>
            </View>
            <Text style={styles.custDue}>Due: Rs. {selectedCustomer.totalDue.toLocaleString()}</Text>
          </View>
        )}

        {/* Products Section */}
        <View style={styles.productsHeaderRow}>
          <Text style={styles.sectionLabel}>{strings.products}</Text>
          <TouchableOpacity onPress={handleAddProduct} style={styles.addProductBtn}>
            <Text style={styles.addProductText}>{strings.addProduct}</Text>
          </TouchableOpacity>
        </View>

        {orderItems.map((item, index) => (
          <View key={item.productId} style={styles.productCard}>
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productCalculation}>
                {item.quantity} × Rs. {item.price.toLocaleString()}
              </Text>
            </View>
            <TouchableOpacity onPress={() => handleRemoveItem(index)} style={styles.trashBtn}>
              <Ionicons name="trash-outline" size={20} color={colors.danger} />
            </TouchableOpacity>
          </View>
        ))}

        {/* Calculation Summary */}
        <View style={styles.calcCard}>
          <View style={styles.calcRow}>
            <Text style={styles.calcLabel}>{strings.subtotal}</Text>
            <Text style={styles.calcVal}>Rs. {subtotal.toLocaleString()}</Text>
          </View>

          <View style={styles.calcRow}>
            <Text style={styles.calcLabel}>{strings.deliveryCharges}</Text>
            <Text style={styles.calcVal}>Rs. {deliveryCharges.toLocaleString()}</Text>
          </View>

          <View style={[styles.calcRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>{strings.totalAmount}</Text>
            <Text style={styles.totalVal}>Rs. {totalAmount.toLocaleString()}</Text>
          </View>
        </View>

        {/* Payment Method Selector */}
        <Text style={styles.sectionLabel}>{strings.paymentMethod}</Text>
        <View style={styles.methodsRow}>
          {['Cash', 'Easypaisa', 'JazzCash', 'Bank'].map((method) => {
            const isSelected = paymentMethod === method;
            return (
              <TouchableOpacity
                key={method}
                onPress={() => setPaymentMethod(method)}
                style={[styles.methodChip, isSelected && styles.methodChipSelected]}
              >
                <Text style={[styles.methodChipText, isSelected && styles.methodChipTextSelected]}>
                  {method}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.footer}>
        <PrimaryButton title={strings.saveOrder} onPress={handleSaveOrder} />
      </View>
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
    paddingBottom: 30,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  customerChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.sm,
  },
  customerChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  customerChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  customerChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  customerChipTextSelected: {
    color: '#FFFFFF',
  },
  selectedCustomerCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: spacing.cardRadius,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  custName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  custPhone: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  custDue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.danger,
  },
  productsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  addProductBtn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: colors.primaryLight,
    borderRadius: 14,
  },
  addProductText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  productCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing.cardRadius,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  productCalculation: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  trashBtn: {
    padding: spacing.sm,
  },
  calcCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing.cardRadius,
    padding: spacing.lg,
    marginVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  calcRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  calcLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  calcVal: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 10,
    marginTop: 4,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  totalVal: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.primary,
  },
  methodsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.lg,
  },
  methodChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  methodChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  methodChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  methodChipTextSelected: {
    color: '#FFFFFF',
  },
  footer: {
    padding: spacing.xl,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
});
