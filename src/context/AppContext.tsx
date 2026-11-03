import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Customer, Order, OrderStatus, Payment, PaymentMethod, Product, BusinessProfile, Language } from '../types';
import { STRINGS } from '../constants/strings';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  strings: typeof STRINGS['en'];
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
  
  // Actions
  addOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'date'>) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  addCustomer: (name: string, phone: string) => Customer;
  addPayment: (payment: Omit<Payment, 'id' | 'date'>) => void;
  addProduct: (name: string, price: number, stock: number) => void;
}

const initialProducts: Product[] = [
  { id: 'p1', name: 'Wireless Mouse', price: 1800, stock: 25, iconName: 'mouse' },
  { id: 'p2', name: 'Mechanical Keyboard', price: 3000, stock: 15, iconName: 'keyboard' },
  { id: 'p3', name: 'USB Type-C Cable', price: 500, stock: 50, iconName: 'cable' },
  { id: 'p4', name: 'Laptop Stand', price: 2200, stock: 10, iconName: 'laptop' },
];

const initialCustomers: Customer[] = [
  { id: 'c1', name: 'Ali Khan', phone: '0300 1234567', totalOrders: 12, totalDue: 5200 },
  { id: 'c2', name: 'Ahmed Raza', phone: '0321 7654321', totalOrders: 8, totalDue: 3100 },
  { id: 'c3', name: 'Sara Ahmed', phone: '0345 9876543', totalOrders: 6, totalDue: 2800 },
  { id: 'c4', name: 'Usman Ali', phone: '0312 4567890', totalOrders: 5, totalDue: 1900 },
];

const initialOrders: Order[] = [
  {
    id: 'ord-1025',
    orderNumber: '#1025',
    customerId: 'c1',
    customerName: 'Ali Khan',
    customerPhone: '0300 1234567',
    items: [
      { productId: 'p1', name: 'Wireless Mouse', price: 1800, quantity: 1 },
    ],
    subtotal: 1800,
    deliveryCharges: 100,
    totalAmount: 1900,
    paymentMethod: 'Cash',
    status: 'Pending',
    date: '15 Nov, 2024',
  },
  {
    id: 'ord-1024',
    orderNumber: '#1024',
    customerId: 'c2',
    customerName: 'Ahmed Raza',
    customerPhone: '0321 7654321',
    items: [
      { productId: 'p2', name: 'Mechanical Keyboard', price: 3000, quantity: 1 },
    ],
    subtotal: 3000,
    deliveryCharges: 0,
    totalAmount: 3000,
    paymentMethod: 'Easypaisa',
    status: 'Delivered',
    date: '14 Nov, 2024',
  },
  {
    id: 'ord-1023',
    orderNumber: '#1023',
    customerId: 'c3',
    customerName: 'Sara Ahmed',
    customerPhone: '0345 9876543',
    items: [
      { productId: 'p3', name: 'USB Type-C Cable', price: 500, quantity: 2 },
    ],
    subtotal: 1000,
    deliveryCharges: 150,
    totalAmount: 1150,
    paymentMethod: 'Cash',
    status: 'Cancelled',
    date: '13 Nov, 2024',
  },
];

const initialPayments: Payment[] = [
  {
    id: 'pay-1',
    customerId: 'c1',
    customerName: 'Ali Khan',
    amount: 1000,
    paymentMethod: 'Cash',
    date: '15 Nov, 2024',
  },
  {
    id: 'pay-2',
    customerId: 'c2',
    customerName: 'Ahmed Raza',
    amount: 2500,
    paymentMethod: 'Easypaisa',
    date: '14 Nov, 2024',
  },
  {
    id: 'pay-3',
    customerId: 'c4',
    customerName: 'Usman Ali',
    amount: 1500,
    paymentMethod: 'JazzCash',
    date: '12 Nov, 2024',
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [businessProfile] = useState<BusinessProfile>({
    name: 'Azhar Traders',
    phone: '+92 300 1234567',
    currency: 'Rs.',
  });

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [payments, setPayments] = useState<Payment[]>(initialPayments);

  const strings = STRINGS[language];

  // Derived stats
  const todaySales = 25500;
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'Pending').length;
  const totalDueAmount = customers.reduce((sum, c) => sum + c.totalDue, 0);
  const totalReceivedAmount = payments.reduce((sum, p) => sum + p.amount, 0) + 40500; // Rs. 45,500 like in design

  const addOrder = (newOrderData: Omit<Order, 'id' | 'orderNumber' | 'date'>) => {
    const nextNum = 1026 + orders.length;
    const newOrder: Order = {
      ...newOrderData,
      id: `ord-${nextNum}`,
      orderNumber: `#${nextNum}`,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Update customer stats
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === newOrder.customerId) {
          return {
            ...c,
            totalOrders: c.totalOrders + 1,
            totalDue: c.totalDue + (newOrder.paymentMethod === 'Cash' ? 0 : newOrder.totalAmount),
          };
        }
        return c;
      })
    );

    // Deduct stock
    setProducts((prev) =>
      prev.map((p) => {
        const item = newOrder.items.find((i) => i.productId === p.id);
        if (item) {
          return { ...p, stock: Math.max(0, p.stock - item.quantity) };
        }
        return p;
      })
    );
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
    );
  };

  const addCustomer = (name: string, phone: string): Customer => {
    const newCust: Customer = {
      id: `c-${Date.now()}`,
      name,
      phone,
      totalOrders: 0,
      totalDue: 0,
    };
    setCustomers((prev) => [newCust, ...prev]);
    return newCust;
  };

  const addPayment = (paymentData: Omit<Payment, 'id' | 'date'>) => {
    const newPayment: Payment = {
      ...paymentData,
      id: `pay-${Date.now()}`,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    };
    setPayments((prev) => [newPayment, ...prev]);

    // Reduce customer due
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === paymentData.customerId) {
          return {
            ...c,
            totalDue: Math.max(0, c.totalDue - paymentData.amount),
          };
        }
        return c;
      })
    );
  };

  const addProduct = (name: string, price: number, stock: number) => {
    const newProduct: Product = {
      id: `p-${Date.now()}`,
      name,
      price,
      stock,
      iconName: 'cube',
    };
    setProducts((prev) => [...prev, newProduct]);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        strings,
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
