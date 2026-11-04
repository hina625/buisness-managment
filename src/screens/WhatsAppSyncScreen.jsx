import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { AppHeader } from '../components/AppHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import { useApp } from '../context/AppContext';
import { parseWhatsAppOrderText } from '../utils/whatsappParser';

export const WhatsAppSyncScreen = ({ navigation }) => {
  const { businessProfile, products, addOrder, addCustomer, customers } = useApp();
  
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(false);
  const [rawText, setRawText] = useState('');

  const handleParseAndCreate = () => {
    if (!rawText.trim()) {
      Alert.alert('Required', 'Please paste the WhatsApp message first.');
      return;
    }

    const parsed = parseWhatsAppOrderText(rawText, products);
    if (!parsed || !parsed.items || parsed.items.length === 0) {
      Alert.alert(
        'Parsed with Note',
        `Customer: ${parsed?.customerName || 'Customer'}\nPhone: ${parsed?.customerPhone || 'N/A'}\n\nCould not automatically match products in text. Please select products manually on the Order screen.`,
        [
          {
            text: 'Open Add Order',
            onPress: () => navigation.navigate('AddOrder'),
          },
        ]
      );
      return;
    }

    // Check if customer exists or create new
    let existingCust = customers.find((c) => c.phone.includes(parsed.customerPhone.slice(-7)));
    if (!existingCust) {
      existingCust = addCustomer(parsed.customerName, parsed.customerPhone, 0);
    }

    const subtotal = parsed.items.reduce((s, i) => s + i.price * i.quantity, 0);
    const delivery = 100;

    // Create the order
    addOrder({
      customerId: existingCust.id,
      customerName: parsed.customerName,
      customerPhone: parsed.customerPhone,
      items: parsed.items,
      subtotal,
      deliveryCharges: delivery,
      totalAmount: subtotal + delivery,
      paymentMethod: 'Cash',
      status: 'Pending',
    });

    Alert.alert(
      'WhatsApp Order Created! 🎉',
      `Order placed for ${parsed.customerName}\nItems: ${parsed.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}\nTotal: Rs. ${(subtotal + delivery).toLocaleString()}`,
      [
        { text: 'View in Orders', onPress: () => navigation.navigate('OrdersTab') },
      ]
    );
  };

  const handleSimulateIncomingOrder = () => {
    const sampleCustName = 'Zubair Sheikh';
    const samplePhone = '0322 4567890';
    const sampleItems = [
      { productId: products[0]?.id || 'p1', name: products[0]?.name || 'Wireless Mouse', price: products[0]?.price || 1800, quantity: 2 },
    ];
    const subtotal = 3600;

    let cust = customers.find((c) => c.phone.includes('4567890'));
    if (!cust) {
      cust = addCustomer(sampleCustName, samplePhone, 0);
    }

    addOrder({
      customerId: cust.id,
      customerName: sampleCustName,
      customerPhone: samplePhone,
      items: sampleItems,
      subtotal,
      deliveryCharges: 150,
      totalAmount: 3750,
      paymentMethod: 'Cash',
      status: 'Pending',
    });

    Alert.alert(
      'Incoming WhatsApp API Order Received! ⚡',
      `New order from WhatsApp Business:\nCustomer: ${sampleCustName} (${samplePhone})\nItems: 2x Wireless Mouse\nTotal Amount: Rs. 3,750`,
      [{ text: 'Check Orders Screen', onPress: () => navigation.navigate('OrdersTab') }]
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader
        title="WhatsApp Business Sync"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusTopRow}>
            <View style={styles.waIconBox}>
              <Ionicons name="logo-whatsapp" size={26} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.bizName}>{businessProfile?.name || 'My Business'}</Text>
              <View style={styles.liveBadgeRow}>
                <View style={styles.greenDot} />
                <Text style={styles.liveBadgeText}>WhatsApp Cloud API Connected</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.toggleTitle}>Auto-Create Orders from Messages</Text>
              <Text style={styles.toggleSub}>Sync incoming catalog carts automatically</Text>
            </View>
            <Switch
              value={autoSyncEnabled}
              onValueChange={setAutoSyncEnabled}
              trackColor={{ false: '#D1D5DB', true: '#10B981' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Feature 1: Smart Paste Order Box */}
        <Text style={styles.sectionTitle}>1. Smart Paste WhatsApp Order</Text>
        <Text style={styles.sectionSub}>
          Customer ka WhatsApp order message yahan paste karein. App auto customer aur products pehchan legi:
        </Text>

        <View style={styles.pasteBox}>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={5}
            value={rawText}
            onChangeText={setRawText}
            placeholder="Paste customer WhatsApp message here..."
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <PrimaryButton
          title="Parse & Create Order"
          icon={<Ionicons name="sparkles-outline" size={20} color="#FFFFFF" />}
          onPress={handleParseAndCreate}
          style={{ marginBottom: 24 }}
        />

        {/* Feature 2: Simulate Live Webhook Sync */}
        <Text style={styles.sectionTitle}>2. Live WhatsApp API Simulator</Text>
        <Text style={styles.sectionSub}>
          Test karein ke jab customer WhatsApp Business par order bhejta hai to real-time sync kaise kaam karta hai:
        </Text>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleSimulateIncomingOrder}
          style={styles.simulateCard}
        >
          <View style={styles.simLeft}>
            <Ionicons name="flash-outline" size={24} color="#059669" />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.simTitle}>Simulate Incoming WhatsApp Order</Text>
              <Text style={styles.simSub}>Triggers automated Webhook -> Creates Order instantly</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </TouchableOpacity>
      </ScrollView>
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
  statusCard: {
    backgroundColor: '#075E54', // Official WhatsApp Dark Green
    borderRadius: spacing.cardRadius,
    padding: spacing.xl,
    marginBottom: spacing.xxl,
    elevation: 3,
  },
  statusTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  waIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#25D366',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  bizName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  liveBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#25D366',
    marginRight: 6,
  },
  liveBadgeText: {
    fontSize: 12,
    color: '#A7F3D0',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginVertical: 14,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  toggleSub: {
    fontSize: 11,
    color: '#A7F3D0',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 18,
  },
  pasteBox: {
    backgroundColor: colors.surface,
    borderRadius: spacing.cardRadius,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: 12,
    marginBottom: 14,
  },
  textArea: {
    fontSize: 14,
    color: colors.textPrimary,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  simulateCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing.cardRadius,
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  simLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  simTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  simSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
