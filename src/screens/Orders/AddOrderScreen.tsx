import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { CustomButton } from '../../components/CustomButton';
import { OrderItem, PaymentMethod } from '../../types';

export const AddOrderScreen = ({ navigation }: { navigation: any }) => {
  const { strings, customers, products, addOrder } = useApp();

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
    customers.length > 0 ? customers[0].id : ''
  );

  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    {
      productId: products[0]?.id || 'p1',
      name: products[0]?.name || 'Wireless Mouse',
      price: products[0]?.price || 1800,
      quantity: 1,
    },
  ]);

  const [deliveryCharges, setDeliveryCharges] = useState(100);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalAmount = subtotal + deliveryCharges;

  const handleAddProduct = () => {
    // Pick next available product
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
      Alert.alert('Info', 'All catalog products are already added.');
    }
  };

  const handleRemoveItem = (index: number) => {
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{strings.newOrder}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Customer Select */}
        <Text style={styles.sectionLabel}>{strings.selectCustomer}</Text>
        <View style={styles.customerSelector}>
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

        {/* Selected Customer Card */}
        {selectedCustomer && (
          <View style={styles.customerInfoCard}>
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
          <TouchableOpacity
            onPress={handleAddProduct}
            style={styles.addProductBtn}
          >
            <Text style={styles.addProductText}>{strings.addProduct}</Text>
          </TouchableOpacity>
        </View>

        {/* Product Items List */}
        {orderItems.map((item, index) => (
          <View key={item.productId} style={styles.productCard}>
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productCalculation}>
                {item.quantity} × Rs. {item.price.toLocaleString()}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => handleRemoveItem(index)}
              style={styles.trashBtn}
            >
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
        ))}

        {/* Price Breakdown */}
        <View style={styles.calculationCard}>
          <View style={styles.calcRow}>
            <Text style={styles.calcLabel}>{strings.subtotal}</Text>
            <Text style={styles.calcValue}>Rs. {subtotal.toLocaleString()}</Text>
          </View>

          <View style={styles.calcRow}>
            <Text style={styles.calcLabel}>{strings.deliveryCharges}</Text>
            <Text style={styles.calcValue}>Rs. {deliveryCharges.toLocaleString()}</Text>
          </View>

          <View style={[styles.calcRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>{strings.totalAmount}</Text>
            <Text style={styles.totalValue}>Rs. {totalAmount.toLocaleString()}</Text>
          </View>
        </View>

        {/* Payment Method */}
        <Text style={styles.sectionLabel}>{strings.paymentMethod}</Text>
        <View style={styles.paymentMethodRow}>
          {(['Cash', 'Easypaisa', 'JazzCash', 'Bank'] as PaymentMethod[]).map((method) => {
            const isSelected = paymentMethod === method;
            return (
              <TouchableOpacity
                key={method}
                onPress={() => setPaymentMethod(method)}
                style={[
                  styles.paymentChip,
                  isSelected && styles.paymentChipSelected,
                ]}
              >
                <Text
                  style={[
                    styles.paymentChipText,
                    isSelected && styles.paymentChipTextSelected,
                  ]}
                >
                  {method}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.footer}>
        <CustomButton title={strings.saveOrder} onPress={handleSaveOrder} />
      </View>
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
    paddingBottom: 30,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  customerSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  customerChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 8,
    marginBottom: 8,
  },
  customerChipSelected: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  customerChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  customerChipTextSelected: {
    color: '#FFFFFF',
  },
  customerInfoCard: {
    backgroundColor: THEME.colors.primaryLight,
    borderRadius: THEME.metrics.cardRadius,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  custName: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.colors.primary,
  },
  custPhone: {
    fontSize: 12,
    color: '#4B5563',
    marginTop: 2,
  },
  custDue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#DC2626',
  },
  productsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addProductBtn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: THEME.colors.primaryLight,
    borderRadius: 14,
  },
  addProductText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.primary,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: THEME.metrics.cardRadius,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  productCalculation: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  trashBtn: {
    padding: 8,
  },
  calculationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: THEME.metrics.cardRadius,
    padding: 16,
    marginVertical: 14,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  calcRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  calcLabel: {
    fontSize: 14,
    color: THEME.colors.textSecondary,
  },
  calcValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 10,
    marginTop: 4,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  totalValue: {
    fontSize: 17,
    fontWeight: '800',
    color: THEME.colors.primary,
  },
  paymentMethodRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  paymentChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 8,
    marginBottom: 8,
  },
  paymentChipSelected: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  paymentChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  paymentChipTextSelected: {
    color: '#FFFFFF',
  },
  footer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
});
