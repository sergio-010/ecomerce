import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { Category } from "@/types";
import { toast } from "sonner";

interface CategoryStore {
  categories: Category[];
  isLoading: boolean;
  error: string | null;

  // Actions
  addCategory: (
    category: Omit<Category, "id" | "createdAt" | "updatedAt">
  ) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  toggleCategoryStatus: (id: string) => void;
  activateAllCategories: () => void;
  getCategoryById: (id: string) => Category | undefined;
  getCategoriesByStatus: (isActive: boolean) => Category[];
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

// Mock data inicial compatible con Prisma schema
const mockCategories: Category[] = [
  {
    id: "1",
    name: "Electrónicos",
    slug: "electronicos",
    description: "Dispositivos electrónicos y tecnología",
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop&q=80",
    isActive: true,
    sortOrder: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Ropa y Moda",
    slug: "ropa-moda",
    description: "Prendas de vestir y accesorios de moda",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop&q=80",
    isActive: true,
    sortOrder: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    name: "Hogar y Jardín",
    slug: "hogar-jardin",
    description: "Artículos para el hogar y jardinería",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&q=80",
    isActive: true,
    sortOrder: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    name: "Deportes",
    slug: "deportes",
    description: "Equipamiento deportivo y fitness",
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=300&fit=crop&q=80",
    isActive: true,
    sortOrder: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "5",
    name: "Libros",
    slug: "libros",
    description: "Libros físicos y digitales",
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop&q=80",
    isActive: false,
    sortOrder: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const useCategoryStore = create<CategoryStore>()(
  devtools(
    persist(
      (set, get) => ({
        categories: mockCategories,
        isLoading: false,
        error: null,

        addCategory: (categoryData) => {
          const newCategory: Category = {
            ...categoryData,
            id: Date.now().toString(),
            sortOrder: categoryData.sortOrder ?? get().categories.length + 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          set((state) => ({
            categories: [...state.categories, newCategory].sort(
              (a, b) => a.sortOrder - b.sortOrder
            ),
          }));

          toast.success(`Categoría creada`, {
            description: `${categoryData.name} ha sido agregada exitosamente`,
          });
        },

        updateCategory: (id: string, data: Partial<Category>) => {
          const category = get().categories.find((c) => c.id === id);

          set((state) => ({
            categories: state.categories
              .map((category) =>
                category.id === id
                  ? { ...category, ...data, updatedAt: new Date() }
                  : category
              )
              .sort((a, b) => a.sortOrder - b.sortOrder),
          }));

          if (category) {
            toast.success(`Categoría actualizada`, {
              description: `${category.name} ha sido modificada exitosamente`,
            });
          }
        },

        deleteCategory: (id: string) => {
          const category = get().categories.find((c) => c.id === id);

          set((state) => ({
            categories: state.categories.filter(
              (category) => category.id !== id
            ),
          }));

          if (category) {
            toast.success(`Categoría eliminada`, {
              description: `${category.name} ha sido eliminada exitosamente`,
            });
          }
        },

        toggleCategoryStatus: (id: string) => {
          const category = get().categories.find((c) => c.id === id);

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

          if (category) {
            const status = category.isActive ? "desactivada" : "activada";
            toast.success(`Categoría ${status}`, {
              description: `${category.name} ha sido ${status} exitosamente`,
            });
          }
        },

        activateAllCategories: () => {
          set((state) => ({
            categories: state.categories.map((category) => ({
              ...category,
              isActive: true,
              updatedAt: new Date(),
            })),
          }));

          toast.success(`Todas las categorías activadas`, {
            description: `Se han activado todas las categorías exitosamente`,
          });
        },

        getCategoryById: (id: string) => {
          const { categories } = get();
          return categories.find((category) => category.id === id);
        },

        getCategoriesByStatus: (isActive: boolean) => {
          const { categories } = get();
          return categories
            .filter((category) => category.isActive === isActive)
            .sort((a, b) => a.sortOrder - b.sortOrder);
        },

        setLoading: (isLoading: boolean) => set({ isLoading }),

        setError: (error: string | null) => set({ error }),

        clearError: () => set({ error: null }),
      }),
      {
        name: "category-storage",
        version: 1,
      }
    ),
    {
      name: "category-store",
    }
  )
);
