"use client";
import { create } from "zustand";
import { Product } from "../types";
import { toast } from "sonner";

export interface CartItem {
    product: Product;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    addItem: (product: Product) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
    validateStock: (product: Product, requestedQuantity: number) => boolean;
    checkAvailableStock: (product: Product) => number;
}

export const useCartStore = create<CartState>((set, get) => ({
    items: [],

    addItem: (product) => {
        const items = get().items;
        const existing = items.find((item) => item.product.id === product.id);

        // Validar stock disponible
        const currentCartQuantity = existing ? existing.quantity : 0;
        const requestedQuantity = currentCartQuantity + 1;

        if (!get().validateStock(product, requestedQuantity)) {
            const availableStock = get().checkAvailableStock(product);
            toast.error(`Stock insuficiente para ${product.name}`, {
                description: `Solo quedan ${availableStock} unidades disponibles`
            });
            return;
        }

        if (existing) {
            const updated = items.map((item) =>
                item.product.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
            set({ items: updated });
            toast.success(`${product.name} agregado`, {
                description: `Cantidad: ${existing.quantity + 1}`
            });
        } else {
            set({ items: [...items, { product, quantity: 1 }] });
            toast.success(`${product.name} agregado al carrito`, {
                description: "Producto añadido exitosamente"
            });
        }
    },

    removeItem: (productId) => {
        const items = get().items;
        const item = items.find((item) => item.product.id === productId);

        const updated = items.filter((item) => item.product.id !== productId);
        set({ items: updated });

        if (item) {
            toast.success(`${item.product.name} eliminado`, {
                description: "Producto removido del carrito"
            });
        }
    },

    updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
            get().removeItem(productId);
            return;
        }

        const items = get().items;
        const item = items.find((item) => item.product.id === productId);

        if (!item) return;

        // Validar stock antes de actualizar
        if (!get().validateStock(item.product, quantity)) {
            const availableStock = get().checkAvailableStock(item.product);

            toast.error(`Stock insuficiente para ${item.product.name}`, {
                description: `Solo quedan ${availableStock} unidades disponibles`,
                action: {
                    label: "Ajustar cantidad",
                    onClick: () => {
                        if (availableStock > 0) {
                            get().updateQuantity(productId, availableStock);
                        } else {
                            get().removeItem(productId);
                        }
                    }
                }
            });
            return;
        }

        const updated = items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
        );
        set({ items: updated });

        toast.success(`${item.product.name} actualizado`, {
            description: `Nueva cantidad: ${quantity}`
        });
    },

    clearCart: () => {
        const items = get().items;
        const itemCount = items.length;

        set({ items: [] });

        if (itemCount > 0) {
            toast.success(`Carrito limpiado`, {
                description: `Se eliminaron ${itemCount} productos`
            });
        }
    },

    getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
    },

    getTotalPrice: () => {
        return get().items.reduce(
            (total, item) => total + item.quantity * item.product.price,
            0
        );
    },

    // Validar si hay suficiente stock para la cantidad solicitada
    validateStock: (product, requestedQuantity) => {
        // Verificar si el stock del producto es suficiente
        return requestedQuantity <= (product.quantity || 0);
    },

    // Obtener stock disponible del producto
    checkAvailableStock: (product) => {
        return product.quantity || 0;
    },
}));
