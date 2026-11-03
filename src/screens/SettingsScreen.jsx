import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { AppHeader } from '../components/AppHeader';
import { ConfirmModal } from '../components/ConfirmModal';
import { useApp } from '../context/AppContext';

export const SettingsScreen = ({ navigation }) => {
  const { strings, language, setLanguage, businessProfile } = useApp();
  const [backupModalVisible, setBackupModalVisible] = useState(false);

  const handleToggleLanguage = () => {
    const nextLang = language === 'en' ? 'ur' : 'en';
    setLanguage(nextLang);
    Alert.alert('Language Updated', `Switched to ${nextLang === 'ur' ? 'اردو' : 'English'}`);
  };

  const handleExportPDF = () => {
    Alert.alert('PDF Exported', 'Monthly sales and Khata ledger saved to Downloads.');
  };

  const settingsList = [
    {
      id: 'inv',
      title: strings.inventory,
      subtitle: 'Manage products & stock levels',
      icon: 'cube-outline',
      onPress: () => navigation.navigate('Inventory'),
    },
    {
      id: 'rep',
      title: strings.reports,
      subtitle: 'Sales analytics & weekly charts',
      icon: 'bar-chart-outline',
      onPress: () => navigation.navigate('Reports'),
    },
    {
      id: 'biz',
      title: strings.businessProfile,
      subtitle: `${businessProfile.name} • ${businessProfile.phone}`,
      icon: 'business-outline',
      onPress: () => Alert.alert('Profile', `${businessProfile.name}\n${businessProfile.phone}`),
    },
    {
      id: 'lang',
      title: strings.language,
      subtitle: language === 'en' ? 'English (Tap to switch)' : 'اردو (Urdu)',
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
      subtitle: 'Backup database to cloud',
      icon: 'cloud-upload-outline',
      onPress: () => setBackupModalVisible(true),
    },
    {
      id: 'export',
      title: strings.exportReports,
      subtitle: 'Download monthly PDF report',
      icon: 'download-outline',
      onPress: handleExportPDF,
    },
    {
      id: 'about',
      title: strings.aboutApp,
      subtitle: 'Business Manager v1.0.0',
      icon: 'information-circle-outline',
      onPress: () => Alert.alert('Business Manager', 'Designed for local Pakistani businesses.\nVersion 1.0.0'),
    },
  ];

  return (
    <View style={styles.container}>
      <AppHeader
        title={strings.settings}
        showBack
        onBack={() => navigation.goBack()}
      />

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
                  <Ionicons name={item.icon} size={22} color={colors.primary} />
                </View>
                <View>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Reusable ConfirmModal Example */}
      <ConfirmModal
        visible={backupModalVisible}
        title="Backup Business Data"
        message="Do you want to sync all customers, orders, and khata records to the secure cloud?"
        confirmText="Start Backup"
        onConfirm={() => {
          setBackupModalVisible(false);
          setTimeout(() => Alert.alert('Success', 'Backup completed successfully!'), 300);
        }}
        onCancel={() => setBackupModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: spacing.cardRadius,
    borderWidth: 1,
    borderColor: colors.borderLight,
    overflow: 'hidden',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  itemSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
});
