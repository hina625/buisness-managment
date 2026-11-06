import { Platform } from 'react-native';

// Auto-detect PC IP address for physical phone, emulator and web
const getBaseUrl = () => {
  if (Platform.OS === 'web') {
    return 'http://localhost:5000/api/v1';
  }

  try {
    // Dynamic import to avoid strict typescript missing module compile errors
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Constants = require('expo-constants')?.default || require('expo-constants');
    const hostUri = Constants?.expoConfig?.hostUri || Constants?.manifest2?.extra?.expoClient?.hostUri;
    if (hostUri) {
      const ip = hostUri.split(':')[0];
      return `http://${ip}:5000/api/v1`;
    }
  } catch {
    // fallback
  }

  // Fallback to PC Wi-Fi local network IP
  return 'http://192.168.10.138:5000/api/v1';
};

const BASE_URL = getBaseUrl();
console.log('[API URL Configured]:', BASE_URL);

export const apiClient = {
  async get(endpoint: string, token?: string) {
    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      return await res.json();
    } catch (err: any) {
      console.warn('Network GET error:', endpoint, err.message);
      return { success: false, message: 'Could not connect to backend database' };
    }
  },

  async post(endpoint: string, body: any, token?: string) {
    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });
      return await res.json();
    } catch (err: any) {
      console.warn('Network POST error:', endpoint, err.message);
      return { success: false, message: 'Could not connect to backend database' };
    }
  },

  async patch(endpoint: string, body: any, token?: string) {
    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });
      return await res.json();
    } catch (err: any) {
      console.warn('Network PATCH error:', endpoint, err.message);
      return { success: false, message: 'Could not connect to backend database' };
    }
  },
};

// Endpoints
export const authService = {
  register: (name: string, phone: string, pin: string) =>
    apiClient.post('/auth/register', { name, phone, pin }),
  login: (phone: string, pin: string) =>
    apiClient.post('/auth/login', { phone, pin }),
  getProfile: (token: string) =>
    apiClient.get('/auth/me', token),
};

export const businessService = {
  create: (name: string, category: string, city: string, phone?: string, userId?: string) =>
    apiClient.post('/business/create', { name, category, city, phone, userId }),
  join: (code: string, userId?: string) =>
    apiClient.post('/business/join', { code, userId }),
  getProfile: (businessId?: string) =>
    apiClient.get(`/business/profile${businessId ? `?businessId=${businessId}` : ''}`),
};

export const ordersService = {
  getOrders: (status?: string, search?: string) =>
    apiClient.get(`/orders?status=${status || 'All'}&search=${search || ''}`),
  createOrder: (orderData: any) =>
    apiClient.post('/orders', orderData),
  updateStatus: (orderId: string, status: string) =>
    apiClient.patch(`/orders/${orderId}/status`, { status }),
};

export const customersService = {
  getCustomers: (search?: string) =>
    apiClient.get(`/customers${search ? `?search=${search}` : ''}`),
  addCustomer: (name: string, phone: string, openingDue: number = 0) =>
    apiClient.post('/customers', { name, phone, openingDue }),
  getLedger: (customerId: string) =>
    apiClient.get(`/customers/${customerId}/ledger`),
};

export const paymentsService = {
  recordPayment: (paymentData: any) =>
    apiClient.post('/payments', paymentData),
  getPayments: () =>
    apiClient.get('/payments'),
  getSummary: () =>
    apiClient.get('/payments/summary'),
};

export const productsService = {
  getProducts: (search?: string) =>
    apiClient.get(`/products${search ? `?search=${search}` : ''}`),
  addProduct: (name: string, price: number, stock: number) =>
    apiClient.post('/products', { name, price, stock }),
};

export const expensesService = {
  getExpenses: () =>
    apiClient.get('/expenses'),
  createExpense: (data: { title: string; amount: number; category: string; notes?: string; businessId?: string }) =>
    apiClient.post('/expenses', data),
  getProfitSummary: () =>
    apiClient.get('/expenses/summary'),
};

export const backupService = {
  exportBackup: () =>
    apiClient.get('/backup/export'),
  exportCSV: (type: 'customers' | 'orders' | 'payments') =>
    apiClient.get(`/backup/csv?type=${type}`),
  restoreBackup: (backupData: any) =>
    apiClient.post('/backup/restore', backupData),
};
