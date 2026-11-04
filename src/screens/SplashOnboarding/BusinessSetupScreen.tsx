import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../constants/theme';
import { CustomButton } from '../../components/CustomButton';
import { useApp } from '../../context/AppContext';

export const BusinessSetupScreen = ({ navigation }: { navigation: any }) => {
  const { strings, createBusiness, joinBusinessWithCode, currentUser } = useApp();
  
  const [mode, setMode] = useState<'create' | 'join'>('create');
  
  // Create New Business Fields
  const [shopName, setShopName] = useState('');
  const [category, setCategory] = useState('Retail General Store');
  const [city, setCity] = useState('');
  
  // Join Existing Business Field
  const [joinCode, setJoinCode] = useState('');
  
  const [loading, setLoading] = useState(false);

  const categories = [
    'Retail General Store',
    'Mobile & Electronics',
    'Clothing & Footwear',
    'Pharmacy / Medical',
    'Wholesale Dealer',
    'Hardware & Sanitary',
  ];

  const handleConnectBusiness = async () => {
    if (mode === 'create') {
      if (!shopName.trim()) {
        Alert.alert('Required', 'Please enter your Business or Shop name.');
        return;
      }
      setLoading(true);
      try {
        const biz = await createBusiness(shopName.trim(), category, city.trim());
        setLoading(false);
        Alert.alert(
          'Shop Connected! 🎉',
          `Your business "${biz.name}" is now active in PostgreSQL.\nYour Business Code is: ${biz.code}\n\n(Share this code with staff to let them join).`,
          [{ text: 'Go to Dashboard', onPress: () => navigation.replace('MainTabs') }]
        );
      } catch (err: any) {
        setLoading(false);
        Alert.alert('Error', 'Could not save business in PostgreSQL');
      }
    } else {
      if (!joinCode.trim()) {
        Alert.alert('Required', 'Please enter a 6-digit Business Code.');
        return;
      }
      setLoading(true);
      try {
        const joined = await joinBusinessWithCode(joinCode.trim());
        setLoading(false);
        if (joined) {
          Alert.alert('Joined Shop! 🎉', 'You are now connected to the business.', [
            { text: 'Go to Dashboard', onPress: () => navigation.replace('MainTabs') },
          ]);
        } else {
          Alert.alert('Invalid Code', 'Shop code not found in PostgreSQL database.');
        }
      } catch (err: any) {
        setLoading(false);
        Alert.alert('Error', 'Could not join shop');
      }
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerArea}>
          <View style={styles.iconCircle}>
            <Ionicons name="storefront" size={32} color={THEME.colors.primary} />
          </View>
          <Text style={styles.title}>{strings.setupBusiness}</Text>
          <Text style={styles.subtitle}>{strings.setupBusinessSub}</Text>
          {currentUser && (
            <View style={styles.userBadge}>
              <Text style={styles.userBadgeText}>Owner: {currentUser.name}</Text>
            </View>
          )}
        </View>

        {/* Mode Selector Tabs (Create vs Join) */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setMode('create')}
            style={[styles.tabItem, mode === 'create' && styles.activeTabItem]}
          >
            <Text style={[styles.tabText, mode === 'create' && styles.activeTabText]}>
              Create Business
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setMode('join')}
            style={[styles.tabItem, mode === 'join' && styles.activeTabItem]}
          >
            <Text style={[styles.tabText, mode === 'join' && styles.activeTabText]}>
              Join Existing
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab 1: Create New Business (Owner) */}
        {mode === 'create' ? (
          <View style={styles.formArea}>
            <Text style={styles.inputLabel}>{strings.businessName}</Text>
            <View style={styles.inputRow}>
              <Ionicons name="business-outline" size={20} color="#9CA3AF" style={{ marginRight: 10 }} />
              <TextInput
                style={styles.input}
                value={shopName}
                onChangeText={setShopName}
                placeholder={strings.businessNamePlaceholder}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <Text style={styles.inputLabel}>{strings.businessCategory}</Text>
            <View style={styles.categoryChipsRow}>
              {categories.map((cat) => {
                const isSelected = category === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setCategory(cat)}
                    style={[
                      styles.categoryChip,
                      isSelected && styles.categoryChipSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        isSelected && styles.categoryChipTextSelected,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.inputLabel}>{strings.businessCity}</Text>
            <View style={styles.inputRow}>
              <Ionicons name="location-outline" size={20} color="#9CA3AF" style={{ marginRight: 10 }} />
              <TextInput
                style={styles.input}
                value={city}
                onChangeText={setCity}
                placeholder={strings.businessCityPlaceholder}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Auto Code Preview Banner */}
            <View style={styles.codePreviewBanner}>
              <Ionicons name="key-outline" size={20} color={THEME.colors.primary} />
              <Text style={styles.codePreviewText}>
                Your shop will get a unique code (e.g. <Text style={{ fontWeight: '800' }}>SHOP-123</Text>) for staff accounts.
              </Text>
            </View>
          </View>
        ) : (
          /* Tab 2: Join Existing Business (Staff/Partner) */
          <View style={styles.formArea}>
            <Text style={styles.inputLabel}>{strings.businessCode}</Text>
            <View style={styles.inputRow}>
              <Ionicons name="qr-code-outline" size={20} color="#9CA3AF" style={{ marginRight: 10 }} />
              <TextInput
                style={[styles.input, { textTransform: 'uppercase', letterSpacing: 2, fontWeight: '700' }]}
                value={joinCode}
                onChangeText={setJoinCode}
                placeholder="e.g. AZHAR-786"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="characters"
              />
            </View>
            <Text style={styles.helperText}>
              Ask the business owner for their 6-digit Business Code to connect directly to their inventory and orders.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Connect Button */}
      <View style={styles.footer}>
        <CustomButton
          title={mode === 'create' ? strings.connectAndProceed : 'Join Business'}
          loading={loading}
          onPress={handleConnectBusiness}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 20,
  },
  headerArea: {
    alignItems: 'center',
    marginBottom: 20,
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
    fontSize: 13,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  userBadge: {
    marginTop: 8,
    backgroundColor: THEME.colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  userBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.primary,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    padding: 4,
    marginBottom: 24,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTabItem: {
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: THEME.colors.primary,
    fontWeight: '700',
  },
  formArea: {
    width: '100%',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    height: 52,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: THEME.metrics.cardRadius,
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 18,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },
  categoryChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 8,
    marginBottom: 8,
  },
  categoryChipSelected: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  categoryChipTextSelected: {
    color: '#FFFFFF',
  },
  codePreviewBanner: {
    backgroundColor: THEME.colors.primaryLight,
    padding: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  codePreviewText: {
    fontSize: 12,
    color: THEME.colors.primary,
    marginLeft: 10,
    flex: 1,
    lineHeight: 18,
  },
  helperText: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 20,
    marginTop: 4,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
});
