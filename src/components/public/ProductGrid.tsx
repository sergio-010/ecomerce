"use client"

import { ProductCard } from "./ProductCard"
import { Product } from "@/types"

interface Props {
    products: Product[]
}

export function ProductGrid({ products }: Props) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                />
            ))}
        </div>
    )
}
