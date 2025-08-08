import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Función para formatear precios en pesos colombianos
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

// Función alternativa si se quiere mostrar sin símbolo de moneda
export function formatPriceSimple(price: number): string {
  return new Intl.NumberFormat("es-CO").format(price);
}
