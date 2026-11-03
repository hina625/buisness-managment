import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

export const StatCard = ({
  title,
  value,
  icon,
  iconBgColor = colors.primaryLight,
  iconColor = colors.primary,
  trend,
  onPress,
  isFeatured = false, // When true, renders like the Today's Sales large emerald card
  style,
}) => {
  if (isFeatured) {
    return (
      <View style={[styles.featuredCard, style]}>
        <View style={styles.featuredLeft}>
          <Text style={styles.featuredLabel}>{title}</Text>
          <Text style={styles.featuredValue}>{value}</Text>
          {trend ? (
            <View style={styles.trendRow}>
              <Ionicons name="trending-up" size={14} color="#A7F3D0" />
              <Text style={styles.trendText}>{trend}</Text>
            </View>
          ) : null}
        </View>

        {/* Decorative bar graphic */}
        <View style={styles.barsContainer}>
          <View style={[styles.bar, { height: 16 }]} />
          <View style={[styles.bar, { height: 26 }]} />
          <View style={[styles.bar, { height: 20 }]} />
          <View style={[styles.bar, { height: 38 }]} />
          <View style={[styles.bar, { height: 48, backgroundColor: '#10B981' }]} />
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.7 : 1}
      onPress={onPress}
      style={[styles.compactCard, style]}
    >
      <View style={[styles.iconWrapper, { backgroundColor: iconBgColor }]}>
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>
      <Text style={styles.compactValue} numberOfLines={1}>{value}</Text>
      <Text style={styles.compactTitle} numberOfLines={1}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  featuredCard: {
    backgroundColor: '#034732',
    borderRadius: spacing.cardRadius,
    padding: spacing.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  featuredLeft: {
    flex: 1,
  },
  featuredLabel: {
    fontSize: 13,
    color: '#A7F3D0',
    fontWeight: '500',
    marginBottom: 4,
  },
  featuredValue: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 12,
    color: '#A7F3D0',
    marginLeft: 4,
    fontWeight: '500',
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 50,
  },
  bar: {
    width: 8,
    backgroundColor: '#059669',
    borderRadius: 4,
    marginLeft: 5,
  },
  compactCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: spacing.cardRadius,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: colors.borderLight,
    elevation: 1,
  },
  iconWrapper: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  compactValue: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  compactTitle: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});
