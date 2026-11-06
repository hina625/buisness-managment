import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { AppHeader } from '../components/AppHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import { useApp } from '../context/AppContext';
import { parseWhatsAppOrderText } from '../utils/whatsappParser';
import { sendWhatsAppReceipt } from '../utils/whatsappReceipt';
import { generateOrderInvoicePDF } from '../utils/pdfGenerator';

export const AddOrderScreen = ({ navigation }) => {
  const { strings, customers, products, addOrder, addCustomer, businessProfile, orders } = useApp();

  const [selectedCustomerId, setSelectedCustomerId] = useState(
    customers.length > 0 ? customers[0].id : ''
  );
  const [waModalVisible, setWaModalVisible] = useState(false);
  const [waText, setWaText] = useState('');

  // 1-Click WhatsApp Receipt Success Modal
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [savedOrderData, setSavedOrderData] = useState(null);

  // Quick Customer Modal State
  const [custModalVisible, setCustModalVisible] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');

  // Quick Item Modal State
  const [itemModalVisible, setItemModalVisible] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemQty, setNewItemQty] = useState('1');

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
  const [saving, setSaving] = useState(false);

  const subtotal = orderItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0) * (parseInt(item.quantity, 10) || 1), 0);
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

    let cust = customers.find((c) => c.phone.includes(parsed.customerPhone.slice(-7)));
    if (!cust) {
      cust = addCustomer(parsed.customerName, parsed.customerPhone, 0);
    }
    setSelectedCustomerId(cust.id);

    if (parsed.items && parsed.items.length > 0) {
      setOrderItems(parsed.items);
    }

    setWaModalVisible(false);
    setWaText('');
    Alert.alert('Success', 'WhatsApp order details applied to form!');
  };

  const handleCreateCustomerQuick = async () => {
    if (!newCustName.trim() || !newCustPhone.trim()) {
      Alert.alert('Required', 'Please enter customer name and phone number.');
      return;
    }
    const created = await addCustomer(newCustName.trim(), newCustPhone.trim(), 0);
    setSelectedCustomerId(created.id);
    setNewCustName('');
    setNewCustPhone('');
    setCustModalVisible(false);
  };

  const handleAddItemCustom = () => {
    if (!newItemName.trim() || !newItemPrice.trim()) {
      Alert.alert('Required', 'Please enter item name and price.');
      return;
    }
    const priceNum = parseFloat(newItemPrice) || 0;
    const qtyNum = parseInt(newItemQty, 10) || 1;

    setOrderItems((prev) => [
      ...prev,
      {
        productId: `custom-${Date.now()}`,
        name: newItemName.trim(),
        price: priceNum,
        quantity: qtyNum,
      },
    ]);

    setNewItemName('');
    setNewItemPrice('');
    setNewItemQty('1');
    setItemModalVisible(false);
  };

  const handleUpdateQty = (index, delta) => {
    setOrderItems((prev) =>
      prev.map((item, i) => {
        if (i === index) {
          const newQty = Math.max(1, (parseInt(item.quantity, 10) || 1) + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (index) => {
    setOrderItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveOrder = async () => {
    const customer = customers.find((c) => c.id === selectedCustomerId);
    if (!customer) {
      Alert.alert('Customer Required', 'Please select or add a customer first.');
      return;
    }

    if (orderItems.length === 0) {
      Alert.alert('Items Required', 'Please add at least one item to this order.');
      return;
    }

    setSaving(true);
    try {
      const result = await addOrder({
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

      setSaving(false);

      const created = result?.order || {
        orderNumber: `#${1001 + orders.length}`,
        customerName: customer.name,
        customerPhone: customer.phone,
        items: orderItems,
        subtotal,
        deliveryCharges,
        totalAmount,
        paymentMethod,
        status: 'Pending',
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      };

      setSavedOrderData(created);
      setSuccessModalVisible(true);
    } catch (e) {
      setSaving(false);
      Alert.alert('Notice', 'Order saved successfully.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }
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

        {/* Customer Select Header */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionLabel}>{strings.selectCustomer}</Text>
          <TouchableOpacity onPress={() => setCustModalVisible(true)} style={styles.addInlineBtn}>
            <Ionicons name="add-circle" size={18} color={colors.primary} />
            <Text style={styles.addInlineBtnText}>+ New Customer</Text>
          </TouchableOpacity>
        </View>

        {customers.length === 0 ? (
          <TouchableOpacity
            style={styles.emptyPromptBox}
            onPress={() => setCustModalVisible(true)}
          >
            <Ionicons name="person-add-outline" size={24} color={colors.primary} />
            <Text style={styles.emptyPromptText}>No customer found. Tap here to add customer.</Text>
          </TouchableOpacity>
        ) : (
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
        )}

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
          <TouchableOpacity onPress={() => setItemModalVisible(true)} style={styles.addProductBtn}>
            <Ionicons name="add" size={16} color="#FFFFFF" style={{ marginRight: 4 }} />
            <Text style={styles.addProductText}>{strings.addProduct}</Text>
          </TouchableOpacity>
        </View>

        {orderItems.length === 0 ? (
          <TouchableOpacity
            style={styles.emptyPromptBox}
            onPress={() => setItemModalVisible(true)}
          >
            <Ionicons name="cube-outline" size={24} color={colors.primary} />
            <Text style={styles.emptyPromptText}>No items added yet. Tap here to add an item.</Text>
          </TouchableOpacity>
        ) : (
          orderItems.map((item, index) => (
            <View key={index} style={styles.productCard}>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productCalculation}>
                  Rs. {item.price.toLocaleString()} each
                </Text>
              </View>

              <View style={styles.qtyControlRow}>
                <TouchableOpacity onPress={() => handleUpdateQty(index, -1)} style={styles.qtyBtn}>
                  <Text style={styles.qtyBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.qtyNumber}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => handleUpdateQty(index, 1)} style={styles.qtyBtn}>
                  <Text style={styles.qtyBtnText}>+</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={() => handleRemoveItem(index)} style={styles.trashBtn}>
                <Ionicons name="trash-outline" size={20} color={colors.danger} />
              </TouchableOpacity>
            </View>
          ))
        )}

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
        <PrimaryButton
          title={saving ? "Saving Order..." : strings.saveOrder}
          onPress={handleSaveOrder}
          disabled={saving}
        />
      </View>

      {/* Quick Add Customer Modal */}
      <Modal visible={custModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Customer</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Customer Name (e.g. Ali Khan)"
              value={newCustName}
              onChangeText={setNewCustName}
              placeholderTextColor="#9CA3AF"
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Phone (e.g. 0300 1234567)"
              keyboardType="phone-pad"
              value={newCustPhone}
              onChangeText={setNewCustPhone}
              placeholderTextColor="#9CA3AF"
            />
            <View style={styles.modalBtnRow}>
              <PrimaryButton
                title="Cancel"
                variant="outline"
                style={{ flex: 1, marginRight: spacing.sm }}
                onPress={() => setCustModalVisible(false)}
              />
              <PrimaryButton
                title="Add & Select"
                style={{ flex: 1, marginLeft: spacing.sm }}
                onPress={handleCreateCustomerQuick}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Quick Add Item Modal */}
      <Modal visible={itemModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Product / Item</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Item Name (e.g. Wireless Mouse)"
              value={newItemName}
              onChangeText={setNewItemName}
              placeholderTextColor="#9CA3AF"
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Price (PKR)"
              keyboardType="numeric"
              value={newItemPrice}
              onChangeText={setNewItemPrice}
              placeholderTextColor="#9CA3AF"
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Quantity (Default: 1)"
              keyboardType="numeric"
              value={newItemQty}
              onChangeText={setNewItemQty}
              placeholderTextColor="#9CA3AF"
            />
            <View style={styles.modalBtnRow}>
              <PrimaryButton
                title="Cancel"
                variant="outline"
                style={{ flex: 1, marginRight: spacing.sm }}
                onPress={() => setItemModalVisible(false)}
              />
              <PrimaryButton
                title="Add to Order"
                style={{ flex: 1, marginLeft: spacing.sm }}
                onPress={handleAddItemCustom}
              />
            </View>
          </View>
        </View>
      </Modal>

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

      {/* 1-Click WhatsApp Receipt Success Modal */}
      <Modal visible={successModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { alignItems: 'center' }]}>
            <View style={styles.successCheckCircle}>
              <Ionicons name="checkmark" size={38} color="#FFFFFF" />
            </View>

            <Text style={styles.orderSuccessTitle}>Order Saved Successfully! 🎉</Text>
            <Text style={styles.orderSuccessSub}>
              {savedOrderData?.orderNumber} • {savedOrderData?.customerName}
            </Text>
            <Text style={styles.orderSuccessAmount}>
              Rs. {Number(savedOrderData?.totalAmount || 0).toLocaleString()}
            </Text>

            <View style={{ width: '100%', marginTop: 20 }}>
              {/* WhatsApp 1-Click Button */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={async () => {
                  if (savedOrderData) {
                    await sendWhatsAppReceipt(savedOrderData, businessProfile);
                  }
                }}
                style={styles.whatsAppReceiptBtn}
              >
                <Ionicons name="logo-whatsapp" size={22} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.whatsAppReceiptBtnText}>Send WhatsApp Receipt</Text>
              </TouchableOpacity>

              {/* Share PDF Button */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={async () => {
                  if (savedOrderData) {
                    await generateOrderInvoicePDF(savedOrderData, businessProfile);
                  }
                }}
                style={styles.pdfInvoiceBtn}
              >
                <Ionicons name="document-text-outline" size={20} color={colors.primary} style={{ marginRight: 8 }} />
                <Text style={styles.pdfInvoiceBtnText}>Share PDF Invoice</Text>
              </TouchableOpacity>

              {/* Done / Close Button */}
              <TouchableOpacity
                onPress={() => {
                  setSuccessModalVisible(false);
                  navigation.goBack();
                }}
                style={styles.doneBtn}
              >
                <Text style={styles.doneBtnText}>Done (View Orders)</Text>
              </TouchableOpacity>
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
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  addInlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addInlineBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  emptyPromptBox: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    borderRadius: spacing.cardRadius,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emptyPromptText: {
    marginTop: 6,
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
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
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  custDue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.danger,
  },
  productsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  addProductBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addProductText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  productCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing.cardRadius,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
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
  qtyControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 10,
  },
  qtyBtn: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  qtyBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  qtyNumber: {
    fontSize: 14,
    fontWeight: '700',
    paddingHorizontal: 6,
    color: colors.primary,
  },
  trashBtn: {
    padding: 6,
  },
  calcCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing.cardRadius,
    padding: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  calcRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
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
    borderTopColor: colors.border,
    marginTop: 6,
    paddingTop: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  totalVal: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },
  methodsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.xl,
  },
  methodChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
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
    paddingTop: spacing.sm,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  waSmartBanner: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: spacing.cardRadius,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  waSmartBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  waBannerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  waBannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#065F46',
  },
  waBannerSub: {
    fontSize: 12,
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
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  waModalIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  modalSub: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  modalInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.cardRadius,
    padding: spacing.md,
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  modalTextArea: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.cardRadius,
    padding: spacing.md,
    height: 120,
    textAlignVertical: 'top',
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  modalBtnRow: {
    flexDirection: 'row',
  },
  successCheckCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  orderSuccessTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  orderSuccessSub: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  orderSuccessAmount: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 6,
    textAlign: 'center',
  },
  whatsAppReceiptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#25D366',
    borderRadius: spacing.buttonRadius,
    paddingVertical: 14,
    marginBottom: spacing.sm,
    shadowColor: '#25D366',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  whatsAppReceiptBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  pdfInvoiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: spacing.buttonRadius,
    paddingVertical: 13,
    marginBottom: spacing.sm,
  },
  pdfInvoiceBtnText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  doneBtn: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  doneBtnText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
});
