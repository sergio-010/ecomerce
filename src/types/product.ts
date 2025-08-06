export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  category: string;
  inStock?: boolean;
  createdAt?: Date;
  rating?: number;
  reviews?: number;
  freeShipping?: boolean;
  quantity: number;
}
