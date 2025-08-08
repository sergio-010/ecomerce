import { create } from "zustand";
import type { Product, CreateProductData } from "@/types";
import { toast } from "sonner";

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

// Mock data con productos organizados por categorías con imágenes profesionales
const mockProducts: Product[] = [
  // ========== ELECTRÓNICOS (ID: 1) ==========
  {
    id: "1",
    name: "iPhone 15 Pro Max",
    price: 4299900,
    originalPrice: 4799900,
    image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    description: "El iPhone más avanzado con chip A17 Pro, cámara de 48MP con zoom óptico 5x y titanio de grado aeroespacial.",
    category: "Electrónicos",
    categoryId: "1",
    inStock: true,
    quantity: 25,
    rating: 4.9,
    reviews: 342,
    freeShipping: true,
    hasPromotion: true,
    promotionPercentage: 10,
    promotionStartDate: new Date("2024-01-01"),
    promotionEndDate: new Date("2024-12-31"),
    createdAt: new Date(),
  },
  {
    id: "2",
    name: "Samsung Galaxy S24 Ultra",
    price: 3899900,
    originalPrice: 4199900,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    description: "Smartphone premium con S Pen integrado, cámara de 200MP y pantalla Dynamic AMOLED 2X de 6.8\".",
    category: "Electrónicos",
    categoryId: "1",
    inStock: true,
    quantity: 18,
    rating: 4.8,
    reviews: 267,
    freeShipping: true,
    hasPromotion: true,
    promotionPercentage: 7,
    promotionStartDate: new Date("2024-02-01"),
    promotionEndDate: new Date("2024-06-30"),
    createdAt: new Date(),
  },
];

export const useProductStore = create<ProductState>((set, get) => ({
  products: mockProducts,
  isLoading: false,
  error: null,

  addProduct: (data: CreateProductData) => {
    const newProduct: Product = {
      id: Date.now().toString(),
      name: data.name,
      price: data.price,
      originalPrice: data.originalPrice,
      image: data.image,
      description: data.description,
      category: "", // Will be populated by components when needed
      categoryId: data.categoryId,
      inStock: data.inStock ?? true,
      quantity: data.quantity,
      freeShipping: data.freeShipping ?? false,
      hasPromotion: data.hasPromotion ?? false,
      promotionPercentage: data.promotionPercentage,
      promotionStartDate: data.promotionStartDate,
      promotionEndDate: data.promotionEndDate,
      rating: 0,
      reviews: 0,
      createdAt: new Date(),
    };

    set((state) => ({
      products: [...state.products, newProduct],
    }));

    toast.success("Producto agregado exitosamente", {
      description: `${newProduct.name} ha sido creado`
    });
  },

  updateProduct: (id, data) => {
    set((state) => ({
      products: state.products.map((product) =>
        product.id === id ? { ...product, ...data } : product
      ),
    }));

    const product = get().products.find(p => p.id === id);
    toast.success("Producto actualizado", {
      description: `${product?.name} ha sido modificado`
    });
  },

  deleteProduct: (id) => {
    const product = get().products.find(p => p.id === id);
    
    set((state) => ({
      products: state.products.filter((product) => product.id !== id),
    }));

    if (product) {
      toast.success("Producto eliminado", {
        description: `${product.name} ha sido eliminado del catálogo`
      });
    }
  },

  toggleProductStatus: (id) => {
    set((state) => ({
      products: state.products.map((product) =>
        product.id === id
          ? { ...product, inStock: !product.inStock }
          : product
      ),
    }));

    const product = get().products.find(p => p.id === id);
    toast.success(
      `Producto ${product?.inStock ? 'activado' : 'desactivado'}`,
      { description: `Estado de "${product?.name}" actualizado` }
    );
  },

  getProducts: () => get().products,

  getProductById: (id) =>
    get().products.find((product) => product.id === id),

  getProductsByCategory: (categoryId) =>
    get().products.filter((product) => product.categoryId === categoryId),

  getActiveProducts: () =>
    get().products.filter((product) => product.inStock),

  getPromotionalProducts: () =>
    get().products.filter((product) => product.hasPromotion),

  searchProducts: (query) => {
    const products = get().products;
    const lowercaseQuery = query.toLowerCase();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(lowercaseQuery) ||
        product.description.toLowerCase().includes(lowercaseQuery) ||
        product.category.toLowerCase().includes(lowercaseQuery)
    );
  },

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),
}));
