import { create } from "zustand";
import { Product } from "@/types";
import { toast } from "sonner";

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
      toast.success(`${product.name} agregado a favoritos`, {
        description: "Producto guardado en tus favoritos",
      });
    } else {
      toast.info(`${product.name} ya está en favoritos`, {
        description: "Este producto ya se encuentra en tu lista",
      });
    }
  },

  removeFromFavorites: (productId) => {
    const favorites = get().favorites;
    const product = favorites.find((fav) => fav.id === productId);

    const updated = favorites.filter((fav) => fav.id !== productId);
    set({ favorites: updated });

    if (product) {
      toast.success(`${product.name} eliminado de favoritos`, {
        description: "Producto removido de tu lista",
      });
    }
  },

  isFavorite: (productId) => {
    return get().favorites.some((fav) => fav.id === productId);
  },

  clearFavorites: () => {
    const favorites = get().favorites;
    const count = favorites.length;

    set({ favorites: [] });

    if (count > 0) {
      toast.success(`Favoritos limpiados`, {
        description: `Se eliminaron ${count} productos`,
      });
    }
  },
}));
