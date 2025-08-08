import { Product, StoreConfig } from "@/types";

export async function getProducts(): Promise<Product[]> {
  // Simula productos (luego se traerán de Prisma)
  const products: Product[] = [
    {
      id: "1",
      name: "Essential Tee",
      price: 29,
      comparePrice: 39,
      sku: "TEE-001",
      slug: "essential-tee",
      description: "Camiseta básica premium 100% algodón",
      isActive: true,
      isFeatured: false,
      isPromotion: false,
      stock: 100,
      weight: 0.2,
      dimensions: "25x20x2",
      tags: "ropa,camiseta,algodón",
      seoTitle: "Essential Tee - Camiseta Premium",
      seoDescription: "Camiseta básica premium 100% algodón",
      categoryId: "2",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      name: "Minimal Jeans",
      price: 89,
      comparePrice: null,
      sku: "JEANS-001",
      slug: "minimal-jeans",
      description: "Jeans corte slim fit, estilo moderno",
      isActive: true,
      isFeatured: false,
      isPromotion: false,
      stock: 50,
      weight: 0.8,
      dimensions: "30x25x3",
      tags: "ropa,jeans,denim",
      seoTitle: "Minimal Jeans - Jeans Modernos",
      seoDescription: "Jeans corte slim fit, estilo moderno",
      categoryId: "2",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "3",
      name: "Casual Sneakers",
      price: 79,
      comparePrice: 99,
      sku: "SNEAKERS-001",
      slug: "casual-sneakers",
      description: "Zapatillas cómodas para uso diario",
      isActive: true,
      isFeatured: true,
      isPromotion: true,
      stock: 75,
      weight: 0.5,
      dimensions: "35x15x12",
      tags: "calzado,zapatillas,casual",
      seoTitle: "Casual Sneakers - Zapatillas Cómodas",
      seoDescription: "Zapatillas cómodas para uso diario",
      categoryId: "3",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "4",
      name: "Classic Watch",
      price: 149,
      comparePrice: null,
      sku: "WATCH-001",
      slug: "classic-watch",
      description: "Reloj clásico de acero inoxidable",
      isActive: true,
      isFeatured: true,
      isPromotion: false,
      stock: 30,
      weight: 0.15,
      dimensions: "5x5x1",
      tags: "accesorios,reloj,clásico",
      seoTitle: "Classic Watch - Reloj Clásico",
      seoDescription: "Reloj clásico de acero inoxidable",
      categoryId: "4",
      createdAt: new Date(),
      updatedAt: new Date(),
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
