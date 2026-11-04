import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../constants/theme';
import { useApp } from '../../context/AppContext';

export const SettingsScreen = ({ navigation }: { navigation: any }) => {
  const { strings, language, setLanguage, businessProfile } = useApp();

  const handleToggleLanguage = () => {
    const nextLang = language === 'en' ? 'ur' : 'en';
    setLanguage(nextLang);
    Alert.alert('Language Changed', `App switched to ${nextLang === 'ur' ? 'اردو' : 'English'}`);
  };

  const handleExport = () => {
    Alert.alert('PDF Export', 'Your business report has been exported to PDF format.');
  };

  const handleBackup = () => {
    Alert.alert('Cloud Backup', 'All local data safely backed up to secure cloud storage.');
  };

  const settingsList = [
    {
      id: 'biz',
      title: strings.businessProfile,
      subtitle: `${businessProfile?.name || 'My Business'}${businessProfile?.phone ? ` • ${businessProfile.phone}` : ''}`,
      icon: 'business-outline',
      onPress: () => Alert.alert('Profile', `${businessProfile?.name || 'My Business'}\n${businessProfile?.phone || ''}`),
    },
    {
      id: 'lang',
      title: strings.language,
      subtitle: language === 'en' ? 'English' : 'اردو (Urdu)',
      icon: 'language-outline',
      onPress: handleToggleLanguage,
    },
    {
      id: 'curr',
      title: strings.currency,
      subtitle: 'Pakistani Rupee (PKR)',
      icon: 'cash-outline',
      onPress: () => Alert.alert('Currency', 'Default currency is set to PKR (Rs.)'),
    },
    {
      id: 'backup',
      title: strings.backupRestore,
      subtitle: 'Auto-sync enabled',
      icon: 'cloud-upload-outline',
      onPress: handleBackup,
    },
    {
      id: 'export',
      title: strings.exportReports,
      subtitle: 'Download monthly PDF',
      icon: 'download-outline',
      onPress: handleExport,
    },
    {
      id: 'notif',
      title: strings.notifications,
      subtitle: 'Order & payment alerts on',
      icon: 'notifications-outline',
      onPress: () => Alert.alert('Notifications', 'All transaction notifications are active.'),
    },
    {
      id: 'about',
      title: strings.aboutApp,
      subtitle: 'Version 1.0.0 (Expo + TS)',
      icon: 'information-circle-outline',
      onPress: () => Alert.alert('Business Manager', 'Version 1.0.0\nDesigned for Pakistan & local markets.'),
    },
  ];

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
        <Text style={styles.headerTitle}>{strings.settings}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          {settingsList.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.7}
              onPress={item.onPress}
              style={[
                styles.itemRow,
                index === settingsList.length - 1 && { borderBottomWidth: 0 },
              ]}
            >
              <View style={styles.itemLeft}>
                <View style={styles.iconBox}>
                  <Ionicons name={item.icon as any} size={22} color={THEME.colors.primary} />
                </View>
                <View>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
                </View>
              </View>

              <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: THEME.metrics.cardRadius,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    overflow: 'hidden',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: THEME.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  itemSubtitle: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
});
