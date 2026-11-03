import AsyncStorage from '@react-native-async-storage/async-storage';
import { INITIAL_DATA } from './initialData';

const KEYS = {
  ORDERS: '@business_orders',
  CUSTOMERS: '@business_customers',
  PRODUCTS: '@business_products',
  PAYMENTS: '@business_payments',
  PROFILE: '@business_profile',
};

export const storage = {
  // Load full app state
  async loadInitialData() {
    try {
      const [orders, customers, products, payments, profile] = await Promise.all([
        AsyncStorage.getItem(KEYS.ORDERS),
        AsyncStorage.getItem(KEYS.CUSTOMERS),
        AsyncStorage.getItem(KEYS.PRODUCTS),
        AsyncStorage.getItem(KEYS.PAYMENTS),
        AsyncStorage.getItem(KEYS.PROFILE),
      ]);

      return {
        orders: orders ? JSON.parse(orders) : INITIAL_DATA.orders,
        customers: customers ? JSON.parse(customers) : INITIAL_DATA.customers,
        products: products ? JSON.parse(products) : INITIAL_DATA.products,
        payments: payments ? JSON.parse(payments) : INITIAL_DATA.payments,
        profile: profile ? JSON.parse(profile) : INITIAL_DATA.businessProfile,
      };
    } catch (e) {
      console.warn('Storage read error, using fallback initial data', e);
      return INITIAL_DATA;
    }
  },

  async saveOrders(orders) {
    try {
      await AsyncStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error('Error saving orders', e);
    }
  },

  async saveCustomers(customers) {
    try {
      await AsyncStorage.setItem(KEYS.CUSTOMERS, JSON.stringify(customers));
    } catch (e) {
      console.error('Error saving customers', e);
    }
  },

  async saveProducts(products) {
    try {
      await AsyncStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error('Error saving products', e);
    }
  },

  async savePayments(payments) {
    try {
      await AsyncStorage.setItem(KEYS.PAYMENTS, JSON.stringify(payments));
    } catch (e) {
      console.error('Error saving payments', e);
    }
  },
};
