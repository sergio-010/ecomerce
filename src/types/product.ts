export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  category: string;
  categoryId?: string;
  inStock?: boolean;
  createdAt?: Date;
  rating?: number;
  reviews?: number;
  freeShipping?: boolean;
  quantity: number;
  hasPromotion?: boolean;
  promotionPercentage?: number;
  promotionStartDate?: Date;
  promotionEndDate?: Date;
}

export interface CreateProductData {
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  categoryId: string;
  inStock?: boolean;
  quantity: number;
  freeShipping?: boolean;
  hasPromotion?: boolean;
  promotionPercentage?: number;
  promotionStartDate?: Date;
  promotionEndDate?: Date;
}
