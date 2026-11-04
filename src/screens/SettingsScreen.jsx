import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { AppHeader } from '../components/AppHeader';
import { ConfirmModal } from '../components/ConfirmModal';
import { useApp } from '../context/AppContext';

export const SettingsScreen = ({ navigation }) => {
  const { strings, language, businessProfile, currentUser, logoutUser } = useApp();
  const [backupModalVisible, setBackupModalVisible] = useState(false);

  const handleShareShopCode = async () => {
    try {
      await Share.share({
        message: `Join our shop "${businessProfile.name}" on Business Manager app!\nUse Business Code: *${businessProfile.code}*\nOwner: ${businessProfile.ownerName || businessProfile.name}`,
      });
    } catch (e) {
      console.log('Share error', e);
    }
  };

  const handleExportPDF = () => {
    Alert.alert('PDF Exported', 'Monthly sales and Khata ledger saved to Downloads.');
  };

  const settingsList = [
    {
      id: 'wa-sync',
      title: 'WhatsApp Business Sync',
      subtitle: 'Cloud API & smart paste WhatsApp orders',
      icon: 'logo-whatsapp',
      onPress: () => navigation.navigate('WhatsAppSync'),
    },
    {
      id: 'biz-setup',
      title: 'Switch / Setup Business',
      subtitle: `${businessProfile?.name || 'Setup Business'} ${businessProfile?.code ? `(Code: ${businessProfile.code})` : ''}`,
      icon: 'storefront-outline',
      onPress: () => navigation.navigate('BusinessSetup'),
    },
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
      id: 'lang',
      title: strings.language,
      subtitle: `${language.toUpperCase()} (Tap to choose from 6 languages)`,
      icon: 'language-outline',
      onPress: () => navigation.navigate('LanguageSelect'),
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
      subtitle: 'Business Manager v1.2.0',
      icon: 'information-circle-outline',
      onPress: () => Alert.alert('Business Manager', 'Designed for local Pakistani businesses.\nVersion 1.2.0'),
    },
    {
      id: 'logout',
      title: 'Log Out',
      subtitle: currentUser?.phone ? `Signed in as ${currentUser.phone}` : 'Sign out of this device',
      icon: 'log-out-outline',
      onPress: () => {
        Alert.alert('Log Out', 'Are you sure you want to log out?', [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Log Out',
            style: 'destructive',
            onPress: () => {
              logoutUser();
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            },
          },
        ]);
      },
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
        {/* Business & Owner Info Banner */}
        <View style={styles.businessCard}>
          <View style={styles.bizHeaderRow}>
            <View style={styles.bizIconBadge}>
              <Ionicons name="storefront" size={26} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.bizName}>{businessProfile?.name || 'My Business'}</Text>
              <Text style={styles.bizSub}>{businessProfile?.category || 'Retail Store'}{businessProfile?.address ? ` • ${businessProfile.address}` : ''}</Text>
            </View>
          </View>

          {/* Shop Code & Share */}
          <View style={styles.codeRow}>
            <View>
              <Text style={styles.codeLabel}>SHOP INVITE CODE</Text>
              <Text style={styles.codeValue}>{businessProfile?.code || 'NOT SET'}</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleShareShopCode}
              style={styles.shareCodeBtn}
            >
              <Ionicons name="share-social-outline" size={16} color={colors.primary} />
              <Text style={styles.shareCodeBtnText}>Share Code</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Settings Menu List */}
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

      {/* Reusable ConfirmModal */}
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
  businessCard: {
    backgroundColor: colors.primary,
    borderRadius: spacing.cardRadius,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    elevation: 3,
  },
  bizHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  bizIconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  bizName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  bizSub: {
    fontSize: 12,
    color: '#A7F3D0',
    marginTop: 2,
  },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  codeLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#A7F3D0',
    letterSpacing: 1,
  },
  codeValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1.5,
    marginTop: 2,
  },
  shareCodeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  shareCodeBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    marginLeft: 4,
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
