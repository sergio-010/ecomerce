import { Product, StoreConfig } from "@/types";
import { prisma } from "./prisma";

export async function getProducts(): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
      },
      include: {
        category: true,
        images: true,
        variants: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return products.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      comparePrice: product.comparePrice || null,
      sku: product.sku || "",
      slug: product.slug,
      description: product.description || "",
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      isPromotion: product.isPromotion,
      stock: product.stock,
      weight: product.weight || 0,
      dimensions: product.dimensions || "",
      tags: product.tags || "",
      seoTitle: product.seoTitle || "",
      seoDescription: product.seoDescription || "",
      categoryId: product.categoryId,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }));
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        isFeatured: true,
      },
      include: {
        category: true,
        images: true,
        variants: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return products.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      comparePrice: product.comparePrice || null,
      sku: product.sku || "",
      slug: product.slug,
      description: product.description || "",
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      isPromotion: product.isPromotion,
      stock: product.stock,
      weight: product.weight || 0,
      dimensions: product.dimensions || "",
      tags: product.tags || "",
      seoTitle: product.seoTitle || "",
      seoDescription: product.seoDescription || "",
      categoryId: product.categoryId,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }));
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
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
