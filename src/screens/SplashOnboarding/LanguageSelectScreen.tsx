import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../constants/theme';
import { CustomButton } from '../../components/CustomButton';
import { useApp } from '../../context/AppContext';
import { Language } from '../../types';

interface LangOption {
  id: Language;
  title: string;
  nativeTitle: string;
  flag: string;
  sub: string;
}

const LANGUAGES: LangOption[] = [
  { id: 'en', title: 'English', nativeTitle: 'English', flag: '🇬🇧', sub: 'Default' },
  { id: 'ur', title: 'Urdu', nativeTitle: 'اردو', flag: '🇵🇰', sub: 'قومی زبان' },
  { id: 'pa', title: 'Punjabi', nativeTitle: 'پنجابی', flag: '🌾', sub: 'پنجاب' },
  { id: 'sd', title: 'Sindhi', nativeTitle: 'سنڌي', flag: '🏺', sub: 'سنڌ' },
  { id: 'ps', title: 'Pashto', nativeTitle: 'پښتو', flag: '⛰️', sub: 'خیبر پختونخوا' },
  { id: 'ar', title: 'Arabic', nativeTitle: 'العربية', flag: '🇸🇦', sub: 'الشرق الأوسط' },
];

export const LanguageSelectScreen = ({ navigation }: { navigation: any }) => {
  const { language, setLanguage, strings } = useApp();
  const [search, setSearch] = useState('');

  const filtered = LANGUAGES.filter(
    (l) =>
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.nativeTitle.includes(search)
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerArea}>
        <View style={styles.iconCircle}>
          <Ionicons name="globe-outline" size={40} color={THEME.colors.primary} />
        </View>
        <Text style={styles.title}>{strings.selectLanguage}</Text>
        <Text style={styles.subtitle}>{strings.chooseLanguageSub}</Text>

        {/* Quick Search */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#9CA3AF" style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Search language..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.langList} showsVerticalScrollIndicator={false}>
        {filtered.map((item) => {
          const isSelected = language === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              onPress={() => setLanguage(item.id)}
              style={[
                styles.optionCard,
                isSelected && styles.selectedOptionCard,
              ]}
            >
              <View style={styles.leftRow}>
                <Text style={styles.flagIcon}>{item.flag}</Text>
                <View>
                  <Text style={[styles.nativeText, isSelected && styles.selectedText]}>
                    {item.nativeTitle}
                  </Text>
                  <Text style={styles.englishText}>
                    {item.title} • {item.sub}
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.checkCircle,
                  isSelected && styles.selectedCheckCircle,
                ]}
              >
                {isSelected ? (
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                ) : null}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

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
    paddingTop: 54,
  },
  headerArea: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: THEME.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: THEME.colors.textSecondary,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: THEME.metrics.cardRadius,
    paddingHorizontal: 14,
    height: 44,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    width: '100%',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },
  langList: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: THEME.metrics.cardRadius,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  selectedOptionCard: {
    borderColor: THEME.colors.primary,
    backgroundColor: THEME.colors.primaryLight,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagIcon: {
    fontSize: 26,
    marginRight: 14,
  },
  nativeText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  englishText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  selectedText: {
    color: THEME.colors.primary,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCheckCircle: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
});
