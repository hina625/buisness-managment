export type Language = 'en' | 'ur' | 'sd' | 'ps' | 'pa' | 'ar';

export type PaymentMethod = 'Cash' | 'Easypaisa' | 'JazzCash' | 'Bank';

export type OrderStatus = 'Pending' | 'Delivered' | 'Cancelled';

export type UserRole = 'Owner' | 'Manager' | 'Staff';

export interface User {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  businessId?: string;
}

export interface BusinessProfile {
  id: string;
  name: string;
  code: string; // Unique business code e.g. AZHAR-786 for staff to join
  ownerId: string;
  ownerName: string;
  phone: string;
  currency: string;
  category: string;
  address?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  iconName?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  totalOrders: number;
  totalDue: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharges: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  date: string;
}

export interface Payment {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  paymentMethod: PaymentMethod;
  date: string;
  orderId?: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  notes?: string;
  businessId?: string;
}
