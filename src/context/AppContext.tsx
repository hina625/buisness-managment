import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Customer, Order, OrderStatus, Payment, Product, Expense, BusinessProfile, Language, User } from '../types';
import { STRINGS } from '../constants/strings';
import {
  authService,
  businessService,
  customersService,
  ordersService,
  paymentsService,
  productsService,
  expensesService,
  backupService,
} from '../services/api';
import { offlineStorage } from '../services/offlineQueue';

interface AppContextType {
  isReady: boolean;
  language: Language;
  setLanguage: (lang: Language) => void;
  strings: typeof STRINGS['en'];
  currentUser: User | null;
  businessProfile: BusinessProfile;
  orders: Order[];
  customers: Customer[];
  products: Product[];
  payments: Payment[];
  expenses: Expense[];

  // Network & Sync Stats
  isOnline: boolean;
  pendingSyncCount: number;
  syncOfflineData: () => Promise<void>;

  // Daily & Overall Profit Stats (Feature #5)
  todaySales: number;
  todayExpenses: number;
  netProfit: number;
  totalSales: number;
  totalExpenses: number;
  totalNetProfit: number;
  totalOrdersCount: number;
  pendingOrdersCount: number;
  totalDueAmount: number;
  totalReceivedAmount: number;

  // Auth & Business Connection Actions
  loginUser: (phone: string, pin: string) => Promise<{ success: boolean; message?: string }>;
  signupUser: (name: string, phone: string, pin: string) => Promise<{ success: boolean; user?: User; message?: string }>;
  createBusiness: (name: string, category: string, city: string) => Promise<BusinessProfile>;
  joinBusinessWithCode: (code: string) => Promise<boolean>;
  logoutUser: () => void;
  refreshData: () => Promise<void>;

  // Business Actions
  addOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'date'>) => Promise<{ success: boolean; order?: Order }>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  addCustomer: (name: string, phone: string, openingDue?: number) => Promise<Customer>;
  addPayment: (payment: Omit<Payment, 'id' | 'date'>) => Promise<void>;
  addProduct: (name: string, price: number, stock: number) => Promise<void>;
  addExpense: (expense: { title: string; amount: number; category: string; notes?: string }) => Promise<Expense>;

  // Backup & Export (Feature #8)
  exportBusinessBackup: () => Promise<any>;
  restoreBusinessBackup: (backupData: any) => Promise<boolean>;
  exportCSVReport: (type: 'customers' | 'orders' | 'payments') => Promise<string | null>;
}

const defaultBusiness: BusinessProfile = {
  id: '',
  name: 'My Business',
  code: '',
  ownerId: '',
  ownerName: '',
  phone: '',
  currency: 'Rs.',
  category: 'General Store',
  address: '',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isReady, setIsReady] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>(defaultBusiness);

  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);

  // Load cached data from local device storage (Offline First)
  const loadLocalCache = async () => {
    try {
      const [cachedProds, cachedCusts, cachedOrds, cachedPays, cachedExps, queue] = await Promise.all([
        offlineStorage.getCache<Product[]>('products'),
        offlineStorage.getCache<Customer[]>('customers'),
        offlineStorage.getCache<Order[]>('orders'),
        offlineStorage.getCache<Payment[]>('payments'),
        offlineStorage.getCache<Expense[]>('expenses'),
        offlineStorage.getQueue(),
      ]);

      if (cachedProds) setProducts(cachedProds);
      if (cachedCusts) setCustomers(cachedCusts);
      if (cachedOrds) setOrders(cachedOrds);
      if (cachedPays) setPayments(cachedPays);
      if (cachedExps) setExpenses(cachedExps);
      setPendingSyncCount(queue.length);
    } catch (e) {
      console.warn('Error loading local offline cache:', e);
    }
  };

  // Refresh all state from PostgreSQL Backend
  const refreshData = async () => {
    try {
      const [prodsRes, custsRes, ordsRes, paysRes, expsRes] = await Promise.all([
        productsService.getProducts(),
        customersService.getCustomers(),
        ordersService.getOrders(),
        paymentsService.getPayments(),
        expensesService.getExpenses(),
      ]);

      let online = false;

      if (prodsRes?.success && Array.isArray(prodsRes.products)) {
        setProducts(prodsRes.products);
        offlineStorage.saveCache('products', prodsRes.products);
        online = true;
      }
      if (custsRes?.success && Array.isArray(custsRes.customers)) {
        setCustomers(custsRes.customers);
        offlineStorage.saveCache('customers', custsRes.customers);
        online = true;
      }
      if (ordsRes?.success && Array.isArray(ordsRes.orders)) {
        setOrders(ordsRes.orders);
        offlineStorage.saveCache('orders', ordsRes.orders);
        online = true;
      }
      if (paysRes?.success && Array.isArray(paysRes.payments)) {
        setPayments(paysRes.payments);
        offlineStorage.saveCache('payments', paysRes.payments);
        online = true;
      }
      if (expsRes?.success && Array.isArray(expsRes.expenses)) {
        setExpenses(expsRes.expenses);
        offlineStorage.saveCache('expenses', expsRes.expenses);
        online = true;
      }

      setIsOnline(online);

      // Check offline queue
      const queue = await offlineStorage.getQueue();
      setPendingSyncCount(queue.length);
      if (online && queue.length > 0) {
        syncOfflineData();
      }
    } catch (e) {
      setIsOnline(false);
      console.warn('Sync with PostgreSQL backend note:', e);
    }
  };

  // Sync offline queue items to backend
  const syncOfflineData = async () => {
    try {
      const result = await offlineStorage.syncPendingQueue();
      setPendingSyncCount(result.remaining);
      if (result.synced > 0) {
        refreshData();
      }
    } catch (err) {
      console.warn('Sync error:', err);
    }
  };

  useEffect(() => {
    (async () => {
      await loadLocalCache();
      await refreshData();
      setIsReady(true);
    })();
  }, []);

  const strings = STRINGS[language] || STRINGS.en;

  // Real Dynamic stats (Directly from real orders & expenses)
  const todayStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  
  const isToday = (dateStr?: string, createdAt?: string) => {
    if (!dateStr && !createdAt) return true;
    const now = new Date();
    if (createdAt) {
      const cDate = new Date(createdAt);
      if (!isNaN(cDate.getTime())) {
        if (
          cDate.getFullYear() === now.getFullYear() &&
          cDate.getMonth() === now.getMonth() &&
          cDate.getDate() === now.getDate()
        ) {
          return true;
        }
      }
    }
    if (dateStr) {
      const parsed = new Date(dateStr);
      if (!isNaN(parsed.getTime())) {
        if (
          parsed.getFullYear() === now.getFullYear() &&
          parsed.getMonth() === now.getMonth() &&
          parsed.getDate() === now.getDate()
        ) {
          return true;
        }
      }
      const todayVariants = [
        todayStr,
        now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        `${now.getDate()} ${now.toLocaleString('default', { month: 'short' })} ${now.getFullYear()}`,
      ];
      if (todayVariants.some(v => v.toLowerCase() === dateStr.toLowerCase().trim())) {
        return true;
      }
    }
    return false;
  };

  const todaySales = orders
    .filter((o) => isToday(o.date, (o as any).createdAt) && o.status !== 'Cancelled')
    .reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);

  const todayExpenses = expenses
    .filter((e) => isToday(e.date, (e as any).createdAt))
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const netProfit = todaySales - todayExpenses;

  // Overall Business Totals
  const totalSales = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);

  const totalExpenses = expenses
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const totalNetProfit = totalSales - totalExpenses;

  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'Pending').length;
  const totalDueAmount = customers.reduce((sum, c) => sum + c.totalDue, 0);
  const totalReceivedAmount = payments.reduce((sum, p) => sum + p.amount, 0);

  // --- Auth Handlers with PostgreSQL ---
  const loginUser = async (phone: string, pin: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await authService.login(phone, pin);
      if (!res.success) {
        return {
          success: false,
          message: res.message || 'User not registered. Please create an account first.',
        };
      }

      const loggedUser: User = {
        id: res.user.id,
        name: res.user.name,
        phone: res.user.phone,
        role: res.user.role || 'Owner',
        businessId: res.user.businessId,
      };

      setCurrentUser(loggedUser);

      if (res.business) {
        setBusinessProfile({
          id: res.business.id,
          name: res.business.name,
          code: res.business.code,
          ownerId: res.business.ownerId,
          ownerName: res.user.name,
          phone: res.business.phone,
          currency: res.business.currency || 'Rs.',
          category: res.business.category || 'General Store',
          address: res.business.address || '',
        });
      }

      await refreshData();
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        message: 'Could not connect to PostgreSQL database. Please make sure backend is running.',
      };
    }
  };

  const signupUser = async (
    name: string,
    phone: string,
    pin: string
  ): Promise<{ success: boolean; user?: User; message?: string }> => {
    try {
      const res = await authService.register(name, phone, pin);
      if (!res.success) {
        return { success: false, message: res.message || 'Failed to register' };
      }

      const newUser: User = {
        id: res.user.id,
        name: res.user.name,
        phone: res.user.phone,
        role: 'Owner',
      };

      setCurrentUser(newUser);
      return { success: true, user: newUser };
    } catch (err: any) {
      return { success: false, message: 'Database connection failed' };
    }
  };

  const logoutUser = () => {
    setCurrentUser(null);
  };

  // When owner registers a new business in PostgreSQL:
  const createBusiness = async (name: string, category: string, city: string): Promise<BusinessProfile> => {
    const res = await businessService.create(name, category, city, currentUser?.phone, currentUser?.id);
    const bizData = res.business || {
      id: `biz-${Date.now()}`,
      name,
      code: 'SHOP-101',
      ownerId: currentUser?.id || 'owner-1',
      ownerName: currentUser?.name || 'Owner',
      phone: currentUser?.phone || '',
      currency: 'Rs.',
      category: category || 'Retail General Store',
      address: city || 'Pakistan',
    };

    const newBiz: BusinessProfile = {
      id: bizData.id,
      name: bizData.name,
      code: bizData.code,
      ownerId: bizData.ownerId,
      ownerName: currentUser?.name || 'Owner',
      phone: bizData.phone,
      currency: bizData.currency || 'Rs.',
      category: bizData.category || 'Retail General Store',
      address: bizData.address || '',
    };

    setBusinessProfile(newBiz);
    if (currentUser) {
      setCurrentUser({ ...currentUser, businessId: newBiz.id, role: 'Owner' });
    }

    return newBiz;
  };

  // When staff joins with a code:
  const joinBusinessWithCode = async (code: string): Promise<boolean> => {
    const res = await businessService.join(code, currentUser?.id);
    if (res.success && res.business) {
      setBusinessProfile(res.business);
      if (currentUser) {
        setCurrentUser({ ...currentUser, businessId: res.business.id, role: 'Staff' });
      }
      return true;
    }
    return false;
  };

  // --- Core Business Handlers with Instant Display + Offline Resilience + PostgreSQL ---
  const addOrder = async (newOrderData: Omit<Order, 'id' | 'orderNumber' | 'date'>): Promise<{ success: boolean; order?: Order }> => {
    const nextNum = 1001 + orders.length;
    const tempId = `ord-${Date.now()}`;
    const initialOrder: Order = {
      ...newOrderData,
      id: tempId,
      orderNumber: `#${nextNum}`,
      date: todayStr,
    };

    // 1. Immediately show in App state
    const updatedOrders = [initialOrder, ...orders];
    setOrders(updatedOrders);
    offlineStorage.saveCache('orders', updatedOrders);

    // 2. Update customer balance in state immediately
    if (newOrderData.customerId && newOrderData.paymentMethod !== 'Cash') {
      const updatedCusts = customers.map((c) =>
        c.id === newOrderData.customerId
          ? { ...c, totalOrders: c.totalOrders + 1, totalDue: c.totalDue + newOrderData.totalAmount }
          : c
      );
      setCustomers(updatedCusts);
      offlineStorage.saveCache('customers', updatedCusts);
    }

    try {
      // 3. Persist into PostgreSQL
      const payload = {
        ...newOrderData,
        businessId: businessProfile.id || undefined,
      };
      const res = await ordersService.createOrder(payload);

      if (res?.success && res.order) {
        // Update temporary ID with real PostgreSQL ID
        const finalized = updatedOrders.map((o) => (o.id === tempId ? res.order : o));
        setOrders(finalized);
        offlineStorage.saveCache('orders', finalized);
        return { success: true, order: res.order };
      } else {
        // Backend offline -> queue for background sync
        await offlineStorage.enqueue('CREATE_ORDER', payload);
        const q = await offlineStorage.getQueue();
        setPendingSyncCount(q.length);
      }
    } catch (e: any) {
      console.warn('PostgreSQL order persist note:', e?.message);
      await offlineStorage.enqueue('CREATE_ORDER', {
        ...newOrderData,
        businessId: businessProfile.id || undefined,
      });
      const q = await offlineStorage.getQueue();
      setPendingSyncCount(q.length);
    }

    return { success: true, order: initialOrder };
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const updated = orders.map((ord) => (ord.id === orderId ? { ...ord, status } : ord));
    setOrders(updated);
    offlineStorage.saveCache('orders', updated);
    await ordersService.updateStatus(orderId, status).catch(() => null);
  };

  const addCustomer = async (name: string, phone: string, openingDue: number = 0): Promise<Customer> => {
    const tempCust: Customer = {
      id: `c-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      totalOrders: 0,
      totalDue: openingDue,
    };

    // Show immediately in state
    const updated = [tempCust, ...customers];
    setCustomers(updated);
    offlineStorage.saveCache('customers', updated);

    try {
      const res = await customersService.addCustomer(name, phone, openingDue);
      if (res?.success && res.customer) {
        const finalized = updated.map((c) => (c.id === tempCust.id ? res.customer : c));
        setCustomers(finalized);
        offlineStorage.saveCache('customers', finalized);
        return res.customer;
      } else {
        await offlineStorage.enqueue('CREATE_CUSTOMER', { name, phone, openingDue });
        const q = await offlineStorage.getQueue();
        setPendingSyncCount(q.length);
      }
    } catch (e: any) {
      await offlineStorage.enqueue('CREATE_CUSTOMER', { name, phone, openingDue });
      const q = await offlineStorage.getQueue();
      setPendingSyncCount(q.length);
    }

    return tempCust;
  };

  const addPayment = async (paymentData: Omit<Payment, 'id' | 'date'>) => {
    const newPayment: Payment = {
      ...paymentData,
      id: `pay-${Date.now()}`,
      date: todayStr,
    };

    const updatedPayments = [newPayment, ...payments];
    setPayments(updatedPayments);
    offlineStorage.saveCache('payments', updatedPayments);

    const updatedCusts = customers.map((c) => {
      if (c.id === paymentData.customerId) {
        return {
          ...c,
          totalDue: Math.max(0, c.totalDue - paymentData.amount),
        };
      }
      return c;
    });
    setCustomers(updatedCusts);
    offlineStorage.saveCache('customers', updatedCusts);

    const payload = {
      ...paymentData,
      businessId: businessProfile.id,
    };

    try {
      const res = await paymentsService.recordPayment(payload);
      if (!res?.success) {
        await offlineStorage.enqueue('RECORD_PAYMENT', payload);
        const q = await offlineStorage.getQueue();
        setPendingSyncCount(q.length);
      }
    } catch {
      await offlineStorage.enqueue('RECORD_PAYMENT', payload);
      const q = await offlineStorage.getQueue();
      setPendingSyncCount(q.length);
    }
  };

  const addProduct = async (name: string, price: number, stock: number) => {
    const newProd: Product = {
      id: `p-${Date.now()}`,
      name: name.trim(),
      price,
      stock,
      iconName: 'cube',
    };

    const updated = [...products, newProd];
    setProducts(updated);
    offlineStorage.saveCache('products', updated);

    await productsService.addProduct(name, price, stock).catch(() => null);
  };

  // Feature #5: Daily Expenses & Profit
  const addExpense = async (data: { title: string; amount: number; category: string; notes?: string }): Promise<Expense> => {
    const tempExpense: Expense = {
      id: `exp-${Date.now()}`,
      title: data.title.trim(),
      amount: Number(data.amount),
      category: data.category || 'General',
      date: todayStr,
      notes: data.notes,
      businessId: businessProfile.id,
    };

    const updated = [tempExpense, ...expenses];
    setExpenses(updated);
    offlineStorage.saveCache('expenses', updated);

    const payload = {
      ...data,
      date: todayStr,
      businessId: businessProfile.id || undefined,
    };

    try {
      const res = await expensesService.createExpense(payload);
      if (res?.success && res.expense) {
        const finalized = updated.map((e) => (e.id === tempExpense.id ? res.expense : e));
        setExpenses(finalized);
        offlineStorage.saveCache('expenses', finalized);
        return res.expense;
      } else {
        await offlineStorage.enqueue('CREATE_EXPENSE', payload);
        const q = await offlineStorage.getQueue();
        setPendingSyncCount(q.length);
      }
    } catch {
      await offlineStorage.enqueue('CREATE_EXPENSE', payload);
      const q = await offlineStorage.getQueue();
      setPendingSyncCount(q.length);
    }

    return tempExpense;
  };

  // Feature #8: Complete Database Backup & CSV / Excel Export & Restore
  const exportBusinessBackup = async () => {
    try {
      const res = await backupService.exportBackup();
      if (res?.success) {
        return res;
      }
    } catch (e) {
      console.warn('Backend backup error, using local snapshot:', e);
    }
    // Fallback local snapshot package
    return {
      success: true,
      timestamp: new Date().toISOString(),
      business: businessProfile,
      customers,
      products,
      orders,
      payments,
      expenses,
    };
  };

  const restoreBusinessBackup = async (backupData: any): Promise<boolean> => {
    try {
      if (backupData.customers) setCustomers(backupData.customers);
      if (backupData.products) setProducts(backupData.products);
      if (backupData.orders) setOrders(backupData.orders);
      if (backupData.payments) setPayments(backupData.payments);
      if (backupData.expenses) setExpenses(backupData.expenses);

      await Promise.all([
        offlineStorage.saveCache('customers', backupData.customers || []),
        offlineStorage.saveCache('products', backupData.products || []),
        offlineStorage.saveCache('orders', backupData.orders || []),
        offlineStorage.saveCache('payments', backupData.payments || []),
        offlineStorage.saveCache('expenses', backupData.expenses || []),
      ]);

      // Also persist to PostgreSQL
      await backupService.restoreBackup(backupData).catch(() => null);
      return true;
    } catch (e) {
      console.warn('Restore failed:', e);
      return false;
    }
  };

  const exportCSVReport = async (type: 'customers' | 'orders' | 'payments'): Promise<string | null> => {
    try {
      if (type === 'customers') {
        const header = 'ID,Name,Phone,Total Orders,Total Due (PKR)\n';
        const rows = customers.map(c => `"${c.id}","${c.name}","${c.phone}",${c.totalOrders},${c.totalDue}`).join('\n');
        return header + rows;
      } else if (type === 'orders') {
        const header = 'Order ID,Customer,Phone,Amount (PKR),Payment Method,Status,Date\n';
        const rows = orders.map(o => `"${o.orderNumber}","${o.customerName}","${o.customerPhone}",${o.totalAmount},"${o.paymentMethod}","${o.status}","${o.date}"`).join('\n');
        return header + rows;
      } else if (type === 'payments') {
        const header = 'Payment ID,Customer,Amount (PKR),Payment Method,Date\n';
        const rows = payments.map(p => `"${p.id}","${p.customerName}",${p.amount},"${p.paymentMethod}","${p.date}"`).join('\n');
        return header + rows;
      }
      return null;
    } catch {
      return null;
    }
  };

  return (
    <AppContext.Provider
      value={{
        isReady,
        language,
        setLanguage,
        strings,
        currentUser,
        businessProfile,
        orders,
        customers,
        products,
        payments,
        expenses,
        isOnline,
        pendingSyncCount,
        syncOfflineData,
        todaySales,
        todayExpenses,
        netProfit,
        totalSales,
        totalExpenses,
        totalNetProfit,
        totalOrdersCount,
        pendingOrdersCount,
        totalDueAmount,
        totalReceivedAmount,
        loginUser,
        signupUser,
        createBusiness,
        joinBusinessWithCode,
        logoutUser,
        refreshData,
        addOrder,
        updateOrderStatus,
        addCustomer,
        addPayment,
        addProduct,
        addExpense,
        exportBusinessBackup,
        restoreBusinessBackup,
        exportCSVReport,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
