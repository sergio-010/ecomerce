import { CartItem } from "./cart";

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
}

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
  billingAddress: string;
  shippingAddress: string;
  paymentMethod?: string | null;
  paymentStatus: PaymentStatus;
  paymentId?: string | null;
  shippingMethod?: string | null;
  trackingNumber?: string | null;
  estimatedDelivery?: Date | null;
  deliveredAt?: Date | null;
  notes?: string | null;
  adminNotes?: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrderData {
  items: CartItem[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  phone: string;
  notes?: string;
}
