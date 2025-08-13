import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createSampleProducts() {
  console.log("🛒 Creando productos destacados de ejemplo...");

  // Verificar si hay categorías
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    take: 5,
  });

  if (categories.length === 0) {
    console.log(
      "⚠️ No hay categorías disponibles. Creando algunas categorías primero..."
    );

    const sampleCategories = [
      {
        name: "Electrónicos",
        slug: "electronicos",
        description: "Dispositivos electrónicos y gadgets",
        isActive: true,
        sortOrder: 1,
      },
      {
        name: "Ropa",
        slug: "ropa",
        description: "Vestimenta y accesorios",
        isActive: true,
        sortOrder: 2,
      },
      {
        name: "Hogar",
        slug: "hogar",
        description: "Artículos para el hogar",
        isActive: true,
        sortOrder: 3,
      },
    ];

    for (const category of sampleCategories) {
      await prisma.category.create({ data: category });
    }

    console.log("✅ Categorías creadas");
  }

  // Obtener categorías actualizadas
  const availableCategories = await prisma.category.findMany({
    where: { isActive: true },
    take: 3,
  });

  const products = [
    {
      name: "iPhone 15 Pro Max",
      slug: "iphone-15-pro-max",
      description:
        "El iPhone más avanzado con pantalla de 6.7 pulgadas, chip A17 Pro y sistema de cámaras profesional",
      price: 1199.99,
      comparePrice: 1299.99,
      sku: "IPH15PM001",
      stock: 25,
      isActive: true,
      isFeatured: true,
      isPromotion: true,
      weight: 0.221,
      dimensions: "159.9 x 76.7 x 8.25 mm",
      tags: "smartphone,apple,premium,5g,pro",
      seoTitle: "iPhone 15 Pro Max - Smartphone Premium",
      seoDescription:
        "Descubre el iPhone 15 Pro Max con tecnología de vanguardia y cámaras profesionales",
      categoryId: availableCategories[0]?.id,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500&h=500&fit=crop",
            alt: "iPhone 15 Pro Max",
            sortOrder: 0,
          },
          {
            url: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&h=500&fit=crop",
            alt: "iPhone 15 Pro Max vista trasera",
            sortOrder: 1,
          },
        ],
      },
    },
    {
      name: "MacBook Air M3",
      slug: "macbook-air-m3",
      description:
        "Ultrabook ligero con chip M3, ideal para productividad y creatividad",
      price: 1099.99,
      comparePrice: 1199.99,
      sku: "MBA13M3001",
      stock: 15,
      isActive: true,
      isFeatured: true,
      isPromotion: false,
      weight: 1.24,
      dimensions: "304.1 x 215 x 11.3 mm",
      tags: "laptop,apple,ultrabook,m3",
      seoTitle: "MacBook Air M3 - Ultrabook Potente",
      seoDescription:
        "MacBook Air con chip M3 para máximo rendimiento y portabilidad",
      categoryId: availableCategories[0]?.id,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop",
            alt: "MacBook Air M3",
            sortOrder: 0,
          },
          {
            url: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&h=500&fit=crop",
            alt: "MacBook Air abierto",
            sortOrder: 1,
          },
        ],
      },
    },
    {
      name: "Samsung Galaxy S24 Ultra",
      slug: "samsung-galaxy-s24-ultra",
      description:
        "Smartphone Android premium con S Pen integrado y cámaras de 200MP",
      price: 1199.99,
      comparePrice: 1299.99,
      sku: "SGS24U001",
      stock: 30,
      isActive: true,
      isFeatured: true,
      isPromotion: true,
      weight: 0.232,
      dimensions: "162.3 x 79 x 8.6 mm",
      tags: "smartphone,samsung,android,s-pen",
      seoTitle: "Samsung Galaxy S24 Ultra - Smartphone Android Premium",
      seoDescription: "Galaxy S24 Ultra con S Pen y cámaras profesionales",
      categoryId: availableCategories[0]?.id,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop",
            alt: "Samsung Galaxy S24 Ultra",
            sortOrder: 0,
          },
        ],
      },
    },
    {
      name: "Camiseta Premium Algodón",
      slug: "camiseta-premium-algodon",
      description: "Camiseta 100% algodón orgánico, perfecta para uso diario",
      price: 29.99,
      comparePrice: 39.99,
      sku: "CPR001",
      stock: 100,
      isActive: true,
      isFeatured: true,
      isPromotion: false,
      weight: 0.2,
      dimensions: "Talla M: 74cm largo",
      tags: "ropa,camiseta,algodón,básico",
      seoTitle: "Camiseta Premium de Algodón Orgánico",
      seoDescription: "Camiseta cómoda y sostenible de algodón 100% orgánico",
      categoryId: availableCategories[1]?.id,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
            alt: "Camiseta Premium",
            sortOrder: 0,
          },
        ],
      },
    },
  ];

  for (const product of products) {
    if (product.categoryId) {
      try {
        const created = await prisma.product.create({
          data: product,
          include: {
            images: true,
            category: true,
          },
        });
        console.log(`✅ Producto creado: ${created.name}`);
      } catch (error) {
        console.log(`⚠️ Error creando ${product.name}:`, error);
      }
    }
  }

  console.log("✅ Productos destacados creados exitosamente!");
}

async function main() {
  try {
    await createSampleProducts();
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
