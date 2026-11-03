import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { OrderStatus } from '../types';
import { THEME } from '../constants/theme';

interface StatusBadgeProps {
  status: OrderStatus | 'Paid';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let bgColor = THEME.colors.badgePending;
  let textColor = THEME.colors.badgePendingText;

  if (status === 'Delivered' || status === 'Paid') {
    bgColor = THEME.colors.badgeDelivered;
    textColor = THEME.colors.badgeDeliveredText;
  } else if (status === 'Cancelled') {
    bgColor = THEME.colors.badgeCancelled;
    textColor = THEME.colors.badgeCancelledText;
  }

  return (
    <View style={[styles.badge, { backgroundColor: bgColor }]}>
      <Text style={[styles.badgeText, { color: textColor }]}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
