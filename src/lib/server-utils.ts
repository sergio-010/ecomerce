import { Decimal } from "@prisma/client/runtime/library";

// Función para convertir Decimal de Prisma a number para el frontend
export function serializeProduct(product: any) {
  return {
    ...product,
    price:
      product.price instanceof Decimal
        ? product.price.toNumber()
        : Number(product.price),
    comparePrice:
      product.comparePrice instanceof Decimal
        ? product.comparePrice.toNumber()
        : product.comparePrice ? Number(product.comparePrice) : null,
    weight:
      product.weight instanceof Decimal
        ? product.weight.toNumber()
        : product.weight ? Number(product.weight) : null,
    // Serializar relaciones
    category: product.category ? {
      ...product.category
    } : null,
    images: product.images?.map((image: any) => ({
      ...image
    })) || [],
    variants:
      product.variants?.map((variant: any) => ({
        ...variant,
        price:
          variant.price instanceof Decimal
            ? variant.price.toNumber()
            : Number(variant.price),
      })) || [],
  };
}

// Función para convertir Decimal de Prisma a number en órdenes
export function serializeOrder(order: any) {
  return {
    ...order,
    subtotal:
      order.subtotal instanceof Decimal
        ? order.subtotal.toNumber()
        : order.subtotal,
    tax: order.tax instanceof Decimal ? order.tax.toNumber() : order.tax,
    shipping:
      order.shipping instanceof Decimal
        ? order.shipping.toNumber()
        : order.shipping,
    discount:
      order.discount instanceof Decimal
        ? order.discount.toNumber()
        : order.discount,
    total:
      order.total instanceof Decimal ? order.total.toNumber() : order.total,
    items:
      order.items?.map((item: any) => ({
        ...item,
        price:
          item.price instanceof Decimal ? item.price.toNumber() : item.price,
        total:
          item.total instanceof Decimal ? item.total.toNumber() : item.total,
      })) || [],
  };
}
