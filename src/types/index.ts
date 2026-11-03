export type Language = 'en' | 'ur';

export type PaymentMethod = 'Cash' | 'Easypaisa' | 'JazzCash' | 'Bank';

export type OrderStatus = 'Pending' | 'Delivered' | 'Cancelled';

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

export interface BusinessProfile {
  name: string;
  phone: string;
  currency: string;
  address?: string;
}
