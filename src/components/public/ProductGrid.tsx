"use client"

import { useState } from "react"
import { ProductCard } from "./ProductCard"
import { Product } from "@/types"
import { ProductModal } from "./ProductModal"

interface Props {
    products: Product[]
}

export function ProductGrid({ products }: Props) {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-8">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onViewMore={setSelectedProduct}
                    />
                ))}
            </div>

            <ProductModal
                product={selectedProduct}
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />
        </>
    )
}
