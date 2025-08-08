import { create } from "zustand";
import type { Category, CreateCategoryData } from "@/types";

interface CategoryState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;

  // Actions
  addCategory: (data: CreateCategoryData) => void;
  updateCategory: (id: string, data: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  toggleCategoryStatus: (id: string) => void;
  activateAllCategories: () => void;
  reorderCategories: (categories: Category[]) => void;
  getAllCategories: () => Category[];
  getActiveCategories: () => Category[];
  getParentCategories: () => Category[];
  getChildCategories: (parentId: string) => Category[];
  getCategoryById: (id: string) => Category | undefined;
  getCategoryBySlug: (slug: string) => Category | undefined;
  generateSlug: (name: string) => string;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

// Mock data inicial
const mockCategories: Category[] = [
  {
    id: "1",
    name: "Electrónicos",
    slug: "electronicos",
    description: "Dispositivos electrónicos y gadgets",
    imageUrl:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=400&fit=crop&q=80",
    isActive: true,
    order: 1,
    productCount: 25,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Ropa",
    slug: "ropa",
    description: "Ropa y accesorios de moda",
    imageUrl:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop&q=80",
    isActive: true,
    order: 2,
    productCount: 45,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    name: "Hogar",
    slug: "hogar",
    description: "Artículos para el hogar y decoración",
    imageUrl:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&q=80",
    isActive: true,
    order: 3,
    productCount: 30,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    name: "Deportes",
    slug: "deportes",
    description: "Artículos deportivos y fitness",
    isActive: true,
    order: 4,
    productCount: 20,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Subcategorías de Electrónicos
  {
    id: "5",
    name: "Smartphones",
    slug: "smartphones",
    description: "Teléfonos inteligentes y accesorios",
    parentId: "1",
    isActive: true,
    order: 1,
    productCount: 15,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "6",
    name: "Laptops",
    slug: "laptops",
    description: "Computadoras portátiles",
    parentId: "1",
    isActive: true,
    order: 2,
    productCount: 8,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "7",
    name: "Tablets",
    slug: "tablets",
    description: "Tabletas y accesorios",
    parentId: "1",
    isActive: true,
    order: 3,
    productCount: 12,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Subcategorías de Ropa
  {
    id: "8",
    name: "Hombre",
    slug: "ropa-hombre",
    description: "Ropa para hombre",
    parentId: "2",
    isActive: true,
    order: 1,
    productCount: 25,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "9",
    name: "Mujer",
    slug: "ropa-mujer",
    description: "Ropa para mujer",
    parentId: "2",
    isActive: true,
    order: 2,
    productCount: 30,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "10",
    name: "Niños",
    slug: "ropa-ninos",
    description: "Ropa para niños",
    parentId: "2",
    isActive: true,
    order: 3,
    productCount: 18,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Subcategorías de Hogar
  {
    id: "11",
    name: "Muebles",
    slug: "muebles",
    description: "Muebles para el hogar",
    parentId: "3",
    isActive: true,
    order: 1,
    productCount: 15,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "12",
    name: "Decoración",
    slug: "decoracion",
    description: "Artículos decorativos",
    parentId: "3",
    isActive: true,
    order: 2,
    productCount: 22,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const useCategoryStore = create<CategoryState>()((set, get) => ({
  categories: mockCategories,
  isLoading: false,
  error: null,

  addCategory: (data: CreateCategoryData) => {
    const { generateSlug } = get();
    const slug = data.slug || generateSlug(data.name);

    const newCategory: Category = {
      id: Date.now().toString(),
      name: data.name,
      slug,
      description: data.description,
      imageUrl: data.imageUrl,
      isActive: data.isActive ?? true,
      order: data.order ?? get().categories.length + 1,
      parentId: data.parentId,
      productCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    set((state) => ({
      categories: [...state.categories, newCategory].sort(
        (a, b) => a.order - b.order
      ),
    }));
  },

  updateCategory: (id: string, data: Partial<Category>) => {
    set((state) => ({
      categories: state.categories
        .map((category) =>
          category.id === id
            ? { ...category, ...data, updatedAt: new Date() }
            : category
        )
        .sort((a, b) => a.order - b.order),
    }));
  },

  deleteCategory: (id: string) => {
    set((state) => ({
      categories: state.categories.filter(
        (category) => category.id !== id && category.parentId !== id
      ),
    }));
  },

  toggleCategoryStatus: (id: string) => {
    set((state) => ({
      categories: state.categories.map((category) =>
        category.id === id
          ? {
              ...category,
              isActive: !category.isActive,
              updatedAt: new Date(),
            }
          : category
      ),
    }));
  },

  activateAllCategories: () => {
    set((state) => ({
      categories: state.categories.map((category) => ({
        ...category,
        isActive: true,
        updatedAt: new Date(),
      })),
    }));
  },

  reorderCategories: (categories: Category[]) => {
    const updatedCategories = categories.map((category, index) => ({
      ...category,
      order: index + 1,
      updatedAt: new Date(),
    }));
    set({ categories: updatedCategories });
  },

  getAllCategories: () => {
    const { categories } = get();
    return categories.sort((a, b) => a.order - b.order);
  },

  getActiveCategories: () => {
    const { categories } = get();
    return categories
      .filter((category) => category.isActive)
      .sort((a, b) => a.order - b.order);
  },

  getParentCategories: () => {
    const { categories } = get();
    return categories
      .filter((category) => !category.parentId && category.isActive)
      .sort((a, b) => a.order - b.order);
  },

  getChildCategories: (parentId: string) => {
    const { categories } = get();
    return categories
      .filter((category) => category.parentId === parentId && category.isActive)
      .sort((a, b) => a.order - b.order);
  },

  getCategoryById: (id: string) => {
    const { categories } = get();
    return categories.find((category) => category.id === id);
  },

  getCategoryBySlug: (slug: string) => {
    const { categories } = get();
    return categories.find((category) => category.slug === slug);
  },

  generateSlug: (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  },

  setLoading: (loading: boolean) => set({ isLoading: loading }),

  setError: (error: string | null) => set({ error }),

  clearError: () => set({ error: null }),
}));
