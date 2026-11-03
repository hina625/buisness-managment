import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../constants/theme';
import { useApp } from '../../context/AppContext';

export const MoreScreen = ({ navigation }: { navigation: any }) => {
  const { strings, businessProfile } = useApp();

  const menuItems: {
    id: string;
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
    route: string;
    badge?: string;
  }[] = [
    {
      id: 'inv',
      title: strings.inventory,
      icon: 'cube-outline',
      route: 'Inventory',
    },
    {
      id: 'rep',
      title: strings.reports,
      icon: 'bar-chart-outline',
      route: 'Reports',
    },
    {
      id: 'set',
      title: strings.settings,
      icon: 'settings-outline',
      route: 'Settings',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{strings.more}</Text>
        <View style={styles.profileBadge}>
          <Ionicons name="person" size={18} color={THEME.colors.primary} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Business Mini Card */}
        <View style={styles.businessCard}>
          <View style={styles.businessIcon}>
            <Ionicons name="storefront" size={28} color="#FFFFFF" />
          </View>
          <View>
            <Text style={styles.bizName}>{businessProfile.name}</Text>
            <Text style={styles.bizPhone}>{businessProfile.phone}</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuList}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              onPress={() => navigation.navigate(item.route)}
              style={styles.menuRow}
            >
              <View style={styles.menuLeft}>
                <View style={styles.iconBox}>
                  <Ionicons name={item.icon} size={22} color={THEME.colors.primary} />
                </View>
                <Text style={styles.menuTitle}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
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
    paddingTop: 54,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  profileBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: THEME.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  businessCard: {
    backgroundColor: THEME.colors.primary,
    borderRadius: THEME.metrics.cardRadius,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    elevation: 3,
  },
  businessIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  bizName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  bizPhone: {
    fontSize: 13,
    color: '#A7F3D0',
    marginTop: 2,
  },
  menuList: {
    backgroundColor: '#FFFFFF',
    borderRadius: THEME.metrics.cardRadius,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuLeft: {
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
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
});
