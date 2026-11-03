import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/StatusBadge';
import { CustomButton } from '../../components/CustomButton';
import { Order } from '../../types';
import { generateOrderInvoicePDF } from '../../utils/pdfGenerator';

export const OrderDetailScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  const { order }: { order: Order } = route.params;
  const { strings, updateOrderStatus, orders, businessProfile } = useApp();
  const [pdfLoading, setPdfLoading] = useState(false);

  const currentOrder = orders.find((o) => o.id === order.id) || order;

  const handleToggleStatus = () => {
    const nextStatus = currentOrder.status === 'Pending' ? 'Delivered' : 'Pending';
    updateOrderStatus(currentOrder.id, nextStatus);
    Alert.alert('Status Updated', `Order marked as ${nextStatus}`);
  };

  const handleShareReceipt = async () => {
    const receiptText = `*${businessProfile.name} - Receipt*\n` +
      `Order: ${currentOrder.orderNumber}\n` +
      `Customer: ${currentOrder.customerName}\n` +
      `Phone: ${currentOrder.customerPhone}\n\n` +
      `Items:\n` +
      currentOrder.items.map((i) => `• ${i.name} x ${i.quantity} = Rs. ${i.price * i.quantity}`).join('\n') +
      `\n\nDelivery: Rs. ${currentOrder.deliveryCharges}\n` +
      `*Total: Rs. ${currentOrder.totalAmount}*\n` +
      `Status: ${currentOrder.status}\n\n` +
      `Thank you for your business!`;

    try {
      await Share.share({
        message: receiptText,
      });
    } catch (error) {
      console.log('Share error', error);
    }
  };

  const handlePrintPDF = async () => {
    setPdfLoading(true);
    await generateOrderInvoicePDF(currentOrder, businessProfile);
    setPdfLoading(false);
  };

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
        <Text style={styles.headerTitle}>Order {currentOrder.orderNumber}</Text>
        <StatusBadge status={currentOrder.status} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Customer Info Card */}
        <View style={styles.customerCard}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={20} color={THEME.colors.primary} />
          </View>
          <View style={styles.customerDetails}>
            <Text style={styles.custName}>{currentOrder.customerName}</Text>
            <View style={styles.phoneRow}>
              <Ionicons name="call-outline" size={14} color="#6B7280" />
              <Text style={styles.custPhone}>{currentOrder.customerPhone}</Text>
            </View>
          </View>
        </View>

        {/* Items Section */}
        <Text style={styles.sectionTitle}>{strings.items}</Text>
        <View style={styles.itemsCard}>
          {currentOrder.items.map((item, idx) => (
            <View key={idx} style={styles.itemRow}>
              <View>
                <Text style={styles.itemName}>• {item.name}</Text>
                <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
              </View>
              <Text style={styles.itemPrice}>
                Rs. {(item.price * item.quantity).toLocaleString()}
              </Text>
            </View>
          ))}

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{strings.deliveryCharges}</Text>
            <Text style={styles.summaryVal}>Rs. {currentOrder.deliveryCharges.toLocaleString()}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalVal}>Rs. {currentOrder.totalAmount.toLocaleString()}</Text>
          </View>
        </View>

        {/* Payment mode */}
        <View style={styles.paymentMethodCard}>
          <Text style={styles.paymentMethodLabel}>Payment Mode:</Text>
          <Text style={styles.paymentMethodVal}>{currentOrder.paymentMethod}</Text>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <View style={styles.btnRow}>
          <CustomButton
            title={currentOrder.status === 'Pending' ? strings.markDelivered : 'Set to Pending'}
            variant="outline"
            onPress={handleToggleStatus}
            style={{ flex: 1, marginRight: 8 }}
          />
          <CustomButton
            title="Download PDF"
            variant="secondary"
            loading={pdfLoading}
            icon={<Ionicons name="document-text-outline" size={18} color={THEME.colors.primary} />}
            onPress={handlePrintPDF}
            style={{ flex: 1, marginLeft: 8 }}
          />
        </View>
        <CustomButton
          title={strings.shareReceipt}
          onPress={handleShareReceipt}
          icon={<Ionicons name="logo-whatsapp" size={20} color="#FFFFFF" />}
        />
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
  customerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: THEME.metrics.cardRadius,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: THEME.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  customerDetails: {
    flex: 1,
  },
  custName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  custPhone: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 10,
  },
  itemsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: THEME.metrics.cardRadius,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 20,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  itemQty: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    marginTop: 2,
    marginLeft: 10,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: THEME.colors.textSecondary,
  },
  summaryVal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  totalLabel: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
  },
  totalVal: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.colors.primary,
  },
  paymentMethodCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: THEME.metrics.cardRadius,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  paymentMethodLabel: {
    fontSize: 14,
    color: THEME.colors.textSecondary,
  },
  paymentMethodVal: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.primary,
  },
  footer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  btnRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
});
