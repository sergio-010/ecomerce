import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/categories/[id] - Obtener categoría específica
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        subcategories: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
        },
        _count: {
          select: {
            products: { where: { isActive: true } },
            subcategories: { where: { isActive: true } },
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Categoría no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// PUT /api/categories/[id] - Actualizar categoría
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name, description, image, isActive, sortOrder, parentId } =
      await request.json();

    // Verificar que la categoría existe
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Categoría no encontrada" },
        { status: 404 }
      );
    }

    // Validar que la categoría padre existe si se proporciona
    if (parentId && parentId !== existingCategory.parentId) {
      const parentCategory = await prisma.category.findUnique({
        where: { id: parentId },
      });

      if (!parentCategory) {
        return NextResponse.json(
          { error: "La categoría padre no existe" },
          { status: 400 }
        );
      }

      // Evitar que una categoría sea padre de sí misma o crear loops
      if (parentId === id) {
        return NextResponse.json(
          { error: "Una categoría no puede ser padre de sí misma" },
          { status: 400 }
        );
      }
    }

    // Generar nuevo slug si el nombre cambió
    let slug = existingCategory.slug;
    if (name && name !== existingCategory.name) {
      const baseSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

      slug = baseSlug;
      let counter = 1;

      while (
        await prisma.category.findFirst({
          where: { slug, id: { not: id } },
        })
      ) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    // Actualizar categoría
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name: name || existingCategory.name,
        slug,
        description:
          description !== undefined
            ? description
            : existingCategory.description,
        image: image !== undefined ? image : existingCategory.image,
        isActive: isActive !== undefined ? isActive : existingCategory.isActive,
        sortOrder:
          sortOrder !== undefined
            ? parseInt(sortOrder)
            : existingCategory.sortOrder,
        parentId:
          parentId !== undefined ? parentId || null : existingCategory.parentId,
      },
      include: {
        parent: true,
        subcategories: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/[id] - Eliminar categoría
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verificar que la categoría existe
    const existingCategory = await prisma.category.findUnique({
      where: { id },
      include: {
        subcategories: true,
        products: true,
      },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Categoría no encontrada" },
        { status: 404 }
      );
    }

    // Verificar si tiene subcategorías
    if (existingCategory.subcategories.length > 0) {
      return NextResponse.json(
        { error: "No se puede eliminar una categoría que tiene subcategorías" },
        { status: 400 }
      );
    }

    // Verificar si tiene productos
    if (existingCategory.products.length > 0) {
      return NextResponse.json(
        { error: "No se puede eliminar una categoría que tiene productos" },
        { status: 400 }
      );
    }

    // Eliminar categoría
    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Categoría eliminada correctamente" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
