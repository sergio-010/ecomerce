export * from "./cart";
export * from "./product";
export * from "./store";
export * from "./banner";
export * from "./category";
export * from "./order";

// Prisma Types
import type {
  User,
  Product,
  Category,
  Order,
  OrderItem,
  CartItem,
  FavoriteItem,
  Address,
  Review,
  Banner,
  ProductImage,
  ProductVariant,
  StoreSettings,
  UserRole,
  OrderStatus,
  PaymentStatus,
  AddressType,
  BannerPosition,
} from "@prisma/client";

// Re-export Prisma types
export type {
  User,
  Product,
  Category,
  Order,
  OrderItem,
  CartItem,
  FavoriteItem,
  Address,
  Review,
  Banner,
  ProductImage,
  ProductVariant,
  StoreSettings,
  UserRole,
  OrderStatus,
  PaymentStatus,
  AddressType,
  BannerPosition,
};

// Extended types with relations
export type ProductWithRelations = Product & {
  category: Category;
  images: ProductImage[];
  variants: ProductVariant[];
  reviews: Review[];
};

export type OrderWithRelations = Order & {
  user: User;
  items: (OrderItem & {
    product: Product;
  })[];
};

export type UserWithRelations = User & {
  orders: Order[];
  cartItems: (CartItem & {
    product: Product;
  })[];
  favoriteItems: (FavoriteItem & {
    product: Product;
  })[];
  addresses: Address[];
};
