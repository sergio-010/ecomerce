export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  isActive: boolean;
  sortOrder: number;

  // Subcategorías
  parentId?: string | null;
  parent?: Category | null;
  subcategories?: Category[];

  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryData {
  name: string;
  slug?: string;
  description?: string | null;
  image?: string | null;
  isActive?: boolean;
  sortOrder?: number;
  parentId?: string | null;
}
