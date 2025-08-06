import { Product, StoreConfig } from "@/types";

export async function getStoreData(
  slug: string
): Promise<{ products: Product[]; config: StoreConfig }> {
  // Simula productos (luego se traerán de NestJS)
  const products: Product[] = [
    {
      id: "1",
      name: "Essential Tee",
      price: 29,
      originalPrice: 39,
      image: "/placeholder.svg?text=Tee",
      description: "Camiseta básica premium 100% algodón",
      category: "Ropa",
      inStock: true,
      createdAt: new Date(),
      rating: 4.5,
      reviews: 120,
      freeShipping: true,
      quantity: 100,
    },
    {
      id: "2",
      name: "Minimal Jeans",
      price: 89,
      image: "/placeholder.svg?text=Jeans",
      description: "Jeans corte slim fit, estilo moderno",
      category: "Ropa",
      inStock: true,
      createdAt: new Date(),
      rating: 4.0,
      reviews: 80,
      freeShipping: false,
      quantity: 50,
    },
  ];

  // Simula configuración de tienda
  const config: StoreConfig = {
    name: slug.charAt(0).toUpperCase() + slug.slice(1),
    logo: "/placeholder.svg",
    primaryColor: "#111827",
    accentColor: "#ef4444",
  };

  return { products, config };
}
