import { create } from "zustand";
import { Product } from "@/types";

interface ProductState {
  products: Product[];
  addProduct: (product: any) => void;
  updateProduct: (id: string, product: any) => void;
  deleteProduct: (id: string) => void;
  getProducts: () => Product[];
}

export const useProductStore = create<ProductState>()(() => ({
  products: [],
  addProduct: () => {},
  updateProduct: () => {},
  deleteProduct: () => {},
  getProducts: () => [],
}));
