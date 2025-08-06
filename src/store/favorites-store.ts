import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product } from "@/types";

interface FavoritesState {
  favorites: Product[];
  isHydrated: boolean;
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  clearFavorites: () => void;
  setHydrated: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      isHydrated: false,

      setHydrated: () => set({ isHydrated: true }),

      addToFavorites: (product) => {
        const favorites = get().favorites;
        const existing = favorites.find((fav) => fav.id === product.id);

        if (!existing) {
          set({ favorites: [...favorites, product] });
        }
      },

      removeFromFavorites: (productId) => {
        const updated = get().favorites.filter((fav) => fav.id !== productId);
        set({ favorites: updated });
      },

      isFavorite: (productId) => {
        return get().favorites.some((fav) => fav.id === productId);
      },

      clearFavorites: () => {
        set({ favorites: [] });
      },
    }),
    {
      name: "favorites-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);
