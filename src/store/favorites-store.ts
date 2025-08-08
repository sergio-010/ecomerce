import { create } from "zustand";
import { Product } from "@/types";

interface FavoritesState {
  favorites: Product[];
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesState>()((set, get) => ({
  favorites: [],

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
}));
