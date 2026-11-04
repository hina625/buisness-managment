import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { AppHeader } from '../components/AppHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import { useApp } from '../context/AppContext';
import { parseWhatsAppOrderText } from '../utils/whatsappParser';

export const AddOrderScreen = ({ navigation }) => {
  const { strings, customers, products, addOrder, addCustomer } = useApp();

  const [selectedCustomerId, setSelectedCustomerId] = useState(
    customers.length > 0 ? customers[0].id : ''
  );
  const [waModalVisible, setWaModalVisible] = useState(false);
  const [waText, setWaText] = useState('');

  const [orderItems, setOrderItems] = useState(
    products.length > 0
      ? [
          {
            productId: products[0].id,
            name: products[0].name,
            price: products[0].price,
            quantity: 1,
          },
        ]
      : []
  );

  const [deliveryCharges, setDeliveryCharges] = useState(100);
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalAmount = subtotal + deliveryCharges;

  const handleApplyWhatsAppText = () => {
    if (!waText.trim()) {
      Alert.alert('Required', 'Please paste the WhatsApp order text.');
      return;
    }
    const parsed = parseWhatsAppOrderText(waText, products);
    if (!parsed) {
      Alert.alert('Error', 'Could not parse text.');
      return;
    }

    // Customer setup
    let cust = customers.find((c) => c.phone.includes(parsed.customerPhone.slice(-7)));
    if (!cust) {
      cust = addCustomer(parsed.customerName, parsed.customerPhone, 0);
    }
    setSelectedCustomerId(cust.id);

    // Items setup
    if (parsed.items && parsed.items.length > 0) {
      setOrderItems(parsed.items);
    }

    setWaModalVisible(false);
    setWaText('');
    Alert.alert('Success', 'WhatsApp order details applied to form!');
  };

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
        {/* WhatsApp Smart Paste Quick Banner */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setWaModalVisible(true)}
          style={styles.waSmartBanner}
        >
          <View style={styles.waSmartBannerLeft}>
            <View style={styles.waBannerIcon}>
              <Ionicons name="logo-whatsapp" size={20} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.waBannerTitle}>Paste WhatsApp Order</Text>
              <Text style={styles.waBannerSub}>Auto-fill customer & items from message</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#059669" />
        </TouchableOpacity>

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

      {/* WhatsApp Smart Paste Modal */}
      <Modal visible={waModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeaderRow}>
              <View style={styles.waModalIcon}>
                <Ionicons name="logo-whatsapp" size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.modalTitle}>Paste WhatsApp Order</Text>
            </View>

            <Text style={styles.modalSub}>
              WhatsApp se copy kiya hua message yahan paste karein:
            </Text>

            <TextInput
              style={styles.modalTextArea}
              multiline
              numberOfLines={5}
              placeholder="e.g. 2x Wireless Mouse, Name: Ali Khan, Phone: 03001234567"
              value={waText}
              onChangeText={setWaText}
              placeholderTextColor="#9CA3AF"
            />

            <View style={styles.modalBtnRow}>
              <PrimaryButton
                title="Cancel"
                variant="outline"
                style={{ flex: 1, marginRight: spacing.sm }}
                onPress={() => setWaModalVisible(false)}
              />
              <PrimaryButton
                title="Auto Fill"
                style={{ flex: 1, marginLeft: spacing.sm }}
                onPress={handleApplyWhatsAppText}
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
  waSmartBanner: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    borderRadius: spacing.cardRadius,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  waSmartBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  waBannerIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#25D366',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  waBannerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#065F46',
  },
  waBannerSub: {
    fontSize: 11,
    color: '#047857',
    marginTop: 2,
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
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  waModalIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#25D366',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  modalSub: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 18,
  },
  modalTextArea: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: spacing.cardRadius,
    padding: 12,
    minHeight: 100,
    fontSize: 14,
    color: colors.textPrimary,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  modalBtnRow: {
    flexDirection: 'row',
  },
});
