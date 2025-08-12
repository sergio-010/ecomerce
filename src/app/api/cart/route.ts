import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import { serializeProduct } from "@/lib/server-utils";

// GET /api/cart - Obtener carrito del usuario
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        product: {
          include: {
            images: {
              take: 1,
              orderBy: {
                sortOrder: "asc",
              },
            },
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calcular totales
    const subtotal = cartItems.reduce((total, item) => {
      return total + item.product.price.toNumber() * item.quantity;
    }, 0);

    const taxRate = 0.1; // 10% tax
    const tax = subtotal * taxRate;
    const shipping = subtotal >= 100 ? 0 : 9.99; // Free shipping over $100
    const total = subtotal + tax + shipping;

    // Serializar productos para el frontend
    const serializedCartItems = cartItems.map((item) => ({
      ...item,
      product: serializeProduct(item.product),
    }));

    return NextResponse.json({
      items: serializedCartItems,
      summary: {
        itemCount: cartItems.reduce((count, item) => count + item.quantity, 0),
        subtotal,
        tax,
        shipping,
        total,
      },
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// POST /api/cart - Agregar producto al carrito
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { productId, quantity = 1 } = await request.json();

    // Validar datos requeridos
    if (!productId) {
      return NextResponse.json(
        { error: "Product ID es requerido" },
        { status: 400 }
      );
    }

    // Verificar que el producto existe y está activo
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        isActive: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    // Verificar stock disponible
    if (product.stock < quantity) {
      return NextResponse.json(
        { error: "Stock insuficiente" },
        { status: 400 }
      );
    }

    // Buscar si el producto ya está en el carrito
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    });

    let cartItem;

    if (existingCartItem) {
      // Actualizar cantidad
      const newQuantity = existingCartItem.quantity + quantity;

      if (product.stock < newQuantity) {
        return NextResponse.json(
          { error: "Stock insuficiente para la cantidad solicitada" },
          { status: 400 }
        );
      }

      cartItem = await prisma.cartItem.update({
        where: {
          id: existingCartItem.id,
        },
        data: {
          quantity: newQuantity,
        },
        include: {
          product: {
            include: {
              images: {
                take: 1,
                orderBy: {
                  sortOrder: "asc",
                },
              },
            },
          },
        },
      });
    } else {
      // Crear nuevo item en carrito
      cartItem = await prisma.cartItem.create({
        data: {
          userId: session.user.id,
          productId,
          quantity,
        },
        include: {
          product: {
            include: {
              images: {
                take: 1,
                orderBy: {
                  sortOrder: "asc",
                },
              },
            },
          },
        },
      });
    }

    return NextResponse.json(
      {
        ...cartItem,
        product: serializeProduct(cartItem.product),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// DELETE /api/cart - Limpiar carrito
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    await prisma.cartItem.deleteMany({
      where: {
        userId: session.user.id,
      },
    });

    return NextResponse.json({ message: "Carrito limpiado" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
