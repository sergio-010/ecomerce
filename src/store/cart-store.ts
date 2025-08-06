import { create } from "zustand";
import { Product } from "@/types";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number; // <- Esta línea es clave
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (product) => {
    const items = get().items;
    const existing = items.find((item) => item.product.id === product.id);

    if (existing) {
      const updated = items.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      set({ items: updated });
    } else {
      set({ items: [...items, { product, quantity: 1 }] });
    }
  },

  removeItem: (productId) => {
    const updated = get().items.filter((item) => item.product.id !== productId);
    set({ items: updated });
  },

  clearCart: () => set({ items: [] }),

  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },

  getTotalPrice: () => {
    return get().items.reduce(
      (total, item) => total + item.quantity * item.product.price,
      0
    );
  },
}));
