import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  {
    name: "Electrónicos",
    slug: "electronicos",
    description: "Dispositivos electrónicos y gadgets",
    isActive: true,
    sortOrder: 1,
    subcategories: [
      {
        name: "Smartphones",
        slug: "smartphones",
        description: "Teléfonos inteligentes de todas las marcas",
        sortOrder: 1,
      },
      {
        name: "Laptops",
        slug: "laptops",
        description: "Computadoras portátiles",
        sortOrder: 2,
      },
      {
        name: "Tablets",
        slug: "tablets",
        description: "Tabletas digitales",
        sortOrder: 3,
      },
    ],
  },
  {
    name: "Ropa",
    slug: "ropa",
    description: "Vestimenta para toda la familia",
    isActive: true,
    sortOrder: 2,
    subcategories: [
      {
        name: "Hombre",
        slug: "ropa-hombre",
        description: "Ropa masculina",
        sortOrder: 1,
      },
      {
        name: "Mujer",
        slug: "ropa-mujer",
        description: "Ropa femenina",
        sortOrder: 2,
      },
      {
        name: "Niños",
        slug: "ropa-ninos",
        description: "Ropa infantil",
        sortOrder: 3,
      },
    ],
  },
  {
    name: "Hogar",
    slug: "hogar",
    description: "Artículos para el hogar",
    isActive: true,
    sortOrder: 3,
    subcategories: [
      {
        name: "Cocina",
        slug: "cocina",
        description: "Utensilios y electrodomésticos de cocina",
        sortOrder: 1,
      },
      {
        name: "Decoración",
        slug: "decoracion",
        description: "Artículos decorativos",
        sortOrder: 2,
      },
      {
        name: "Limpieza",
        slug: "limpieza",
        description: "Productos de limpieza y organización",
        sortOrder: 3,
      },
    ],
  },
  {
    name: "Deportes",
    slug: "deportes",
    description: "Artículos deportivos y fitness",
    isActive: true,
    sortOrder: 4,
    subcategories: [
      {
        name: "Fitness",
        slug: "fitness",
        description: "Equipos de gimnasio y ejercicio",
        sortOrder: 1,
      },
      {
        name: "Fútbol",
        slug: "futbol",
        description: "Artículos de fútbol",
        sortOrder: 2,
      },
      {
        name: "Running",
        slug: "running",
        description: "Equipos para correr",
        sortOrder: 3,
      },
    ],
  },
];

async function seedCategories() {
  console.log("🌱 Sembrando categorías...");

  for (const categoryData of categories) {
    const { subcategories, ...mainCategory } = categoryData;

    // Crear categoría principal
    const category = await prisma.category.create({
      data: mainCategory,
    });

    console.log(`✅ Categoría creada: ${category.name}`);

    // Crear subcategorías
    if (subcategories) {
      for (const subcategoryData of subcategories) {
        const subcategory = await prisma.category.create({
          data: {
            ...subcategoryData,
            parentId: category.id,
            isActive: true,
          },
        });
        console.log(`  ↳ Subcategoría creada: ${subcategory.name}`);
      }
    }
  }

  console.log("✅ Categorías sembradas exitosamente");
}

async function main() {
  try {
    await seedCategories();
  } catch (error) {
    console.error("❌ Error sembrando categorías:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
