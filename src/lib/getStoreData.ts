import { Product, StoreConfig } from "@/types";

export async function getProducts(): Promise<Product[]> {
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
    {
      id: "3",
      name: "Casual Sneakers",
      price: 79,
      originalPrice: 99,
      image: "/placeholder.svg?text=Sneakers",
      description: "Zapatillas cómodas para uso diario",
      category: "Calzado",
      inStock: true,
      createdAt: new Date(),
      rating: 4.3,
      reviews: 95,
      freeShipping: true,
      quantity: 75,
    },
    {
      id: "4",
      name: "Classic Watch",
      price: 149,
      image: "/placeholder.svg?text=Watch",
      description: "Reloj clásico de acero inoxidable",
      category: "Accesorios",
      inStock: true,
      createdAt: new Date(),
      rating: 4.7,
      reviews: 210,
      freeShipping: true,
      quantity: 30,
    },
  ];

  return products;
}

// Función de compatibilidad temporal (se puede eliminar más tarde)
export async function getStoreData(
  slug: string
): Promise<{ products: Product[]; config: StoreConfig }> {
  const products = await getProducts();

  // Simula configuración de tienda
  const config: StoreConfig = {
    name: slug.charAt(0).toUpperCase() + slug.slice(1),
    logo: "/placeholder.svg",
    primaryColor: "#111827",
    accentColor: "#ef4444",
  };

  return { products, config };
}
