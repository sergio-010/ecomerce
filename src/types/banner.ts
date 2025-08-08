export type BannerPosition = "HERO" | "CATEGORY" | "SIDEBAR" | "FOOTER";

export interface Banner {
  id: string;
  title: string;
  description?: string | null;
  image: string;
  link?: string | null;
  isActive: boolean;
  sortOrder: number;
  position: BannerPosition;
  startDate?: Date | null;
  endDate?: Date | null;
  categoryId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBannerData {
  title: string;
  description?: string | null;
  image: string;
  link?: string | null;
  isActive?: boolean;
  sortOrder?: number;
  position: BannerPosition;
  startDate?: Date | null;
  endDate?: Date | null;
  categoryId?: string | null;
}
