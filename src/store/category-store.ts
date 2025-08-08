import { create } from "zustand";
import { Category } from "@/types";
import { toast } from "sonner";

interface CategoryStore {
  categories: Category[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchCategories: () => Promise<void>;
  addCategory: (
    category: Omit<Category, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  toggleCategoryStatus: (id: string) => Promise<void>;
  getCategoryById: (id: string) => Category | undefined;
  getCategoriesByStatus: (isActive: boolean) => Category[];
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useCategoryStore = create<CategoryStore>((set, get) => ({
  categories: [],
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/categories");
      if (!response.ok) throw new Error("Error al cargar categorías");

      const categories = await response.json();
      set({ categories, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Error desconocido",
        isLoading: false,
      });
    }
  },

  addCategory: async (categoryData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al crear categoría");
      }

      const newCategory = await response.json();
      set((state) => ({
        categories: [...state.categories, newCategory].sort(
          (a, b) => a.sortOrder - b.sortOrder
        ),
        isLoading: false,
      }));

      toast.success(`Categoría creada`, {
        description: `${categoryData.name} ha sido agregada exitosamente`,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      set({
        error: errorMessage,
        isLoading: false,
      });
      toast.error("Error al crear", {
        description: errorMessage,
      });
      throw error;
    }
  },

  updateCategory: async (id: string, categoryData: Partial<Category>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar categoría");
      }

      const updatedCategory = await response.json();
      set((state) => ({
        categories: state.categories
          .map((cat) => (cat.id === id ? updatedCategory : cat))
          .sort((a, b) => a.sortOrder - b.sortOrder),
        isLoading: false,
      }));

      toast.success(`Categoría actualizada`, {
        description: `La categoría ha sido modificada exitosamente`,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      set({
        error: errorMessage,
        isLoading: false,
      });
      toast.error("Error al actualizar", {
        description: errorMessage,
      });
      throw error;
    }
  },

  deleteCategory: async (id: string) => {
    const category = get().categories.find((c) => c.id === id);
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar categoría");
      }

      set((state) => ({
        categories: state.categories.filter((cat) => cat.id !== id),
        isLoading: false,
      }));

      if (category) {
        toast.success(`Categoría eliminada`, {
          description: `${category.name} ha sido eliminada exitosamente`,
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      set({
        error: errorMessage,
        isLoading: false,
      });
      toast.error("Error al eliminar", {
        description: errorMessage,
      });
      throw error;
    }
  },

  toggleCategoryStatus: async (id: string) => {
    const category = get().categories.find((c) => c.id === id);
    if (!category) return;

    try {
      await get().updateCategory(id, { isActive: !category.isActive });

      const status = category.isActive ? "desactivada" : "activada";
      toast.success(`Categoría ${status}`, {
        description: `${category.name} ha sido ${status} exitosamente`,
      });
    } catch (error) {
      console.error("Error toggling category status:", error);
      toast.error("Error al cambiar estado", {
        description: "No se pudo cambiar el estado de la categoría",
      });
    }
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
}));
