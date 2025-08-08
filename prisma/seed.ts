import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed de la base de datos...");

  // Limpiar datos existentes (opcional)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.favoriteItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  await prisma.storeSettings.deleteMany();

  // 1. Crear usuarios
  console.log("👥 Creando usuarios...");
  const hashedPassword = await bcrypt.hash("admin123", 12);

  const adminUser = await prisma.user.create({
    data: {
      name: "Administrador",
      email: "admin@tienda.com",
      password: hashedPassword,
      role: "ADMIN",
      isActive: true,
    },
  });

  const regularUser = await prisma.user.create({
    data: {
      name: "Usuario Demo",
      email: "usuario@tienda.com",
      password: hashedPassword,
      role: "USER",
      isActive: true,
    },
  });

  const clientUser = await prisma.user.create({
    data: {
      name: "Cliente Demo",
      email: "cliente@test.com",
      password: hashedPassword,
      role: "USER",
      isActive: true,
    },
  });

  // 2. Crear categorías
  console.log("📂 Creando categorías...");
  const categories = [
    {
      name: "Smartphones",
      slug: "smartphones",
      description: "Dispositivos móviles de última generación",
      isActive: true,
      sortOrder: 1,
    },
    {
      name: "Laptops",
      slug: "laptops",
      description: "Computadoras portátiles para trabajo y entretenimiento",
      isActive: true,
      sortOrder: 2,
    },
    {
      name: "Moda",
      slug: "moda",
      description: "Ropa y accesorios de temporada",
      isActive: true,
      sortOrder: 3,
    },
    {
      name: "Electrodomésticos",
      slug: "electrodomesticos",
      description: "Aparatos para el hogar",
      isActive: true,
      sortOrder: 4,
    },
    {
      name: "Deportes",
      slug: "deportes",
      description: "Equipamiento deportivo y fitness",
      isActive: true,
      sortOrder: 5,
    },
    {
      name: "Libros",
      slug: "libros",
      description: "Biblioteca digital y física",
      isActive: true,
      sortOrder: 6,
    },
    {
      name: "Música",
      slug: "musica",
      description: "Instrumentos y equipos de audio",
      isActive: true,
      sortOrder: 7,
    },
    {
      name: "Gaming",
      slug: "gaming",
      description: "Videojuegos y accesorios gaming",
      isActive: true,
      sortOrder: 8,
    },
    {
      name: "Belleza",
      slug: "belleza",
      description: "Productos de cuidado personal",
      isActive: true,
      sortOrder: 9,
    },
    {
      name: "Automotive",
      slug: "automotive",
      description: "Accesorios y repuestos automotrices",
      isActive: true,
      sortOrder: 10,
    },
  ];

  const createdCategories = await Promise.all(
    categories.map((category) => prisma.category.create({ data: category }))
  );

  // 3. Crear productos de ejemplo
  console.log("📱 Creando productos...");
  const products = [
    {
      name: "iPhone 15 Pro",
      slug: "iphone-15-pro",
      description:
        "El iPhone más avanzado con chip A17 Pro y sistema de cámaras profesional",
      price: 999.99,
      comparePrice: 1099.99,
      sku: "IPH15PRO001",
      stock: 50,
      isActive: true,
      isFeatured: true,
      isPromotion: true,
      weight: 0.187,
      dimensions: "146.6 x 70.6 x 8.25 mm",
      tags: "smartphone,apple,premium,5g",
      seoTitle: "iPhone 15 Pro - El smartphone más avanzado",
      seoDescription: "Descubre el iPhone 15 Pro con tecnología de vanguardia",
      categoryId: createdCategories[0].id, // Smartphones
    },
    {
      name: 'MacBook Pro 14"',
      slug: "macbook-pro-14",
      description:
        "Potencia profesional con chip M3 Pro para desarrolladores y creativos",
      price: 1999.99,
      comparePrice: 2199.99,
      sku: "MBP14M3001",
      stock: 25,
      isActive: true,
      isFeatured: true,
      isPromotion: false,
      weight: 1.6,
      dimensions: "312.6 x 221.2 x 15.5 mm",
      tags: "laptop,apple,professional,m3",
      seoTitle: 'MacBook Pro 14" - Rendimiento profesional',
      seoDescription: "MacBook Pro con chip M3 para máximo rendimiento",
      categoryId: createdCategories[1].id, // Laptops
    },
  ];

  const createdProducts = await Promise.all(
    products.map((product) => prisma.product.create({ data: product }))
  );

  // 4. Crear banners
  console.log("🎨 Creando banners...");
  const banners = [
    {
      title: "Ofertas Black Friday",
      description: "Hasta 50% de descuento en productos seleccionados",
      image: "/images/banner-black-friday.jpg",
      link: "/category/ofertas",
      isActive: true,
      position: "HERO" as const,
      sortOrder: 1,
    },
    {
      title: "Nueva Colección",
      description: "Descubre los últimos lanzamientos en tecnología",
      image: "/images/banner-new-collection.jpg",
      link: "/category/smartphones",
      isActive: true,
      position: "CATEGORY" as const,
      sortOrder: 2,
      categoryId: createdCategories[0].id,
    },
  ];

  await Promise.all(
    banners.map((banner) => prisma.banner.create({ data: banner }))
  );

  // 5. Crear configuraciones de tienda
  console.log("⚙️ Creando configuraciones...");
  const storeSettings = [
    {
      key: "store_name",
      value: JSON.stringify("Mi Tienda eCommerce"),
    },
    {
      key: "store_description",
      value: JSON.stringify("La mejor tienda online con productos de calidad"),
    },
    {
      key: "currency",
      value: JSON.stringify("USD"),
    },
    {
      key: "tax_rate",
      value: JSON.stringify(0.1),
    },
    {
      key: "shipping_cost",
      value: JSON.stringify(9.99),
    },
    {
      key: "free_shipping_threshold",
      value: JSON.stringify(100),
    },
  ];

  await Promise.all(
    storeSettings.map((setting) =>
      prisma.storeSettings.create({ data: setting })
    )
  );

  // 6. Crear direcciones de ejemplo
  console.log("📍 Creando direcciones...");
  await prisma.address.create({
    data: {
      userId: regularUser.id,
      type: "SHIPPING",
      firstName: "Juan",
      lastName: "Pérez",
      address1: "Calle Principal 123",
      city: "Madrid",
      state: "Madrid",
      postalCode: "28001",
      country: "España",
      phone: "+34 600 123 456",
      isDefault: true,
    },
  });

  console.log("✅ Seed completado exitosamente!");
  console.log(`
📊 Datos creados:
- 👥 Usuarios: 3 (1 admin, 2 usuarios)
- 📂 Categorías: ${createdCategories.length}
- 📱 Productos: ${createdProducts.length}
- 🎨 Banners: ${banners.length}
- ⚙️ Configuraciones: ${storeSettings.length}
- 📍 Direcciones: 1

🔐 Credenciales de acceso:
Admin: admin@tienda.com / admin123
Usuario: usuario@tienda.com / admin123
Cliente: cliente@test.com / admin123
  `);
}

main()
  .catch((e) => {
    console.error("❌ Error durante el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
