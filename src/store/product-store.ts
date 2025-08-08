import { create } from "zustand";
import { Product, CreateProductData } from "@/types";
import { toast } from "sonner";

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  addProduct: (product: CreateProductData) => Promise<void>;
  updateProduct: (
    id: string,
    product: Partial<CreateProductData>
  ) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  toggleProductStatus: (id: string) => Promise<void>;
  getProducts: () => Product[];
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Error al cargar productos");

      const data = await response.json();
      set({ products: data.products || [], loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Error desconocido",
        loading: false,
      });
    }
  },

  addProduct: async (productData: CreateProductData) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al crear producto");
      }

      const newProduct = await response.json();
      set((state) => ({
        products: [...state.products, newProduct],
        loading: false,
      }));

      toast.success("Producto creado", {
        description: `${productData.name} ha sido creado exitosamente`,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Error desconocido",
        loading: false,
      });
      throw error;
    }
  },

  updateProduct: async (
    id: string,
    productData: Partial<CreateProductData>
  ) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar producto");
      }

      const updatedProduct = await response.json();
      set((state) => ({
        products: state.products.map((p) => (p.id === id ? updatedProduct : p)),
        loading: false,
      }));

      toast.success("Producto actualizado", {
        description: "Los cambios han sido guardados exitosamente",
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Error desconocido",
        loading: false,
      });
      throw error;
    }
  },

  deleteProduct: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar producto");
      }

      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
        loading: false,
      }));

      toast.success("Producto eliminado", {
        description: "El producto ha sido eliminado exitosamente",
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Error desconocido",
        loading: false,
      });
      throw error;
    }
  },

  toggleProductStatus: async (id: string) => {
    const product = get().products.find((p) => p.id === id);
    if (!product) return;

    try {
      await get().updateProduct(id, { isActive: !product.isActive });

      const status = product.isActive ? "desactivado" : "activado";
      toast.success(`Producto ${status}`, {
        description: `${product.name} ha sido ${status} exitosamente`,
      });
    } catch (error) {
      console.error("Error toggling product status:", error);
      throw error;
    }
  },

  getProducts: () => get().products,
}));
