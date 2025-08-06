import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Product, CreateProductData } from "@/types";
import { useCategoryStore } from "./category-store";

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;

  // Actions
  addProduct: (data: CreateProductData) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductStatus: (id: string) => void;
  getProducts: () => Product[];
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (categoryId: string) => Product[];
  getActiveProducts: () => Product[];
  getPromotionalProducts: () => Product[];
  searchProducts: (query: string) => Product[];
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

// Mock data inicial
const mockProducts: Product[] = [
  {
    id: "1",
    name: "iPhone 15 Pro",
    price: 899.99,
    originalPrice: 999.99,
    image:
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400&h=400&fit=crop&q=80",
    description: "El último iPhone con chip A17 Pro y cámara avanzada",
    category: "Smartphones",
    categoryId: "4",
    inStock: true,
    quantity: 25,
    rating: 4.8,
    reviews: 152,
    freeShipping: true,
    hasPromotion: true,
    promotionPercentage: 10,
    promotionStartDate: new Date("2024-01-01"),
    promotionEndDate: new Date("2024-12-31"),
    createdAt: new Date(),
  },
  {
    id: "2",
    name: "MacBook Air M2",
    price: 1199.99,
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop&q=80",
    description: "Laptop ultradelgada con chip M2 y pantalla Retina",
    category: "Electrónicos",
    categoryId: "1",
    inStock: true,
    quantity: 15,
    rating: 4.9,
    reviews: 89,
    freeShipping: true,
    hasPromotion: false,
    createdAt: new Date(),
  },
  {
    id: "3",
    name: "Camiseta Premium",
    price: 29.99,
    originalPrice: 39.99,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&q=80",
    description: "Camiseta de algodón orgánico con diseño moderno",
    category: "Ropa",
    categoryId: "2",
    inStock: true,
    quantity: 50,
    rating: 4.5,
    reviews: 234,
    freeShipping: false,
    hasPromotion: true,
    promotionPercentage: 25,
    promotionStartDate: new Date("2024-01-15"),
    promotionEndDate: new Date("2024-02-15"),
    createdAt: new Date(),
  },
];

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: mockProducts,
      isLoading: false,
      error: null,

      addProduct: (data: CreateProductData) => {
        // Get the category name from the category store
        const { getCategoryById } = useCategoryStore.getState();
        const category = getCategoryById(data.categoryId);

        const newProduct: Product = {
          id: Date.now().toString(),
          name: data.name,
          price: data.price,
          originalPrice: data.originalPrice,
          image: data.image,
          description: data.description,
          category: category?.name || "", // Populate category name
          categoryId: data.categoryId,
          inStock: data.inStock ?? true,
          quantity: data.quantity,
          freeShipping: data.freeShipping ?? false,
          hasPromotion: data.hasPromotion ?? false,
          promotionPercentage: data.promotionPercentage,
          promotionStartDate: data.promotionStartDate,
          promotionEndDate: data.promotionEndDate,
          createdAt: new Date(),
        };

        set((state) => ({
          products: [...state.products, newProduct],
        }));
      },

      updateProduct: (id: string, data: Partial<Product>) => {
        // If categoryId is being updated, also update the category name
        if (data.categoryId) {
          const { getCategoryById } = useCategoryStore.getState();
          const category = getCategoryById(data.categoryId);
          data.category = category?.name || "";
        }

        set((state) => ({
          products: state.products.map((product) =>
            product.id === id ? { ...product, ...data } : product
          ),
        }));
      },

      deleteProduct: (id: string) => {
        set((state) => ({
          products: state.products.filter((product) => product.id !== id),
        }));
      },

      toggleProductStatus: (id: string) => {
        set((state) => ({
          products: state.products.map((product) =>
            product.id === id
              ? { ...product, inStock: !product.inStock }
              : product
          ),
        }));
      },

      getProducts: () => {
        const { products } = get();
        return products;
      },

      getProductById: (id: string) => {
        const { products } = get();
        return products.find((product) => product.id === id);
      },

      getProductsByCategory: (categoryId: string) => {
        const { products } = get();
        return products.filter((product) => product.categoryId === categoryId);
      },

      getActiveProducts: () => {
        const { products } = get();
        return products.filter(
          (product) => product.inStock && product.quantity > 0
        );
      },

      getPromotionalProducts: () => {
        const { products } = get();
        const now = new Date();
        return products.filter((product) => {
          if (!product.hasPromotion) return false;

          // Check if promotion is currently active
          if (product.promotionStartDate && product.promotionEndDate) {
            return (
              now >= product.promotionStartDate &&
              now <= product.promotionEndDate
            );
          }

          return product.hasPromotion;
        });
      },

      searchProducts: (query: string) => {
        const { products } = get();
        const lowercaseQuery = query.toLowerCase();
        return products.filter(
          (product) =>
            product.name.toLowerCase().includes(lowercaseQuery) ||
            product.description.toLowerCase().includes(lowercaseQuery) ||
            product.category.toLowerCase().includes(lowercaseQuery)
        );
      },

      setLoading: (loading: boolean) => set({ isLoading: loading }),

      setError: (error: string | null) => set({ error }),

      clearError: () => set({ error: null }),
    }),
    {
      name: "product-store",
      storage: createJSONStorage(() => localStorage),
      // Avoid hydration issues by only persisting essential data
      partialize: (state) => ({ products: state.products }),
    }
  )
);
