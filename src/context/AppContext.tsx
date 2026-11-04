import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Customer, Order, OrderStatus, Payment, Product, BusinessProfile, Language, User } from '../types';
import { STRINGS } from '../constants/strings';
import {
  authService,
  businessService,
  customersService,
  ordersService,
  paymentsService,
  productsService,
} from '../services/api';

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

  // Stats
  todaySales: number;
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
  addOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'date'>) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  addCustomer: (name: string, phone: string, openingDue?: number) => Promise<Customer>;
  addPayment: (payment: Omit<Payment, 'id' | 'date'>) => Promise<void>;
  addProduct: (name: string, price: number, stock: number) => Promise<void>;
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

  // Refresh all state from PostgreSQL Backend
  const refreshData = async () => {
    try {
      const [prodsRes, custsRes, ordsRes, paysRes] = await Promise.all([
        productsService.getProducts(),
        customersService.getCustomers(),
        ordersService.getOrders(),
        paymentsService.getPayments(),
      ]);

      if (prodsRes?.success && Array.isArray(prodsRes.products)) {
        setProducts(prodsRes.products);
      }
      if (custsRes?.success && Array.isArray(custsRes.customers)) {
        setCustomers(custsRes.customers);
      }
      if (ordsRes?.success && Array.isArray(ordsRes.orders)) {
        setOrders(ordsRes.orders);
      }
      if (paysRes?.success && Array.isArray(paysRes.payments)) {
        setPayments(paysRes.payments);
      }
    } catch (e) {
      console.warn('Sync with PostgreSQL backend note:', e);
    }
  };

  useEffect(() => {
    refreshData().finally(() => setIsReady(true));
  }, []);

  const strings = STRINGS[language] || STRINGS.en;

  // Real Dynamic stats (Directly from PostgreSQL state)
  const todayStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const todaySales = orders
    .filter((o) => o.date === todayStr && o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0);
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

  // --- Core Business Handlers with PostgreSQL ---
  const addOrder = async (newOrderData: Omit<Order, 'id' | 'orderNumber' | 'date'>) => {
    const res = await ordersService.createOrder({
      ...newOrderData,
      businessId: businessProfile.id,
    });

    if (res.success && res.order) {
      setOrders((prev) => [res.order, ...prev]);
    } else {
      const nextNum = 1001 + orders.length;
      const fallbackOrder: Order = {
        ...newOrderData,
        id: `ord-${nextNum}`,
        orderNumber: `#${nextNum}`,
        date: todayStr,
      };
      setOrders((prev) => [fallbackOrder, ...prev]);
    }
    await refreshData();
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    await ordersService.updateStatus(orderId, status);
    setOrders((prev) => prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord)));
  };

  const addCustomer = async (name: string, phone: string, openingDue: number = 0): Promise<Customer> => {
    const res = await customersService.addCustomer(name, phone, openingDue);
    const newCust: Customer = res.customer || {
      id: `c-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      totalOrders: 0,
      totalDue: openingDue,
    };
    setCustomers((prev) => [newCust, ...prev]);
    return newCust;
  };

  const addPayment = async (paymentData: Omit<Payment, 'id' | 'date'>) => {
    const res = await paymentsService.recordPayment({
      ...paymentData,
      businessId: businessProfile.id,
    });

    const newPayment: Payment = res.payment || {
      ...paymentData,
      id: `pay-${Date.now()}`,
      date: todayStr,
    };

    setPayments((prev) => [newPayment, ...prev]);
    await refreshData();
  };

  const addProduct = async (name: string, price: number, stock: number) => {
    const res = await productsService.addProduct(name, price, stock);
    const newProd: Product = res.product || {
      id: `p-${Date.now()}`,
      name: name.trim(),
      price,
      stock,
      iconName: 'cube',
    };
    setProducts((prev) => [...prev, newProd]);
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
        todaySales,
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
