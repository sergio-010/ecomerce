export interface ProductImage {
  id: string;
  url: string;
  alt?: string | null;
  sortOrder: number;
  productId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  price?: number | null;
  stock?: number | null;
  sku?: string | null;
  isActive: boolean;
  sortOrder: number;
  productId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  comparePrice?: number | null;
  sku?: string | null;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  isPromotion: boolean;
  weight?: number | null;
  dimensions?: string | null;
  tags?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;

  // Relaciones opcionales (cuando se incluyen)
  images?: ProductImage[];
  variants?: ProductVariant[];
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface CreateProductData {
  name: string;
  slug?: string;
  description?: string | null;
  price: number;
  comparePrice?: number | null;
  sku?: string | null;
  stock?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  isPromotion?: boolean;
  weight?: number | null;
  dimensions?: string | null;
  tags?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  categoryId: string;
  images?: { url: string; alt?: string }[]; // Formato de objetos para la API
}
