import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/products/[id] - Obtener producto por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: {
        id,
        isActive: true,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },
        variants: {
          where: {
            isActive: true,
          },
        },
        reviews: {
          where: {
            isApproved: true,
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 10,
        },
        _count: {
          select: {
            reviews: {
              where: {
                isApproved: true,
              },
            },
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    // Calcular promedio de rating
    const reviews = await prisma.review.findMany({
      where: {
        productId: id,
        isApproved: true,
      },
      select: {
        rating: true,
      },
    });

    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        : 0;

    return NextResponse.json({
      ...product,
      averageRating: Math.round(averageRating * 10) / 10,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Actualizar producto
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    const {
      name,
      description,
      price,
      comparePrice,
      sku,
      stock,
      categoryId,
      isActive,
      isFeatured,
      isPromotion,
      weight,
      dimensions,
      tags,
      seoTitle,
      seoDescription,
      images = [],
    } = data;

    // Verificar que el producto existe
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    // Actualizar producto con transacción
    const updatedProduct = await prisma.$transaction(async (tx) => {
      // Si se proporcionan imágenes, eliminar las existentes
      if (images.length > 0) {
        await tx.productImage.deleteMany({
          where: { productId: id },
        });
      }

      // Actualizar producto
      const product = await tx.product.update({
        where: { id },
        data: {
          name,
          description,
          price: price ? parseFloat(price) : undefined,
          comparePrice: comparePrice ? parseFloat(comparePrice) : null,
          sku,
          stock: stock !== undefined ? parseInt(stock) : undefined,
          categoryId,
          isActive,
          isFeatured,
          isPromotion,
          weight: weight ? parseFloat(weight) : null,
          dimensions,
          tags: Array.isArray(tags) ? tags.join(",") : tags,
          seoTitle: seoTitle || name,
          seoDescription: seoDescription || description,
        },
        include: {
          category: true,
          images: true,
          variants: true,
        },
      });

      // Crear nuevas imágenes si se proporcionaron
      if (images.length > 0) {
        await tx.productImage.createMany({
          data: images.map(
            (image: { url: string; alt?: string }, index: number) => ({
              productId: id,
              url: image.url,
              alt: image.alt || name,
              sortOrder: index,
            })
          ),
        });
      }

      return product;
    });

    // Obtener el producto actualizado con todas las relaciones
    const finalProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },
        variants: true,
      },
    });

    return NextResponse.json(finalProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Eliminar producto (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verificar que el producto existe
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    // Soft delete - marcar como inactivo
    await prisma.product.update({
      where: { id },
      data: {
        isActive: false,
      },
    });

    return NextResponse.json({ message: "Producto eliminado exitosamente" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
