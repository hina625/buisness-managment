import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export const CustomerCard = ({ customer, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.card}
    >
      <View style={styles.left}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={20} color={colors.primary} />
        </View>
        <View>
          <Text style={styles.name}>{customer.name}</Text>
          <Text style={styles.subtext}>
            {customer.totalOrders} orders {customer.phone ? `• ${customer.phone}` : ''}
          </Text>
        </View>
      </View>

      <View style={styles.right}>
        <Text style={styles.due}>Rs. {customer.totalDue.toLocaleString()}</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    elevation: 1,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  subtext: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  right: {
    alignItems: 'flex-end',
  },
  due: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primary,
  },
});
