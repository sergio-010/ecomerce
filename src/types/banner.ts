export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string;
  buttonText?: string;
  isActive: boolean;
  order: number;
  startDate?: Date;
  endDate?: Date;
  backgroundColor?: string;
  textColor?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBannerData {
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string;
  buttonText?: string;
  isActive?: boolean;
  order?: number;
  startDate?: Date;
  endDate?: Date;
  backgroundColor?: string;
  textColor?: string;
}
