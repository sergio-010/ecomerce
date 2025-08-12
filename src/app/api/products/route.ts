import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/server-utils";

// GET /api/products - Obtener productos con filtros
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured") === "true";
    const promotion = searchParams.get("promotion") === "true";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const skip = (page - 1) * limit;

    // Construir filtros
    const where: Record<string, any> = {
      isActive: true,
    };

    if (category) {
      where.category = {
        slug: category,
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { tags: { contains: search, mode: "insensitive" } },
      ];
    }

    if (featured) {
      where.isFeatured = true;
    }

    if (promotion) {
      where.isPromotion = true;
    }

    // Obtener productos
    const [rawProducts, total] = await Promise.all([
      prisma.product.findMany({
        where,
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
          _count: {
            select: {
              reviews: true,
            },
          },
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    // Serializar productos para convertir Decimal a number
    const products = rawProducts.map(serializeProduct);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// POST /api/products - Crear nuevo producto
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const {
      name,
      description,
      price,
      comparePrice,
      sku,
      stock,
      categoryId,
      isActive = true,
      isFeatured = false,
      isPromotion = false,
      weight,
      dimensions,
      tags,
      seoTitle,
      seoDescription,
      images = [],
      variants = [],
    } = data;

    // Validar datos requeridos
    if (!name || !price || !categoryId) {
      return NextResponse.json(
        { error: "Nombre, precio y categoría son requeridos" },
        { status: 400 }
      );
    }

    // Generar slug único
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    let slug = baseSlug;
    let counter = 1;

    while (await prisma.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Crear producto con relaciones
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: parseFloat(price),
        comparePrice: comparePrice ? parseFloat(comparePrice) : null,
        sku,
        stock: parseInt(stock) || 0,
        categoryId,
        isActive,
        isFeatured,
        isPromotion,
        weight: weight ? parseFloat(weight) : null,
        dimensions,
        tags: Array.isArray(tags) ? tags.join(",") : tags,
        seoTitle: seoTitle || name,
        seoDescription: seoDescription || description,
        images: {
          create: images.map(
            (image: { url: string; alt?: string }, index: number) => ({
              url: image.url,
              alt: image.alt || name,
              sortOrder: index,
            })
          ),
        },
        variants: {
          create: variants.map(
            (variant: {
              name: string;
              value: string;
              price?: number;
              stock?: number;
              sku?: string;
              isActive?: boolean;
            }) => ({
              name: variant.name,
              value: variant.value,
              price: variant.price
                ? parseFloat(variant.price.toString())
                : null,
              stock: parseInt(variant.stock?.toString() || "0"),
              sku: variant.sku,
              isActive: variant.isActive !== false,
            })
          ),
        },
      },
      include: {
        category: true,
        images: true,
        variants: true,
      },
    });

    return NextResponse.json(serializeProduct(product), { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
