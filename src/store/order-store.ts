import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useNotificationStore } from "./notification-store";
import { Order, OrderStatus } from "@/types/order";

interface OrderState {
  orders: Order[];
  addOrder: (orderData: any) => Promise<string>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  cancelOrder: (orderId: string) => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],

      addOrder: async (orderData) => {
        const order: Order = {
          id: `order_${Date.now()}`,
          orderNumber: `ORD-${Date.now()}`,
          status: "PENDING" as OrderStatus,
          subtotal: orderData.subtotal || 0,
          tax: orderData.tax || 0,
          shipping: orderData.shipping || 0,
          discount: 0,
          total: orderData.total || 0,
          currency: "COP",
          billingAddress: JSON.stringify(orderData.shippingAddress || {}),
          shippingAddress: JSON.stringify(orderData.shippingAddress || {}),
          paymentStatus: "PENDING",
          paymentMethod: orderData.paymentMethod || "card",
          paymentId: null,
          shippingMethod: "standard",
          trackingNumber: null,
          estimatedDelivery: null,
          deliveredAt: null,
          notes: orderData.notes || null,
          adminNotes: null,
          userId: orderData.userId || "",
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set((state) => ({
          orders: [...state.orders, order],
        }));

        useNotificationStore.getState().addNotification({
          type: "success",
          title: "Pedido creado exitosamente",
          message: `Número de orden: ${order.orderNumber}`,
        });

        return order.id;
      },

      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId
              ? { ...order, status, updatedAt: new Date() }
              : order
          ),
        }));

        const statusMessages = {
          PENDING: "está pendiente",
          CONFIRMED: "confirmado",
          PROCESSING: "en procesamiento",
          SHIPPED: "enviado",
          DELIVERED: "entregado",
          CANCELLED: "cancelado",
          REFUNDED: "reembolsado",
        };

        useNotificationStore.getState().addNotification({
          type: "success",
          title: `Pedido ${statusMessages[status]}`,
          message: statusMessages[status],
        });
      },

      cancelOrder: (orderId) => {
        get().updateOrderStatus(orderId, "CANCELLED");
      },
    }),
    {
      name: "order-store",
    }
  )
);
