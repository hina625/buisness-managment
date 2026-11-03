import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../constants/theme';
import { CustomButton } from '../../components/CustomButton';
import { useApp } from '../../context/AppContext';

export const LanguageSelectScreen = ({ navigation }: { navigation: any }) => {
  const { language, setLanguage, strings } = useApp();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons name="globe-outline" size={48} color={THEME.colors.primary} />
        </View>

        <Text style={styles.title}>{strings.selectLanguage}</Text>
        <Text style={styles.subtitle}>{strings.chooseLanguageSub}</Text>

        {/* English option */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setLanguage('en')}
          style={[
            styles.optionCard,
            language === 'en' && styles.selectedOptionCard,
          ]}
        >
          <View style={styles.row}>
            <Ionicons
              name="language-outline"
              size={24}
              color={language === 'en' ? THEME.colors.primary : '#6B7280'}
            />
            <Text
              style={[
                styles.optionText,
                language === 'en' && styles.selectedOptionText,
              ]}
            >
              English
            </Text>
          </View>
          {language === 'en' && (
            <Ionicons name="checkmark-circle" size={24} color={THEME.colors.primary} />
          )}
        </TouchableOpacity>

        {/* Urdu option */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setLanguage('ur')}
          style={[
            styles.optionCard,
            language === 'ur' && styles.selectedOptionCard,
          ]}
        >
          <View style={styles.row}>
            <Ionicons
              name="globe-outline"
              size={24}
              color={language === 'ur' ? THEME.colors.primary : '#6B7280'}
            />
            <Text
              style={[
                styles.optionText,
                styles.urduFont,
                language === 'ur' && styles.selectedOptionText,
              ]}
            >
              اردو (Urdu)
            </Text>
          </View>
          {language === 'ur' && (
            <Ionicons name="checkmark-circle" size={24} color={THEME.colors.primary} />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <CustomButton
          title={`${strings.continue} →`}
          onPress={() => navigation.navigate('Login')}
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
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: THEME.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: THEME.colors.textSecondary,
    marginBottom: 36,
  },
  optionCard: {
    width: '100%',
    height: 64,
    borderRadius: THEME.metrics.cardRadius,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  selectedOptionCard: {
    borderColor: THEME.colors.primary,
    backgroundColor: THEME.colors.primaryLight,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 14,
  },
  selectedOptionText: {
    color: THEME.colors.primary,
    fontWeight: '700',
  },
  urduFont: {
    fontSize: 18,
  },
  footer: {
    width: '100%',
  },
});
