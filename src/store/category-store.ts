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
}

// Mock data con categorías completas e imágenes profesionales
const mockCategories: Category[] = [
  {
    id: "1",
    name: "Electrónicos",
    slug: "electronicos",
    description:
      "Dispositivos electrónicos, smartphones, tablets y accesorios tecnológicos",
    imageUrl:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isActive: true,
    order: 1,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    name: "Ropa",
    slug: "ropa",
    description:
      "Ropa de moda para hombres, mujeres y niños. Las últimas tendencias en vestimenta",
    imageUrl:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isActive: true,
    order: 2,
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-02"),
  },
  {
    id: "3",
    name: "Hogar",
    slug: "hogar",
    description:
      "Muebles, decoración, electrodomésticos y artículos para el hogar",
    imageUrl:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isActive: true,
    order: 3,
    createdAt: new Date("2024-01-03"),
    updatedAt: new Date("2024-01-03"),
  },
  {
    id: "4",
    name: "Deportes",
    slug: "deportes",
    description:
      "Equipamiento deportivo, ropa deportiva y accesorios para fitness",
    imageUrl:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isActive: true,
    order: 4,
    createdAt: new Date("2024-01-04"),
    updatedAt: new Date("2024-01-04"),
  },
  {
    id: "5",
    name: "Belleza",
    slug: "belleza",
    description:
      "Productos de belleza, cuidado personal, cosméticos y fragancias",
    imageUrl:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isActive: true,
    order: 5,
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-05"),
  },
  {
    id: "6",
    name: "Libros",
    slug: "libros",
    description:
      "Libros de todos los géneros, literatura, educación y entretenimiento",
    imageUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isActive: true,
    order: 6,
    createdAt: new Date("2024-01-06"),
    updatedAt: new Date("2024-01-06"),
  },
  {
    id: "7",
    name: "Juguetes",
    slug: "juguetes",
    description:
      "Juguetes para niños de todas las edades, educativos y de entretenimiento",
    imageUrl:
      "https://images.unsplash.com/photo-1558060370-d644479cb6f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isActive: true,
    order: 7,
    createdAt: new Date("2024-01-07"),
    updatedAt: new Date("2024-01-07"),
  },
  {
    id: "8",
    name: "Automóvil",
    slug: "automovil",
    description:
      "Accesorios para automóviles, repuestos y productos de mantenimiento",
    imageUrl:
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isActive: true,
    order: 8,
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-08"),
  },
  {
    id: "9",
    name: "Mascotas",
    slug: "mascotas",
    description: "Productos para mascotas, alimentación, juguetes y accesorios",
    imageUrl:
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isActive: true,
    order: 9,
    createdAt: new Date("2024-01-09"),
    updatedAt: new Date("2024-01-09"),
  },
  {
    id: "10",
    name: "Jardín",
    slug: "jardin",
    description:
      "Herramientas de jardinería, plantas, macetas y decoración exterior",
    imageUrl:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isActive: true,
    order: 10,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    id: "11",
    name: "Música",
    slug: "musica",
    description:
      "Instrumentos musicales, equipos de audio y accesorios musicales",
    imageUrl:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isActive: true,
    order: 11,
    createdAt: new Date("2024-01-11"),
    updatedAt: new Date("2024-01-11"),
  },
  {
    id: "12",
    name: "Oficina",
    slug: "oficina",
    description:
      "Suministros de oficina, muebles para oficina y equipos de trabajo",
    imageUrl:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isActive: true,
    order: 12,
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-12"),
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
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          set((state) => ({
            categories: [...state.categories, newCategory],
          }));

          toast.success("Categoría creada", {
            description: `La categoría "${newCategory.name}" se ha creado exitosamente`,
          });
        },

        updateCategory: (id, categoryData) => {
          set((state) => ({
            categories: state.categories.map((category) =>
              category.id === id
                ? { ...category, ...categoryData, updatedAt: new Date() }
                : category
            ),
          }));

          toast.success("Categoría actualizada", {
            description: "Los cambios se han guardado correctamente",
          });
        },

        deleteCategory: (id) => {
          const category = get().categories.find((c) => c.id === id);

          set((state) => ({
            categories: state.categories.filter(
              (category) => category.id !== id
            ),
          }));

          toast.success("Categoría eliminada", {
            description: `La categoría "${category?.name}" se ha eliminado correctamente`,
          });
        },

        toggleCategoryStatus: (id) => {
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

          toast.info("Estado actualizado", {
            description: `La categoría "${category?.name}" está ahora ${
              category?.isActive ? "inactiva" : "activa"
            }`,
          });
        },

        activateAllCategories: () => {
          set((state) => ({
            categories: state.categories.map((category) => ({
              ...category,
              isActive: true,
              updatedAt: new Date(),
            })),
          }));

          toast.success("Todas las categorías activadas", {
            description: "Se han activado todas las categorías correctamente",
          });
        },

        getCategoryById: (id) => {
          return get().categories.find((category) => category.id === id);
        },

        getCategoriesByStatus: (isActive) => {
          return get().categories.filter(
            (category) => category.isActive === isActive
          );
        },
      }),
      {
        name: "category-store",
      }
    )
  )
);
