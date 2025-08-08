import { create } from "zustand";
import { Order, OrderStatus, CreateOrderData } from "@/types";
import { toast } from "sonner";

interface UserSession {
  user: {
    id?: string;
    email?: string | null;
    name?: string | null;
  };
}

interface OrderState {
  orders: Order[];
  isLoading: boolean;
  createOrder: (
    orderData: CreateOrderData,
    userSession: UserSession
  ) => Promise<Order>;
  getUserOrders: (userId: string) => Order[];
  getAllOrders: () => Order[];
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrderById: (orderId: string) => Order | undefined;
  cancelOrder: (orderId: string) => void;
}

export const useOrderStore = create<OrderState>()((set, get) => ({
  orders: [],
  isLoading: false,

  createOrder: async (
    orderData: CreateOrderData,
    userSession: UserSession
  ): Promise<Order> => {
    set({ isLoading: true });

    if (!userSession?.user) {
      throw new Error("Usuario no autenticado");
    }

    const orderId = `order_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    const orderItems = orderData.items.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      productImage: item.product.images?.[0] || item.product.image || "",
      price: item.product.price,
      quantity: item.quantity,
    }));

    const totalAmount = orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const newOrder: Order = {
      id: orderId,
      userId: userSession.user.id || "unknown",
      userEmail: userSession.user.email || "unknown@email.com",
      userName: userSession.user.name || "Usuario Anónimo",
      items: orderItems,
      totalAmount,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      shippingAddress: orderData.shippingAddress,
      phone: orderData.phone,
      notes: orderData.notes,
    };

    set((state) => ({
      orders: [...state.orders, newOrder],
      isLoading: false,
    }));

    toast.success(`Pedido creado exitosamente`, {
      description: `Tu pedido #${orderId.split("_")[1]} ha sido registrado`,
    });

    return newOrder;
  },

  getUserOrders: (userId: string) => {
    return get().orders.filter((order: Order) => order.userId === userId);
  },

  getAllOrders: () => {
    return get().orders;
  },

  updateOrderStatus: (orderId: string, status: OrderStatus) => {
    const order = get().orders.find((o) => o.id === orderId);

    set((state) => ({
      orders: state.orders.map((order: Order) =>
        order.id === orderId
          ? { ...order, status, updatedAt: new Date().toISOString() }
          : order
      ),
    }));

    if (order) {
      const statusMessages = {
        pending: "pendiente",
        confirmed: "confirmado",
        processing: "en procesamiento",
        shipped: "enviado",
        delivered: "entregado",
        cancelled: "cancelado",
      };

      toast.success(`Pedido ${statusMessages[status]}`, {
        description: `El pedido #${orderId.split("_")[1]} cambió a ${
          statusMessages[status]
        }`,
      });
    }
  },

  getOrderById: (orderId: string) => {
    return get().orders.find((order: Order) => order.id === orderId);
  },

  cancelOrder: (orderId: string) => {
    const order = get().orders.find((o) => o.id === orderId);
    get().updateOrderStatus(orderId, "cancelled");

    if (order) {
      toast.success(`Pedido cancelado`, {
        description: `El pedido #${orderId.split("_")[1]} ha sido cancelado`,
      });
    }
  },
}));
