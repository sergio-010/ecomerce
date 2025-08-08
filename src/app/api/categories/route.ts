import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/categories - Obtener todas las categorías
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        isActive: true,
      },
      include: {
        parent: true,
        subcategories: {
          where: {
            isActive: true,
          },
          orderBy: {
            sortOrder: "asc",
          },
        },
        _count: {
          select: {
            products: {
              where: {
                isActive: true,
              },
            },
            subcategories: {
              where: {
                isActive: true,
              },
            },
          },
        },
      },
      orderBy: {
        sortOrder: "asc",
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// POST /api/categories - Crear nueva categoría
export async function POST(request: NextRequest) {
  try {
    const {
      name,
      description,
      image,
      isActive = true,
      sortOrder = 0,
      parentId,
    } = await request.json();

    // Validar datos requeridos
    if (!name) {
      return NextResponse.json(
        { error: "El nombre es requerido" },
        { status: 400 }
      );
    }

    // Validar que la categoría padre existe si se proporciona
    if (parentId) {
      const parentCategory = await prisma.category.findUnique({
        where: { id: parentId },
      });

      if (!parentCategory) {
        return NextResponse.json(
          { error: "La categoría padre no existe" },
          { status: 400 }
        );
      }
    }

    // Generar slug único
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    let slug = baseSlug;
    let counter = 1;

    while (await prisma.category.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Crear categoría
    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        image,
        isActive,
        sortOrder: parseInt(sortOrder) || 0,
        parentId: parentId || null,
      },
      include: {
        parent: true,
        subcategories: true,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
