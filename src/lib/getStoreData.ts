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
      images: [
        "/placeholder.svg?text=Tee-Back",
        "/placeholder.svg?text=Tee-Side",
        "/placeholder.svg?text=Tee-Detail",
      ],
      description: "Camiseta básica premium 100% algodón",
      category: "Ropa",
      categoryId: "2", // Categoría Ropa
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
      images: [
        "/placeholder.svg?text=Jeans-Back",
        "/placeholder.svg?text=Jeans-Side",
      ],
      description: "Jeans corte slim fit, estilo moderno",
      category: "Ropa",
      categoryId: "2", // Categoría Ropa
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
      images: [
        "/placeholder.svg?text=Sneakers-Side",
        "/placeholder.svg?text=Sneakers-Sole",
        "/placeholder.svg?text=Sneakers-Detail",
      ],
      description: "Zapatillas cómodas para uso diario",
      category: "Calzado",
      categoryId: "3", // Categoría Calzado
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
      images: [
        "/placeholder.svg?text=Watch-Face",
        "/placeholder.svg?text=Watch-Band",
        "/placeholder.svg?text=Watch-Side",
      ],
      description: "Reloj clásico de acero inoxidable",
      category: "Accesorios",
      categoryId: "4", // Categoría Accesorios
      inStock: true,
      createdAt: new Date(),
      rating: 4.7,
      reviews: 210,
      freeShipping: true,
      quantity: 30,
    },
    // Productos en subcategorías
    {
      id: "5",
      name: "iPhone 15 Pro",
      price: 899,
      originalPrice: 999,
      image: "/placeholder.svg?text=iPhone",
      images: [
        "/placeholder.svg?text=iPhone-Back",
        "/placeholder.svg?text=iPhone-Side",
      ],
      description: "El último iPhone con chip A17 Pro y cámara avanzada",
      category: "Smartphones",
      categoryId: "5", // Subcategoría Smartphones (hijo de Electrónicos)
      inStock: true,
      createdAt: new Date(),
      rating: 4.8,
      reviews: 152,
      freeShipping: true,
      quantity: 25,
    },
    {
      id: "6",
      name: "MacBook Air M2",
      price: 1199,
      image: "/placeholder.svg?text=MacBook",
      images: [
        "/placeholder.svg?text=MacBook-Open",
        "/placeholder.svg?text=MacBook-Side",
        "/placeholder.svg?text=MacBook-Keyboard",
      ],
      description: "Laptop ultra delgada con chip M2 de Apple",
      category: "Laptops",
      categoryId: "6", // Subcategoría Laptops (hijo de Electrónicos)
      inStock: true,
      createdAt: new Date(),
      rating: 4.9,
      reviews: 89,
      freeShipping: true,
      quantity: 15,
    },
    {
      id: "7",
      name: "Running Shoes",
      price: 120,
      image: "/placeholder.svg?text=Running",
      images: [
        "/placeholder.svg?text=Running-Side",
        "/placeholder.svg?text=Running-Sole",
      ],
      description: "Zapatillas para correr con amortiguación avanzada",
      category: "Deportivos",
      categoryId: "7", // Subcategoría Deportivos (hijo de Calzado)
      inStock: true,
      createdAt: new Date(),
      rating: 4.6,
      reviews: 67,
      freeShipping: true,
      quantity: 40,
    },
    {
      id: "8",
      name: "Formal Shoes",
      price: 150,
      image: "/placeholder.svg?text=Formal",
      images: ["/placeholder.svg?text=Formal-Side"],
      description: "Zapatos formales de cuero genuino",
      category: "Formales",
      categoryId: "8", // Subcategoría Formales (hijo de Calzado)
      inStock: true,
      createdAt: new Date(),
      rating: 4.4,
      reviews: 34,
      freeShipping: false,
      quantity: 20,
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
