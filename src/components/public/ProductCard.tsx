import { Product } from "@/types"
import Image from "next/image"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"

interface ProductCardProps {
    product: Product
    onViewMore: (product: Product) => void
}

export function ProductCard({ product, onViewMore }: ProductCardProps) {
    const hasDiscount = product.originalPrice && product.originalPrice > product.price

    return (
        <div className="bg-white rounded-xl border shadow-sm hover:shadow-md transition-all duration-200">
            <div className="relative">
                <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="w-full h-48 object-cover rounded-t-xl"
                    title={product.name}
                />
                {hasDiscount && (
                    <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-md">
                        Oferta
                    </Badge>
                )}
            </div>

            <div className="p-4 flex flex-col justify-between gap-3">
                <h3 className="font-medium text-sm text-gray-900 line-clamp-2" title={product.name}>
                    {product.name}
                </h3>

                <div className="flex items-center gap-2">
                    {hasDiscount && (
                        <span className="text-sm text-gray-400 line-through">
                            ${product.originalPrice}
                        </span>
                    )}
                    <span className={`font-bold text-sm ${hasDiscount ? "text-red-600" : "text-gray-800"}`}>
                        ${product.price}
                    </span>
                </div>

                <Button
                    onClick={() => onViewMore(product)}
                    variant="outline"
                    className="w-full text-sm"
                    aria-label={`Ver más sobre ${product.name}`}
                >
                    Ver más
                </Button>
            </div>
        </div>
    )
}
