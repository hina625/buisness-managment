import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export const StatusBadge = ({ status }) => {
  let bgColor = colors.badgePendingBg;
  let textColor = colors.badgePendingText;

  if (status === 'Delivered' || status === 'Paid' || status === 'Completed') {
    bgColor = colors.badgeDeliveredBg;
    textColor = colors.badgeDeliveredText;
  } else if (status === 'Cancelled') {
    bgColor = colors.badgeCancelledBg;
    textColor = colors.badgeCancelledText;
  }

  return (
    <View style={[styles.badge, { backgroundColor: bgColor }]}>
      <Text style={[styles.text, { color: textColor }]}>{status}</Text>
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
  text: {
    fontSize: 12,
    fontWeight: '700',
  },
});
