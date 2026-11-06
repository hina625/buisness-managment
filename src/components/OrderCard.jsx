import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { StatusBadge } from './StatusBadge';

export const OrderCard = ({ order, onPress, onWhatsAppPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.card}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.orderNumber}>{order.orderNumber}</Text>
          <Text style={styles.customerName}>{order.customerName}</Text>
        </View>
        <StatusBadge status={order.status} />
      </View>

      <View style={styles.footer}>
        <Text style={styles.date}>{order.date}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.amount}>Rs. {order.totalAmount.toLocaleString()}</Text>
          {onWhatsAppPress && (
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation?.();
                onWhatsAppPress(order);
              }}
              style={styles.waCardBtn}
            >
              <Ionicons name="logo-whatsapp" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: spacing.cardRadius,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  orderNumber: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 2,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 10,
  },
  date: {
    fontSize: 12,
    color: colors.textMuted,
  },
  amount: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  waCardBtn: {
    backgroundColor: '#25D366',
    borderRadius: 14,
    padding: 6,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
