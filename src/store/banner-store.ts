import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Banner, CreateBannerData } from "@/types";

interface BannerState {
  banners: Banner[];
  isLoading: boolean;
  error: string | null;

  // Actions
  addBanner: (data: CreateBannerData) => void;
  updateBanner: (id: string, data: Partial<Banner>) => void;
  deleteBanner: (id: string) => void;
  toggleBannerStatus: (id: string) => void;
  reorderBanners: (banners: Banner[]) => void;
  getActiveBanners: () => Banner[];
  getBannerById: (id: string) => Banner | undefined;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

// Mock data inicial
const mockBanners: Banner[] = [
  {
    id: "1",
    title: "¡Gran Oferta de Temporada!",
    subtitle: "Hasta 50% de descuento en productos seleccionados",
    imageUrl:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=500&fit=crop&q=80",
    linkUrl: "/category/electronicos",
    buttonText: "Ver Ofertas",
    isActive: true,
    order: 1,
    backgroundColor: "#3b82f6",
    textColor: "#ffffff",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    title: "Nueva Colección Disponible",
    subtitle: "Descubre los últimos productos en moda y tecnología",
    imageUrl:
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&h=500&fit=crop&q=80",
    linkUrl: "/category/ropa",
    buttonText: "Explorar",
    isActive: true,
    order: 2,
    backgroundColor: "#10b981",
    textColor: "#ffffff",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const useBannerStore = create<BannerState>()(
  persist(
    (set, get) => ({
      banners: mockBanners,
      isLoading: false,
      error: null,

      addBanner: (data: CreateBannerData) => {
        const newBanner: Banner = {
          id: Date.now().toString(),
          title: data.title,
          subtitle: data.subtitle,
          description: data.description,
          imageUrl: data.imageUrl,
          linkUrl: data.linkUrl,
          buttonText: data.buttonText,
          isActive: data.isActive ?? true,
          order: data.order ?? get().banners.length + 1,
          startDate: data.startDate,
          endDate: data.endDate,
          backgroundColor: data.backgroundColor,
          textColor: data.textColor,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set((state) => ({
          banners: [...state.banners, newBanner].sort(
            (a, b) => a.order - b.order
          ),
        }));
      },

      updateBanner: (id: string, data: Partial<Banner>) => {
        set((state) => ({
          banners: state.banners
            .map((banner) =>
              banner.id === id
                ? { ...banner, ...data, updatedAt: new Date() }
                : banner
            )
            .sort((a, b) => a.order - b.order),
        }));
      },

      deleteBanner: (id: string) => {
        set((state) => ({
          banners: state.banners.filter((banner) => banner.id !== id),
        }));
      },

      toggleBannerStatus: (id: string) => {
        set((state) => ({
          banners: state.banners.map((banner) =>
            banner.id === id
              ? { ...banner, isActive: !banner.isActive, updatedAt: new Date() }
              : banner
          ),
        }));
      },

      reorderBanners: (banners: Banner[]) => {
        const updatedBanners = banners.map((banner, index) => ({
          ...banner,
          order: index + 1,
          updatedAt: new Date(),
        }));
        set({ banners: updatedBanners });
      },

      getActiveBanners: () => {
        const { banners } = get();
        const now = new Date();
        return banners
          .filter((banner) => {
            if (!banner.isActive) return false;
            if (banner.startDate && banner.startDate > now) return false;
            if (banner.endDate && banner.endDate < now) return false;
            return true;
          })
          .sort((a, b) => a.order - b.order);
      },

      getBannerById: (id: string) => {
        const { banners } = get();
        return banners.find((banner) => banner.id === id);
      },

      setLoading: (loading: boolean) => set({ isLoading: loading }),

      setError: (error: string | null) => set({ error }),

      clearError: () => set({ error: null }),
    }),
    {
      name: "banner-store",
      storage: createJSONStorage(() => localStorage),
      // Avoid hydration issues by only persisting essential data
      partialize: (state) => ({ banners: state.banners }),
      // Handle Date serialization/deserialization
      onRehydrateStorage: () => (state) => {
        if (state?.banners) {
          state.banners = state.banners.map((banner) => ({
            ...banner,
            createdAt: new Date(banner.createdAt),
            updatedAt: new Date(banner.updatedAt),
            startDate: banner.startDate
              ? new Date(banner.startDate)
              : undefined,
            endDate: banner.endDate ? new Date(banner.endDate) : undefined,
          }));
        }
      },
    }
  )
);
