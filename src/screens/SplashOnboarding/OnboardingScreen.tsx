import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../constants/theme';
import { CustomButton } from '../../components/CustomButton';
import { useApp } from '../../context/AppContext';

export const OnboardingScreen = ({ navigation }: { navigation: any }) => {
  const { strings } = useApp();

  return (
    <View style={styles.container}>
      <View style={styles.heroBox}>
        <View style={styles.illustrationCard}>
          <Ionicons name="storefront" size={80} color={THEME.colors.primary} />
          <View style={styles.miniBadge}>
            <Ionicons name="shield-checkmark" size={20} color="#10B981" />
          </View>
        </View>

        <Text style={styles.heading}>{strings.onboardingTitle}</Text>
        <Text style={styles.subheading}>{strings.onboardingSub}</Text>

        {/* Carousel indicators */}
        <View style={styles.dotsRow}>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>

      <View style={styles.footer}>
        <CustomButton
          title={strings.getStarted}
          onPress={() => navigation.navigate('LanguageSelect')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  heroBox: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  illustrationCard: {
    width: 140,
    height: 140,
    borderRadius: 32,
    backgroundColor: THEME.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  miniBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    elevation: 2,
  },
  heading: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 14,
    lineHeight: 32,
  },
  subheading: {
    fontSize: 15,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
    marginBottom: 36,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 4,
  },
  activeDot: {
    width: 24,
    backgroundColor: THEME.colors.primary,
  },
  footer: {
    width: '100%',
  },
});
