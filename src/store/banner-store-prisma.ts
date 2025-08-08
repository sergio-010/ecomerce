import { create } from "zustand";
import { Banner } from "@/types";
import { toast } from "sonner";

interface BannerState {
  banners: Banner[];
  isLoading: boolean;
  error: string | null;

  // Actions
  addBanner: (data: Omit<Banner, "id" | "createdAt" | "updatedAt">) => void;
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

// Mock data inicial compatible con Prisma schema
const mockBanners: Banner[] = [
  {
    id: "1",
    title: "¡Gran Oferta de Temporada!",
    description: "Hasta 50% de descuento en productos seleccionados",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=500&fit=crop&q=80",
    link: "/category/electronicos",
    isActive: true,
    sortOrder: 1,
    position: "HERO",
    startDate: null,
    endDate: null,
    categoryId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    title: "Nueva Colección Disponible",
    description: "Descubre los últimos productos en moda y tecnología",
    image:
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&h=500&fit=crop&q=80",
    link: "/category/ropa",
    isActive: true,
    sortOrder: 2,
    position: "CATEGORY",
    startDate: null,
    endDate: null,
    categoryId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const useBannerStore = create<BannerState>()((set, get) => ({
  banners: mockBanners,
  isLoading: false,
  error: null,

  addBanner: (data) => {
    const newBanner: Banner = {
      ...data,
      id: Date.now().toString(),
      sortOrder: data.sortOrder ?? get().banners.length + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    set((state) => ({
      banners: [...state.banners, newBanner].sort(
        (a, b) => a.sortOrder - b.sortOrder
      ),
    }));

    toast.success(`Banner creado`, {
      description: `${data.title} ha sido agregado exitosamente`,
    });
  },

  updateBanner: (id: string, data: Partial<Banner>) => {
    const banner = get().banners.find((b) => b.id === id);

    set((state) => ({
      banners: state.banners
        .map((banner) =>
          banner.id === id
            ? { ...banner, ...data, updatedAt: new Date() }
            : banner
        )
        .sort((a, b) => a.sortOrder - b.sortOrder),
    }));

    if (banner) {
      toast.success(`Banner actualizado`, {
        description: `${banner.title} ha sido modificado exitosamente`,
      });
    }
  },

  deleteBanner: (id: string) => {
    const banner = get().banners.find((b) => b.id === id);

    set((state) => ({
      banners: state.banners.filter((banner) => banner.id !== id),
    }));

    if (banner) {
      toast.success(`Banner eliminado`, {
        description: `${banner.title} ha sido eliminado exitosamente`,
      });
    }
  },

  toggleBannerStatus: (id: string) => {
    const banner = get().banners.find((b) => b.id === id);

    set((state) => ({
      banners: state.banners.map((banner) =>
        banner.id === id
          ? { ...banner, isActive: !banner.isActive, updatedAt: new Date() }
          : banner
      ),
    }));

    if (banner) {
      const status = banner.isActive ? "desactivado" : "activado";
      toast.success(`Banner ${status}`, {
        description: `${banner.title} ha sido ${status} exitosamente`,
      });
    }
  },

  reorderBanners: (banners: Banner[]) => {
    const updatedBanners = banners.map((banner, index) => ({
      ...banner,
      sortOrder: index + 1,
      updatedAt: new Date(),
    }));
    set({ banners: updatedBanners });

    toast.success(`Orden actualizado`, {
      description: `El orden de los banners ha sido guardado`,
    });
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
      .sort((a, b) => a.sortOrder - b.sortOrder);
  },

  getBannerById: (id: string) => {
    const { banners } = get();
    return banners.find((banner) => banner.id === id);
  },

  setLoading: (loading: boolean) => set({ isLoading: loading }),

  setError: (error: string | null) => set({ error }),

  clearError: () => set({ error: null }),
}));
