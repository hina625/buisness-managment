import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

export const AppHeader = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightComponent,
  style,
}) => {
  return (
    <View style={[styles.headerContainer, style]}>
      <View style={styles.leftContainer}>
        {showBack && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onBack}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        )}
        <View>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          <Text style={styles.title}>{title}</Text>
        </View>
      </View>

      {rightComponent ? (
        <View style={styles.rightContainer}>{rightComponent}</View>
      ) : (
        showBack && <View style={{ width: 24 }} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: 52,
    paddingBottom: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: spacing.md,
  },
  subtitle: {
    ...typography.subtitle,
    fontSize: 13,
    marginBottom: 2,
  },
  title: {
    ...typography.h2,
    fontSize: 20,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
